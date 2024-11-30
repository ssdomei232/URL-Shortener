import ShortUrlForm from '@/components/ShortUrlForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">URL Shortener</h1>
        <ShortUrlForm />
        <div className="mt-8 text-center text-sm text-white">
          <p>如果您需要云服务器，欢迎使用<a href="https://www.rainyun.com/cat_">雨云</a>，性价比超高！</p>
          <p>注册时填写优惠码 cat ,享更多优惠！</p>
          <p className="mt-2">
            违规举报：{' '}
            <a href="mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}" className="underline">
              ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

