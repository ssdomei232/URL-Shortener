import ShortUrlForm from '@/components/ShortUrlForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">URL Shortener</h1>
        <ShortUrlForm />
        <div className="mt-8 text-center text-sm text-white">
          <p>Short links now include visit tracking and expiration!</p>
          <p className="mt-2">
            Report abusive content to:{' '}
            <a href="mailto:report@example.com" className="underline">
              report@example.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

