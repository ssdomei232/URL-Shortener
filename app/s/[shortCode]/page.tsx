"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Link,
  BarChart2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UrlData {
  longUrl: string;
  expired: boolean;
  stats: {
    visits: number;
    expiresAt: string | null;
  };
}

export default function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const [data, setData] = useState<UrlData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/url/${params.shortCode}`);
        const json = await response.json();

        if (!response.ok) {
          setError(json.error || "Failed to fetch URL data");
          return;
        }

        setData(json);
      } catch (err) {
        setError("Failed to load URL data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.shortCode]);

  useEffect(() => {
    if (data?.longUrl) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            window.location.href = data.longUrl;
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [data?.longUrl]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-red-600">
              {error || "URL Not Found"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-6">
              请求的短链接不存在或已过期。
            </p>
            <div className="text-center">
              <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 transform hover:scale-105"
              >
                来创建一个短链接吧！
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-800">
            您即将被传送...
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            您将在 {Math.ceil((100 - progress) / 20)} 秒后被传送！
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <Progress value={progress} className="w-full h-2 mb-2" />
              <p className="text-sm text-blue-600 text-center">少女祈祷中...</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <Link className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    我们的位置
                  </p>
                  <p className="text-xs text-gray-500 break-all">{`${process.env.NEXT_PUBLIC_BASE_URL}/s/${params.shortCode}`}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <BarChart2 className="text-green-600 w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">访问量</p>
                  <p className="text-xs text-gray-500">{data.stats.visits}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <ExternalLink className="text-purple-600 w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">目的地</p>
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {data.longUrl}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center space-x-2">
                <Clock className="text-orange-600 w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    过期时间
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.stats.expiresAt
                      ? new Date(data.stats.expiresAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-yellow-600 w-5 h-5" />
                <CardTitle className="text-lg font-bold text-yellow-800">
                  警告
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800">
                本链接将会为您跳转一个外部网站，我们不对这些外部网站的内容负责，请谨慎访问。
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">推广</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                雨云，高性价比的云服务商
                <a
                  href="https://www.rainyun.com/cat_"
                  className="underline ml-1 font-semibold"
                >
                  立即购买！
                </a>
              </p>
            </CardContent>
          </Card>
        </CardContent>
        // 这里可以正常使用，不过应该没啥用
        {/* <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            违规举报：{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="text-red-500 hover:underline"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <Skeleton className="h-2 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-400 to-pink-500">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/4 bg-white/50" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full bg-white/50" />
              <Skeleton className="h-4 w-3/4 mt-2 bg-white/50" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
