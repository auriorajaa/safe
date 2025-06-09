// api/news/route.ts

import { NextRequest, NextResponse } from "next/server";

// function to translate text to Indonesian using Google Translate API
async function translateToIndonesian(text: string): Promise<string> {
  try {
    // check if Google Translate API key is available
    const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (googleApiKey) {
      // use Google Translate API (recommended)
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            source: "en",
            target: "id",
            format: "text",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.data?.translations?.[0]?.translatedText || text;
      }
    }

    // fallback to LibreTranslate (free, self-hosted option)
    const libreTranslateUrl =
      process.env.LIBRE_TRANSLATE_URL || "https://libretranslate.de/translate";
    const libreResponse = await fetch(libreTranslateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "id",
        format: "text",
      }),
    });

    if (libreResponse.ok) {
      const libreData = await libreResponse.json();
      return libreData.translatedText || text;
    }

    // final fallback to Azure Translator (if available)
    const azureKey = process.env.AZURE_TRANSLATOR_KEY;
    const azureRegion = process.env.AZURE_TRANSLATOR_REGION;

    if (azureKey && azureRegion) {
      const azureResponse = await fetch(
        "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=id",
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": azureKey,
            "Ocp-Apim-Subscription-Region": azureRegion,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([{ text }]),
        }
      );

      if (azureResponse.ok) {
        const azureData = await azureResponse.json();
        return azureData[0]?.translations?.[0]?.text || text;
      }
    }

    // if all translation services fail, return original text
    console.warn("All translation services failed, returning original text");
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // return original text if translation fails
  }
}

