import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

const dataDir = process.env.NODE_ENV === 'production' ? '/app/data' : path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'shorturl.db');
const db = new Database(dbPath);

// 创建表（如果不存在）
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE,
    long_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    visits INTEGER DEFAULT 0,
    expires_at DATETIME
  )
`);

// 定义接口

interface UrlResult {
  long_url: string;
  expires_at: string | null;
}

interface UrlStats {
  visits: number;
  expires_at: string | null;
}

// 创建短链接
export function createShortUrl(longUrl: string, expiresIn: number): string {
  const shortCode = nanoid(6);
  const expiresAt = expiresIn === 0 ? null : new Date(Date.now() + expiresIn * 1000).toISOString();
  const stmt = db.prepare('INSERT INTO urls (short_code, long_url, expires_at) VALUES (?, ?, ?)');
  stmt.run(shortCode, longUrl, expiresAt);
  return shortCode;
}

// 获取长链接
export function getLongUrl(shortCode: string): { longUrl: string | null, expired: boolean } {
  const stmt = db.prepare('SELECT long_url, expires_at FROM urls WHERE short_code = ?');
  const result: UrlResult | undefined = stmt.get(shortCode) as UrlResult | undefined;
  
  if (!result) {
    return { longUrl: null, expired: false };
  }

  if (result.expires_at === null) {
    db.prepare('UPDATE urls SET visits = visits + 1 WHERE short_code = ?').run(shortCode);
    return { longUrl: result.long_url, expired: false };
  }

  const now = new Date();
  const expiresAt = new Date(result.expires_at);
  
  if (expiresAt < now) {
    return { longUrl: null, expired: true };
  }

  db.prepare('UPDATE urls SET visits = visits + 1 WHERE short_code = ?').run(shortCode);
  
  return { longUrl: result.long_url, expired: false };
}

// 获取链接统计信息
export function getUrlStats(shortCode: string): { visits: number, expiresAt: string | null } | null {
  const stmt = db.prepare('SELECT visits, expires_at FROM urls WHERE short_code = ?');
  const result: UrlStats | undefined = stmt.get(shortCode) as UrlStats | undefined;
  return result ? { visits: result.visits, expiresAt: result.expires_at } : null;
}