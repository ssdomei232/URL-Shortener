import { getLongUrl, getUrlStats } from '@/lib/db'
import Redirect from '@/components/Redirect'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Link, BarChart2, AlertTriangle } from 'lucide-react'

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  const { longUrl, expired } = getLongUrl(params.shortCode)
  const stats = getUrlStats(params.shortCode)

  if (longUrl && stats) {
    return (
      <>
        <Redirect url={longUrl} />
        <LandingPage
          longUrl={longUrl}
          shortCode={params.shortCode}
          visits={stats.visits}
          expiresAt={stats.expiresAt}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-red-600">
            {expired ? 'Link Expired' : 'Link Not Found'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            {expired
              ? 'Sorry, this short link has expired.'
              : 'The requested short link does not exist.'}
          </p>
          <div className="text-center">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
            >
              Create a New Short Link
            </a>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Report abusive content:{' '}
            <a href="mailto:report@example.com" className="text-blue-500 hover:underline">
              report@example.com
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

function LandingPage({ longUrl, shortCode, visits, expiresAt }: {
  longUrl: string
  shortCode: string
  visits: number
  expiresAt: string | null
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-800">
            You are being redirected
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            You will be redirected to your destination in 5 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={100} className="w-full h-2 bg-blue-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Link className="text-blue-600" />
              <p className="text-sm text-gray-600">
                Short URL: <span className="font-medium">{`${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortCode}`}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart2 className="text-green-600" />
              <p className="text-sm text-gray-600">
                Visits: <span className="font-medium">{visits}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link className="text-purple-600" />
              <p className="text-sm text-gray-600">
                Destination: <span className="font-medium">{longUrl}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-orange-600" />
              <p className="text-sm text-gray-600">
                Expires at: <span className="font-medium">{expiresAt ? new Date(expiresAt).toLocaleString() : 'Never'}</span>
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-yellow-600" />
              <h2 className="font-bold text-yellow-800">Disclaimer</h2>
            </div>
            <p className="text-sm text-yellow-800">
              This link will take you to an external website. We are not responsible for the content
              of external sites. Please proceed with caution.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h2 className="font-bold text-gray-800 mb-2">Advertisement</h2>
            <p className="text-sm text-gray-600">
              This could be your ad! Contact us for advertising opportunities.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Report abusive content:{' '}
            <a href="mailto:report@example.com" className="text-blue-500 hover:underline">
              report@example.com
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

