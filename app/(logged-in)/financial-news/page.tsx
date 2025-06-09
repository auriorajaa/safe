// app/(logged-in)/financial-news/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  Newspaper,
  TrendingUp,
  RefreshCcw,
  Clock,
  BookOpen,
  Calendar,
  X,
  Lock,
  AlertCircle,
  Sparkles,
  BookUp2,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

import { MotionDiv } from "@/components/common/motion-wrapper";
import { containerVariants, itemVariants } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

import { Globe, Zap, Crown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
  // TAMBAHAN: Fields untuk menyimpan teks asli
  originalTitle?: string;
  originalDescription?: string;
}

interface SentimentAnalysisResult {
  action_recommendations: string[];
  financial_analysis: {
    summary: string;
  };
  market_impact: {
    impact_level: string;
    market_direction: string;
  };
  risk_assessment: {
    overall_risk_level: string;
  };
  sentiment_analysis: {
    primary_sentiment: string;
    sentiment_distribution: {
      positive: {
        probability: number;
        strength: string;
      };
      neutral: {
        probability: number;
        strength: string;
      };
      negative: {
        probability: number;
        strength: string;
      };
    };
  };
}

const categories = [
  { name: "Stocks", value: "stock market" },
  // { name: "Cryptocurrency", value: "cryptocurrency" },
  { name: "Indonesian Investment", value: "indonesian-investment" }, // Baru
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("stock market");

  const [analysisResult, setAnalysisResult] =
    useState<SentimentAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentAnalysisTitle, setCurrentAnalysisTitle] = useState<
    string | null
  >(null);

  const { user } = useUser();
  const [isPro, setIsPro] = useState(false);

  const [proCheckLoading, setProCheckLoading] = useState(true);

  const fetchNews = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/news", {
        params: {
          category,
          pageSize: 15,
        },
      });

      if (response.data && response.data.articles) {
        setArticles(response.data.articles);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const checkProStatus = async () => {
      if (user) {
        const email = user.emailAddresses[0].emailAddress;
        const response = await fetch(`/api/check-pro-status?email=${email}`);
        const { isPro } = await response.json();
        setIsPro(isPro);
      }
    };
    checkProStatus();
  }, [user]);

  useEffect(() => {
    const checkProStatus = async () => {
      if (user) {
        setProCheckLoading(true);
        const email = user.emailAddresses[0].emailAddress;
        const response = await fetch(`/api/check-pro-status?email=${email}`);
        const { isPro } = await response.json();
        setIsPro(isPro);
      }
      setProCheckLoading(false); // Set loading to false when check completes
    };
    checkProStatus();
  }, [user]);

  const handleRefresh = () => {
    fetchNews(selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredArticles = articles.filter(
    (article) => article.title && article.description
  );

  // Prepare article groups for different layouts
  const featuredArticle = filteredArticles[0];
  const secondaryFeatures = filteredArticles.slice(1, 3);
  const spotlightArticles = filteredArticles.slice(3, 6);
  const gridArticles = filteredArticles.slice(6, 10);
  const listArticles = filteredArticles.slice(10);

  const formatPublishedDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  const formatSourceName = (sourceName: string) => {
    return sourceName.length > 20
      ? `${sourceName.substring(0, 20)}...`
      : sourceName;
  };

  // Function to handle image error with proper null checking
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = "none";

    const parentElement = e.currentTarget.parentElement;
    if (parentElement) {
      parentElement.classList.add(
        "bg-slate-100",
        "dark:bg-slate-800",
        "flex",
        "items-center",
        "justify-center"
      );

      const icon = document.createElement("div");
      icon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path><path d="M2 17h2"></path><path d="M2 12h2"></path><path d="M2 7h2"></path><path d="M16 4h2a2 2 0 0 1 2 2v1"></path><path d="M17 12h3"></path><path d="M16 20h2a2 2 0 0 0 2-2v-1"></path></svg>';
      parentElement.appendChild(icon);
    }
  };

  const analyzeSentiment = async (article: NewsArticle) => {
    setAnalyzing(true);
    setAnalysisError(null);

    // Gunakan originalTitle jika ada (untuk Jakarta Post), jika tidak gunakan title biasa
    const titleToAnalyze = article.originalTitle || article.title;
    const displayTitle = article.title; // Untuk ditampilkan di UI

    setCurrentAnalysisTitle(displayTitle);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_SENTIMENT_ANALYSIS_FINANCIAL_NEWS!,
        {
          text: titleToAnalyze, // Menggunakan teks asli (bahasa Inggris) untuk analisis
        }
      );

      if (response.data) {
        setAnalysisResult(response.data);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisError("Failed to analyze sentiment. Please try again.");
      setAnalysisResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  // Fungsi helper untuk menentukan apakah artikel dari Jakarta Post
  const isJakartaPostArticle = (article: NewsArticle) => {
    return article.source.id === "jakarta-post" && article.originalTitle;
  };

  const closeAnalysis = () => {
    setAnalysisResult(null);
    setCurrentAnalysisTitle(null);
    setAnalysisError(null);
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 bg-white dark:bg-slate-950">
      {/* Analysis Dialog */}
      <Dialog open={!!currentAnalysisTitle} onOpenChange={closeAnalysis}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Sentiment Analysis
            </DialogTitle>
          </DialogHeader>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Progress value={0} className="w-2/3 animate-pulse" />
              <p className="mt-4 text-sm text-slate-500">
                Analyzing sentiment...
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[70vh] pr-4">
              {analysisError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                  <AlertCircle className="h-5 w-5" />
                  {analysisError}
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
                  {/* Text Analyzed */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold mb-2 text-slate-900 dark:text-white">
                      Text Analyzed
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 italic">
                      "{currentAnalysisTitle}"
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold mb-2 text-slate-900 dark:text-white">
                      Summary
                    </h3>
                    <p>{analysisResult.financial_analysis.summary}</p>
                  </div>

                  {/* Market & Risk */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <h3 className="text-base font-semibold mb-2 text-slate-900 dark:text-white">
                        Market Impact
                      </h3>
                      <p className="mt-1 flex items-center gap-2">
                        <span className="font-medium">Direction:</span>{" "}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            analysisResult.market_impact.market_direction ===
                            "bullish"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : analysisResult.market_impact
                                  .market_direction === "bearish"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}
                        >
                          {analysisResult.market_impact.market_direction}
                        </span>
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <h3 className="text-base font-semibold mb-2 text-slate-900 dark:text-white">
                        Risk Assessment
                      </h3>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Risk Level:</span>{" "}
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            analysisResult.risk_assessment
                              .overall_risk_level === "low"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : analysisResult.risk_assessment
                                  .overall_risk_level === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {analysisResult.risk_assessment.overall_risk_level}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Sentiment Distribution */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold mb-4 text-slate-900 dark:text-white">
                      Sentiment Distribution
                    </h3>

                    {/* Primary Sentiment Badge */}
                    <div className="mb-4">
                      <span className="font-medium mr-2">
                        Primary Sentiment:
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          analysisResult.sentiment_analysis
                            .primary_sentiment === "positive"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : analysisResult.sentiment_analysis
                                .primary_sentiment === "negative"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800/20 dark:text-slate-300"
                        }`}
                      >
                        {analysisResult.sentiment_analysis.primary_sentiment}
                      </span>
                    </div>

                    {["positive", "neutral", "negative"].map((key) => {
                      const s =
                        analysisResult.sentiment_analysis
                          .sentiment_distribution[
                          key as "positive" | "neutral" | "negative"
                        ];
                      const color =
                        key === "positive"
                          ? "bg-green-100 dark:bg-green-900 [&>div]:bg-green-500"
                          : key === "neutral"
                          ? "bg-slate-100 dark:bg-slate-700 [&>div]:bg-slate-500"
                          : "bg-red-100 dark:bg-red-900 [&>div]:bg-red-500";

                      return (
                        <div key={key} className="mb-3">
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="capitalize">{key}</span>
                            <span className="text-slate-500">
                              {(s.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={s.probability * 100}
                            className={`h-2 ${color}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommended Actions */}
                  {analysisResult.action_recommendations.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h3 className="text-base font-semibold mb-2 text-slate-900 dark:text-white">
                        Recommended Actions
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {analysisResult.action_recommendations.map(
                          (action, i) => (
                            <li key={i}>{action}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Newspaper className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                SAFE Times
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                  }`}
                >
                  {category.name}
                </button>
              ))}

              {user && !isPro && !proCheckLoading && (
                <div className="ml-4">
                  <Badge className="p-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <Link href="/pricing" className="hover:underline">
                      Upgrade to Pro to unlock sentiment analysis
                    </Link>
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Category Selection */}
      <div className="md:hidden block overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-16 z-40">
        <div className="container px-4">
          <Tabs
            defaultValue={selectedCategory}
            value={selectedCategory}
            className="w-full"
          >
            <TabsList className="flex justify-start p-0 h-12 bg-transparent mb-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className="text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full px-4"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <NewsLoadingSkeleton />
        ) : (
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Today's Date */}
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <time dateTime={new Date().toISOString().split("T")[0]}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Financial News Information Alert */}
            <div className="mt-5 relative overflow-hidden rounded-xl border border-slate-200/60 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/20 to-teal-100/20 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

              <div className="relative p-6 md:p-8">
                {/* Header with icon */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Financial News & Market Intelligence with AI
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Stay informed with curated financial news, market
                      insights, and investment updates
                    </p>
                  </div>
                </div>

                {/* Content sections */}
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* News Sources Section */}
                    <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                            News Sources
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Click article titles to read full details from{" "}
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              Business Insider
                            </span>
                            . Jakarta Post articles coming soon.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Jakarta Base Section */}
                    <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            ID
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                            Jakarta-Based Coverage
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Indonesian market news included for our Jakarta
                            headquarters and local investors.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Section */}
                    {/* <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                            AI Sentiment Analysis
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Click the blue{" "}
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                              Analyze Sentiment
                            </span>{" "}
                            button for AI-powered insights.
                          </p>
                        </div>
                      </div>
                    </div> */}

                    {/* PRO Upgrade CTA
                    <div className="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">
                            Unlock PRO Features
                          </h4>
                          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-2">
                            Advanced sentiment analysis requires PRO
                            subscription.
                          </p>
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-medium rounded-md transition-all duration-200 transform hover:scale-105">
                            <Crown className="h-3 w-3" />
                            Upgrade
                          </button>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section - Featured Articles */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                <BookUp2 className="inline h-5 w-5 mr-2 text-blue-600" />
                Featured News
              </h2>
            </div>
            {featuredArticle && (
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Feature */}
                <MotionDiv
                  variants={itemVariants}
                  className="col-span-1 lg:col-span-7 xl:col-span-8"
                >
                  <article className="relative group">
                    <div className="relative aspect-[4/5] md:aspect-[16/9] overflow-hidden rounded-xl">
                      {featuredArticle.urlToImage ? (
                        <img
                          src={featuredArticle.urlToImage}
                          alt={featuredArticle.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Newspaper className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                        {/* <Badge className="mb-3 bg-blue-600 hover:bg-blue-700 text-white">
                          Breaking
                        </Badge> */}

                        <Link
                          href={`/financial-news/${encodeURIComponent(
                            featuredArticle.url
                          )}`}
                          className="hover:underline"
                          aria-label={featuredArticle.title}
                        >
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-2 line-clamp-3">
                            {featuredArticle.title}
                          </h2>
                        </Link>
                        {isPro ? (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-800 my-2"
                            onClick={() => analyzeSentiment(featuredArticle)}
                          >
                            Analyze Sentiment
                          </Button>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed my-2"
                                >
                                  <Lock className="h-4 w-4 mr-2" />
                                  Analyze Sentiment
                                </Button>
                                <div className="absolute inset-0 cursor-pointer" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-slate-900 text-white"
                            >
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span>Upgrade to Pro to analyze sentiment</span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <p className="text-sm md:text-base text-slate-200 line-clamp-2 mb-3 max-w-3xl">
                          {featuredArticle.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-slate-200">
                          <span className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {formatSourceName(featuredArticle.source.name)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatPublishedDate(featuredArticle.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </MotionDiv>

                {/* Secondary Features */}
                <div className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col space-y-4">
                  {secondaryFeatures.map((article, index) => (
                    <MotionDiv
                      key={`secondary-${index}`}
                      variants={itemVariants}
                      className="flex-1"
                    >
                      <article className="h-full relative group">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                          {article.urlToImage ? (
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Newspaper className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <Link
                              href={`/financial-news/${encodeURIComponent(
                                article.url
                              )}`}
                              className="hover:underline"
                            >
                              <h3 className="text-base sm:text-lg font-bold leading-tight mb-1 line-clamp-2">
                                {article.title}
                              </h3>{" "}
                            </Link>

                            {isPro ? (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-800 my-2"
                                onClick={() => analyzeSentiment(article)}
                              >
                                Analyze Sentiment
                              </Button>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative">
                                    <Button
                                      size="sm"
                                      disabled
                                      className="bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed my-2"
                                    >
                                      <Lock className="h-4 w-4 mr-2" />
                                      Analyze Sentiment
                                    </Button>
                                    <div className="absolute inset-0 cursor-pointer" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="bg-slate-900 text-white"
                                >
                                  <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    <span>
                                      Upgrade to Pro to analyze sentiment
                                    </span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            <div className="flex items-center gap-3 text-xs text-slate-200">
                              <span className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {formatSourceName(article.source.name)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatPublishedDate(article.publishedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </MotionDiv>
                  ))}
                </div>
              </section>
            )}

            {/* Spotlight Section */}
            {spotlightArticles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    <TrendingUp className="inline h-5 w-5 mr-2 text-blue-600" />
                    Market Spotlight
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spotlightArticles.map((article, index) => (
                    <MotionDiv
                      key={`spotlight-${index}`}
                      variants={itemVariants}
                    >
                      <article className="group relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col h-full">
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {article.urlToImage ? (
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Newspaper className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-4 gap-2">
                          <Link
                            href={`/financial-news/${encodeURIComponent(
                              article.url
                            )}`}
                            className="hover:underline"
                          >
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>

                          <div className="min-h-[4.5rem]">
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-1">
                              {article.description}
                            </p>
                          </div>

                          {isPro ? (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-800"
                              onClick={() => analyzeSentiment(article)}
                            >
                              Analyze Sentiment
                            </Button>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  <Button
                                    size="sm"
                                    disabled
                                    className="bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                                  >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Analyze Sentiment
                                  </Button>
                                  <div className="absolute inset-0 cursor-pointer" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-slate-900 text-white"
                              >
                                <div className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  <span>
                                    Upgrade to Pro to analyze sentiment
                                  </span>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          <div className="mt-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {formatSourceName(article.source.name)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatPublishedDate(article.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </article>
                    </MotionDiv>
                  ))}
                </div>
              </section>
            )}

            {/* Main Content Section with Grid and List */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Grid Articles */}
              <div className="col-span-1 lg:col-span-8">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Latest Updates
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {gridArticles.map((article, index) => (
                    <MotionDiv key={`grid-${index}`} variants={itemVariants}>
                      <article className="group relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col h-full gap-3">
                        {/* Image */}
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {article.urlToImage ? (
                            <img
                              src={article.urlToImage}
                              alt={article.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Newspaper className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <CardContent className="flex flex-col flex-1 p-4">
                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {formatSourceName(article.source.name)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatPublishedDate(article.publishedAt)}
                            </span>
                          </div>

                          {/* Title */}
                          <Link
                            href={`/financial-news/${encodeURIComponent(
                              article.url
                            )}`}
                            className="hover:underline"
                          >
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>

                          {/* Optional Description */}
                          {article.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                              {article.description}
                            </p>
                          )}

                          {/* Analyze Button (ghost, only on hover) */}
                          <div className="mt-auto pt-4">
                            {isPro ? (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-800"
                                onClick={() => analyzeSentiment(article)}
                              >
                                Analyze Sentiment
                              </Button>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative">
                                    <Button
                                      size="sm"
                                      disabled
                                      className="bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                                    >
                                      <Lock className="h-4 w-4 mr-2" />
                                      Analyze Sentiment
                                    </Button>
                                    <div className="absolute inset-0 cursor-pointer" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="bg-slate-900 text-white"
                                >
                                  <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    <span>
                                      Upgrade to Pro to analyze sentiment
                                    </span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </CardContent>
                      </article>
                    </MotionDiv>
                  ))}
                </div>
              </div>

              {/* Right Column - List Articles */}
              <div className="col-span-1 lg:col-span-4">
                <div className="sticky top-[7.5rem]">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-3 mt-4 md:mt-0">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      More News
                    </h2>
                  </div>

                  {/* List Articles */}
                  <div className="space-y-4">
                    {listArticles.map((article, index) => (
                      <MotionDiv key={`list-${index}`} variants={itemVariants}>
                        <article className="group relative rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                          {/* Title */}
                          <Link
                            href={`/financial-news/${encodeURIComponent(
                              article.url
                            )}`}
                            className="block hover:underline"
                            aria-label={article.title}
                          >
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2 mb-2">
                              {article.title}
                            </h3>
                          </Link>

                          {/* Optional Description */}
                          {article.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {article.description}
                            </p>
                          )}

                          {/* Meta & Action */}
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {formatSourceName(article.source.name)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatPublishedDate(article.publishedAt)}
                            </span>
                          </div>

                          {/* Analyze Button */}
                          <div className="mt-4 flex justify-between items-center">
                            {isPro ? (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-800"
                                onClick={() => analyzeSentiment(article)}
                              >
                                Analyze Sentiment
                              </Button>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="relative">
                                    <Button
                                      size="sm"
                                      disabled
                                      className="bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                                    >
                                      <Lock className="h-4 w-4 mr-2" />
                                      Analyze Sentiment
                                    </Button>
                                    <div className="absolute inset-0 cursor-pointer" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="bg-slate-900 text-white"
                                >
                                  <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    <span>
                                      Upgrade to Pro to analyze sentiment
                                    </span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {/* <Link
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-800 font-medium hover:underline"
                            >
                              Read More
                            </Link> */}
                          </div>
                        </article>
                      </MotionDiv>
                    ))}
                  </div>

                  {/* Refresh Button
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleRefresh}
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Refresh News
                    </Button>
                  </div> */}
                </div>
              </div>
            </section>
          </MotionDiv>
        )}
      </main>
    </div>
  );
}

function NewsLoadingSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero Section Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feature Skeleton */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Skeleton className="h-full w-full absolute inset-0" />
          </div>
        </div>

        {/* Secondary Features Skeleton */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-4 flex flex-col space-y-6">
          {[1, 2].map((item) => (
            <div key={`secondary-skeleton-${item}`} className="flex-1">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <Skeleton className="h-full w-full absolute inset-0" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spotlight Section Skeleton */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-7 w-48" />
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={`spotlight-skeleton-${item}`}>
              <Skeleton className="aspect-[4/3] w-full mb-4 rounded-lg" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Section Skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Skeleton */}
        <div className="col-span-1 lg:col-span-8">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-7 w-40" />
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={`grid-skeleton-${item}`}
                className="border rounded-lg overflow-hidden"
              >
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="col-span-1 lg:col-span-4">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-7 w-32" />
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={`list-skeleton-${item}`}
                className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
              >
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}