// Function to batch translate multiple texts efficiently
async function batchTranslate(texts: string[]): Promise<string[]> {
  try {
    const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (googleApiKey && texts.length > 1) {
      // Use Google Translate batch API for efficiency
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: texts,
            source: "en",
            target: "id",
            format: "text",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return (
          data.data?.translations?.map((t: any) => t.translatedText) || texts
        );
      }
    }

    // Fallback to individual translations with delay to avoid rate limiting
    const translated = [];
    for (let i = 0; i < texts.length; i++) {
      const translatedText = await translateToIndonesian(texts[i]);
      translated.push(translatedText);

      // Add small delay between requests to avoid rate limiting
      if (i < texts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return translated;
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts;
  }
}

// Function to fetch and transform Jakarta Post data
async function fetchJakartaPostNews() {
  try {
    console.log("Fetching Jakarta Post news...");

    const response = await fetch(
      "https://jakpost.vercel.app/api/category/business/markets"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Jakarta Post news");
    }

    const data = await response.json();
    console.log("Jakarta Post data fetched, starting translation...");

    // Collect all texts to translate for batch processing
    const textsToTranslate: string[] = [];
    const textMapping: { [key: string]: number } = {};

    // Prepare featured post texts
    let featuredIndex = -1;
    if (data.featured_post) {
      featuredIndex = textsToTranslate.length;
      textsToTranslate.push(
        data.featured_post.title,
        data.featured_post.headline
      );
    }

    // Prepare regular posts texts
    const postIndexes: number[] = [];
    if (data.posts && Array.isArray(data.posts)) {
      data.posts.forEach(() => {
        postIndexes.push(textsToTranslate.length);
        // Add title and headline for each post
        textsToTranslate.push("", ""); // Placeholders, will be filled below
      });

      // Fill actual texts
      let textIndex = featuredIndex >= 0 ? featuredIndex + 2 : 0;
      data.posts.forEach((post: any) => {
        textsToTranslate[textIndex] = post.title;
        textsToTranslate[textIndex + 1] = post.headline;
        textIndex += 2;
      });
    }

    // Batch translate all texts
    console.log(`Translating ${textsToTranslate.length} texts...`);
    const translatedTexts = await batchTranslate(textsToTranslate);
    console.log("Translation completed");

    // Function to format the published date
    function formatPublishedDate(dateString: string): string {
      const now = new Date();
      let timeDiff;

      if (dateString.includes("minute")) {
        const minutes = parseInt(dateString);
        timeDiff = minutes * 60 * 1000;
      } else if (dateString.includes("hour")) {
        const hours = parseInt(dateString);
        timeDiff = hours * 60 * 60 * 1000;
      } else if (dateString.includes("day")) {
        const days = parseInt(dateString);
        timeDiff = days * 24 * 60 * 60 * 1000;
      } else if (dateString.includes("week")) {
        const weeks = parseInt(dateString);
        timeDiff = weeks * 7 * 24 * 60 * 60 * 1000;
      } else {
        return now.toISOString();
      }

      const publishedDate = new Date(now.getTime() - timeDiff);
      return publishedDate.toISOString();
    }

    // Transform Jakarta Post data to match NewsAPI format
    const articles = [];
    let translationIndex = 0;

    // Add featured post
    if (data.featured_post && featuredIndex >= 0) {
      const featuredPost = data.featured_post;
      articles.push({
        source: {
          id: "jakarta-post",
          name: "The Jakarta Post",
        },
        author: "The Jakarta Post",
        title: translatedTexts[translationIndex] || featuredPost.title,
        description:
          translatedTexts[translationIndex + 1] || featuredPost.headline,
        url: featuredPost.link,
        urlToImage: featuredPost.image,
        publishedAt: formatPublishedDate(
          featuredPost.pusblised_at.replace(" ago", "")
        ),
        content: translatedTexts[translationIndex + 1] || featuredPost.headline,
        // TAMBAHAN: Simpan teks asli untuk analisis sentiment
        originalTitle: featuredPost.title,
        originalDescription: featuredPost.headline,
      });
      translationIndex += 2;
    }

    // Add regular posts
    if (data.posts && Array.isArray(data.posts)) {
      data.posts.forEach((post: any) => {
        articles.push({
          source: {
            id: "jakarta-post",
            name: "The Jakarta Post",
          },
          author: "The Jakarta Post",
          title: translatedTexts[translationIndex] || post.title,
          description: translatedTexts[translationIndex + 1] || post.headline,
          url: post.link,
          urlToImage: post.image,
          publishedAt: formatPublishedDate(
            post.pusblised_at.replace(" ago", "")
          ),
          content: translatedTexts[translationIndex + 1] || post.headline,
          // TAMBAHAN: Simpan teks asli untuk analisis sentiment
          originalTitle: post.title,
          originalDescription: post.headline,
        });
        translationIndex += 2;
      });
    }

    console.log(`Successfully processed ${articles.length} articles`);

    return {
      status: "ok",
      totalResults: articles.length,
      articles: articles,
    };
  } catch (error) {
    console.error("Jakarta Post API error:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || "financial";
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    let isTranslating = false;
    let translationMessage = "";

    // Handle Indonesian Investment category
    if (category.toLowerCase() === "indonesian-investment") {
      console.log(
        `GET /api/news?category=${category}&pageSize=${pageSize} - Using Jakarta Post`
      );

      try {
        isTranslating = true; // Set translating status when fetching and translating data
        translationMessage =
          "Mengambil dan menerjemahkan berita dari Jakarta Post";

        const jakartaPostData = await fetchJakartaPostNews();
        // Limit results to pageSize
        const limitedArticles = jakartaPostData.articles.slice(0, pageSize);

        // Reset translating status after completion
        isTranslating = false;

        return NextResponse.json({
          ...jakartaPostData,
          articles: limitedArticles,
          totalResults: limitedArticles.length,
          isTranslating,
          translationMessage,
        });
      } catch (error) {
        console.error("Jakarta Post fetch error:", error);
        return NextResponse.json(
          {
            error: "Failed to fetch Indonesian investment news",
            isTranslating: false,
          },
          { status: 500 }
        );
      }
    }

    // Handle other categories with NewsAPI (existing logic)
    // Build a date range of one month ago → today
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const fromDate = oneMonthAgo.toISOString().split("T")[0];
    const toDate = today.toISOString().split("T")[0];

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "News API key is not configured" },
        { status: 500 }
      );
    }

    // 1) Map each "category" to a really strict, finance‐only title query
    // 2) We use qInTitle so that only articles with these exact keywords in the TITLE are returned.
    // 3) We chain OR‐terms for synonyms (e.g. "stock market" OR "equities" OR "shares")
    //    and then require at least one additional finance‐word (investment OR finance OR market).
    //    This filters out random "economy" articles that have nothing to do with markets or trading.
    const categoryTitleQueryMap: Record<string, string> = {
      "stock market": `(("stock market" OR equities OR shares OR dow OR nasdaq OR "s&p") 
                        AND (finance OR investment OR market))`,
      cryptocurrency: `((bitcoin OR ethereum OR crypto OR altcoin OR blockchain OR cryptocurrency OR stablecoin)
                        AND (price OR exchange OR market))`,
      // You could add more categories later, e.g.:
      // bonds: `(("bond" OR "government bond" OR "corporate bond") AND (yield OR market OR finance))`,
    };

    // Fall back to a generic "financial" query if category isn't recognized
    const titleQueryRaw =
      categoryTitleQueryMap[category.toLowerCase()] ||
      `(finance OR investment OR economy OR market)`;

    const encodedTitleQuery = encodeURIComponent(titleQueryRaw);

    // We keep `sources=business-insider` so that no other site slips in.
    // Note: NewsAPI does not allow filtering by "section" (like /business-insider/finance),
    // only by source at the domain level.
    const trustedSources = "business-insider";

    // Build the final URL. We use:
    //   - qInTitle=<encodedTitleQuery>
    //   - from=YYYY-MM-DD, to=YYYY-MM-DD
    //   - language=en, sortBy=publishedAt
    //   - pageSize=<pageSize>
    //   - sources=business-insider
    //   - apiKey=<YOUR_KEY>
    const apiUrl =
      `https://newsapi.org/v2/everything` +
      `?qInTitle=${encodedTitleQuery}` +
      `&from=${fromDate}` +
      `&to=${toDate}` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=${pageSize}` +
      `&sources=${encodeURIComponent(trustedSources)}` +
      `&apiKey=${apiKey}`;

    console.log(`GET /api/news?category=${category}&pageSize=${pageSize}`);

    // Revalidate every 12 hours
    const response = await fetch(apiUrl, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("News API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch news from external API", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      isTranslating: false,
      translationMessage: "",
    });
  } catch (error) {
    console.error("Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error", isTranslating: false },
      { status: 500 }
    );
  }
}
