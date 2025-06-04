// app/(logged-in)/financial-news/[id]/page.tsx
"use client";

import React, { use, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Share2,
  BookmarkPlus,
  ThumbsUp,
  MessageSquare,
  Eye,
  Loader2,
  UserCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ArticleContent {
  title: string;
  author: string;
  publishedDate: string;
  content: string[];
  imageUrl: string | null;
  summary?: string;
  categories?: string[];
  sourceUrl: string;
  readMoreUrl: string;
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState<ArticleContent | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // State for read more preview animation
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticleContent = async () => {
      try {
        setLoading(true);

        // Decode the URL from the parameter
        const articleUrl = decodeURIComponent(id);

        // Check if it's a Business Insider URL - important security check
        if (!articleUrl.includes("businessinsider.com")) {
          throw new Error(
            "Invalid URL. Only Business Insider articles are supported."
          );
        }

        // Send request to our scraping API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await axios.get("/api/scrape-article", {
          params: { url: articleUrl },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.data?.error) {
          throw new Error(response.data.error);
        }

        if (response.data && response.data.content?.length > 0) {
          setArticleContent(response.data);
        } else {
          throw new Error(
            "Article content could not be retrieved or is empty."
          );
        }
      } catch (err: any) {
        console.error("Error fetching article content:", err);

        // More user-friendly error messages
        if (err.name === "AbortError") {
          setError(
            "Request timed out. The article might be too large or the server is busy."
          );
        } else if (err.response?.status === 404) {
          setError(
            "Article not found. The link might be broken or the article has been removed."
          );
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Failed to load article. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticleContent();
  }, [id]);

  const handleGoBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  const formatPublishedDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      // Fallback to basic date format
      try {
        return new Date(dateString).toLocaleDateString();
      } catch {
        return "Recently published";
      }
    }
  };

  // const handleShareArticle = () => {
  //   if (navigator.share && articleContent) {
  //     navigator
  //       .share({
  //         title: articleContent.title,
  //         text: articleContent.summary || "Check out this article!",
  //         url: window.location.href,
  //       })
  //       .catch((err) => {
  //         console.error("Error sharing:", err);
  //         copyToClipboard();
  //       });
  //   } else {
  //     copyToClipboard();
  //   }
  // };

  // const copyToClipboard = () => {
  //   if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
  //     navigator.clipboard
  //       .writeText(window.location.href)
  //       .then(() => {
  //         toast.success("Link copied!", {
  //           description: "Article URL copied to clipboard",
  //         });
  //       })
  //       .catch(() => {
  //         toast.error("Failed to copy link.");
  //       });
  //   } else {
  //     toast.error("Clipboard not supported on this device.");
  //   }
  // };

  if (loading) return <ArticleLoadingSkeleton />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="flex items-center"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowLeft className="h-4 w-4 mr-2" />
          )}
          Back to news
        </Button>
      </div>
    );
  }

  if (!articleContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          Article not found or content couldn't be loaded.
        </div>
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="flex items-center"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowLeft className="h-4 w-4 mr-2" />
          )}
          Back to news
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8">
        {/* Top navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowLeft className="h-4 w-4 mr-2" />
            )}
            Back to news
          </Button>

          {/* <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    onClick={handleShareArticle}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">
                      Share
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this article</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}
        </div>

        {/* Article header */}
        <header className="mb-8">
          {/* Categories/Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
              Financial News
            </Badge>

            {articleContent.categories?.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {articleContent.title}
          </h1>

          {/* Summary */}
          {articleContent.summary && (
            <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <p className="text-slate-700 dark:text-slate-300 text-lg italic">
                {articleContent.summary}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            {/* Author info */}
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {articleContent.author
                    ? articleContent.author.substring(0, 2).toUpperCase()
                    : "BI"}
                </AvatarFallback>
              </Avatar>

              <div className="ml-3">
                <div className="font-medium text-slate-900 dark:text-white flex items-center">
                  <UserCircle className="h-3 w-3 mr-1" />
                  {articleContent.author || "Business Insider"}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatPublishedDate(
                    articleContent.publishedDate || new Date().toString()
                  )}
                </div>
              </div>
            </div>

            {/* Read time estimate */}
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {Math.max(
                  1,
                  Math.ceil(
                    articleContent.content.join(" ").split(" ").length / 200
                  )
                )}{" "}
                min read
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {articleContent.imageUrl && (
          <div className="mb-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={articleContent.imageUrl}
                alt={articleContent.title}
                className="w-full h-auto object-cover"
                loading="eager"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              Image: Business Insider
            </div>
          </div>
        )}

        {/* Article content */}
        <article className="prose dark:prose-invert prose-lg max-w-none lg:text-lg">
          {articleContent.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* Read more section */}
        <div className="mt-12">
          <Separator className="mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Want to read more?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Visit the original article on Business Insider for additional
                content.
              </p>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
            >
              <a
                href={
                  articleContent?.readMoreUrl ??
                  articleContent?.sourceUrl ??
                  "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read on Business Insider
              </a>

              {/* Preview tooltip on hover */}
              <div
                className={cn(
                  "absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 transition-all duration-200",
                  showPreview ? "opacity-100 visible" : "opacity-0 invisible"
                )}
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Opens the original article in a new tab
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Source attribution and engagement options */}
        <div className="mt-12">
          <Separator className="mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <p>Source: Business Insider</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleLoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-24" />
        
      </div>

      <div className="space-y-4 mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-3">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      <Skeleton className="h-80 w-full rounded-lg mb-8" />

      <div className="space-y-5 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            {index % 2 === 1 && <Skeleton className="h-4 w-4/5" />}
          </div>
        ))}
      </div>

      <Skeleton className="h-px w-full mb-6" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}
