'use client'

import { useState } from 'react'

export default function ShortUrlForm() {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [expiresIn, setExpiresIn] = useState('3600') // 默认1小时
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const generateShortUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: longUrl, expiresIn: parseInt(expiresIn) }),
      })

      if (!response.ok) {
        throw new Error('Failed to create short URL')
      }

      const data = await response.json()
      setShortUrl(data.shortUrl)
    } catch (err) {
      setError('An error occurred while creating the short URL')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={generateShortUrl} className="space-y-4">
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700">
            Enter your long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="https://example.com/very/long/url"
          />
        </div>
        <div>
          <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700">
            Link expiration time
          </label>
          <select
            id="expiresIn"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="3600">1 hour</option>
            <option value="86400">1 day</option>
            <option value="604800">1 week</option>
            <option value="2592000">1 month</option>
            <option value="31536000">1 year</option>
            <option value="0">Never (permanent)</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 disabled:bg-blue-300"
        >
          {isLoading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {shortUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Your shortened URL:</h2>
          <div className="mt-2 p-4 bg-gray-100 rounded-md">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {shortUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

