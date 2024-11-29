/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // 启用运行时配置
    serverRuntimeConfig: {
      // 将在服务器端可用
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
    publicRuntimeConfig: {
      // 将在客户端和服务器端可用
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
  }
  
module.exports = nextConfig
  
  