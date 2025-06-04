// app/api/scrape-article/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// Helper function to extract text and handle potential undefined elements
const extractText = ($: cheerio.CheerioAPI, selector: string): string => {
  const element = $(selector).first();
  return element.length ? element.text().trim() : "";
};

// Helper function to extract attribute from selector
const extractAttribute = (
  $: cheerio.CheerioAPI,
  selector: string,
  attribute: string
): string => {
  const element = $(selector).first();
  return element.length ? element.attr(attribute)?.trim() || "" : "";
};

export async function GET(request: NextRequest) {
  try {
    // Get URL from query params
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Security check - only allow Business Insider URLs
    if (!url.includes("businessinsider.com")) {
      return NextResponse.json(
        { error: "Only Business Insider URLs are supported" },
        { status: 403 }
      );
    }

    console.log(`Scraping article from: ${url}`);

    // Fetch HTML content from the URL with timeout and retry capability
    const fetchWithRetry = async (attempts = 3) => {
      try {
        return await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 10000, // 10 seconds timeout
        });
      } catch (error) {
        if (attempts <= 1) throw error;
        console.log(`Retry attempt left: ${attempts - 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return fetchWithRetry(attempts - 1);
      }
    };

    const response = await fetchWithRetry();
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract article data with multiple fallback selectors

    // Title extraction with fallbacks
    let title = extractText($, "h1");
    if (!title) {
      title = extractAttribute($, 'meta[property="og:title"]', "content");
    }
    if (!title) {
      title = extractAttribute($, 'meta[name="twitter:title"]', "content");
    }
    if (!title) {
      title = $("title").text().trim();
    }

    // Author extraction with fallbacks
    let author = extractText($, 'a[rel="author"]');
    if (!author) {
      author = extractAttribute($, 'meta[name="author"]', "content");
    }
    if (!author) {
      // Look for byline structures which might contain author info
      const bylineText = extractText($, ".byline");
      if (bylineText && bylineText.includes("By")) {
        const bylineParts = bylineText.split("By");
        if (bylineParts.length > 1) {
          author = bylineParts[1].trim();
        }
      }
    }

    // If still no author found, check other common patterns
    if (!author) {
      const possibleAuthorSelectors = [
        ".author-name",
        ".contributor-name",
        '[data-e2e-name="byline-author"]',
        ".story-meta .story-author",
      ];

      for (const selector of possibleAuthorSelectors) {
        author = extractText($, selector);
        if (author) break;
      }
    }

    // Date extraction with multiple fallbacks
    let publishedDate = "";
    // Try multiple potential date formats
    const dateSelectors = [
      "time[datetime]",
      'meta[property="article:published_time"]',
      'meta[name="published_time"]',
      'meta[itemprop="datePublished"]',
      ".byline-timestamp",
      ".published-date",
      ".date",
      '[data-testid="published-timestamp"]',
    ];

    for (const selector of dateSelectors) {
      const element = $(selector).first();
      if (element.length) {
        publishedDate =
          element.attr("datetime") ||
          element.attr("content") ||
          element.text().trim();
        if (publishedDate) break;
      }
    }

    if (!publishedDate) {
      publishedDate = new Date().toISOString();
    }

    // Extract summary/description
    let summary = extractAttribute(
      $,
      'meta[property="og:description"]',
      "content"
    );
    if (!summary) {
      summary = extractAttribute($, 'meta[name="description"]', "content");
    }
    if (!summary) {
      // Try to get the first paragraph that isn't too short
      $("article p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 100 && !summary) {
          summary = text;
        }
      });
    }

    // Get the main image with multiple fallbacks
    let imageUrl = extractAttribute($, 'meta[property="og:image"]', "content");
    if (!imageUrl) {
      imageUrl = extractAttribute($, 'meta[name="twitter:image"]', "content");
    }
    if (!imageUrl) {
      // Try to find the first large image in the article
      $("article img, .article-body img, .article img").each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        const width = parseInt($(el).attr("width") || "0", 10);

        // Only use images that are likely to be content images (not icons)
        if (src && (width > 300 || !width)) {
          imageUrl = src;
          return false; // Break the loop
        }
      });
    }

    // If still no image found, look for any reasonably sized image
    if (!imageUrl) {
      $("img").each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        if (
          src &&
          !src.includes("icon") &&
          !src.includes("logo") &&
          src.match(/\.(jpeg|jpg|png|webp)/i)
        ) {
          imageUrl = src;
          return false; // Break the loop
        }
      });
    }

    // Extract article content paragraphs with adaptive selectors
    const content: string[] = [];
    const contentSelectors = [
      "article p",
      ".article-body p",
      ".article p",
      ".post-content p",
      ".entry-content p",
      ".story-content p",
      '[data-component="text-block"]',
    ];

    // Try all selectors until we find content
    let foundContent = false;
    for (const selector of contentSelectors) {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();

        // Filter out empty paragraphs, advertisements, etc.
        if (
          text &&
          !text.includes("ADVERTISEMENT") &&
          !text.includes("Click here") &&
          !text.includes("Sign up") &&
          !text.includes("Subscribe") &&
          !text.includes("©") &&
          !text.includes("Copyright") &&
          text.length > 20
        ) {
          content.push(text);
          foundContent = true;
        }
      });

      if (foundContent && content.length > 3) break;
    }

    // If we still couldn't extract content, try a more generic approach
    if (content.length < 3) {
      $("p").each((_, element) => {
        const text = $(element).text().trim();

        // Filter out very short paragraphs and likely navigation/ads
        if (
          text &&
          !text.includes("ADVERTISEMENT") &&
          !text.includes("Click here") &&
          !text.includes("Sign up") &&
          !text.includes("Subscribe") &&
          !text.includes("©") &&
          !text.includes("Copyright") &&
          text.length > 40
        ) {
          content.push(text);
        }
      });
    }

    // Extract categories/tags if available
    const categories: string[] = [];
    $('meta[property="article:tag"], meta[name="keywords"]').each((_, el) => {
      const tags = $(el).attr("content")?.split(",") || [];
      tags.forEach((tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !categories.includes(trimmedTag)) {
          categories.push(trimmedTag);
        }
      });
    });

    // Look for other category indicators
    $('.category, .tag, [data-testid="tag"]').each((_, el) => {
      const category = $(el).text().trim();
      if (category && !categories.includes(category)) {
        categories.push(category);
      }
    });

    // Build response object
    const articleData = {
      title,
      author,
      publishedDate,
      summary,
      imageUrl,
      content,
      categories: categories.slice(0, 5), // Limit to top 5 categories
      sourceUrl: url,
      readMoreUrl: url,
    };

    // Cache for 1 hour
    return NextResponse.json(articleData, {
      headers: {
        "Cache-Control": "max-age=3600, s-maxage=3600",
      },
    });
  } catch (error: any) {
    console.error("Error scraping article:", error);

    // Detailed error response
    const errorMessage = error.message || "Unknown error";
    const statusCode = error.response?.status || 500;
    const errorResponse = {
      error: "Failed to scrape article content",
      details: errorMessage,
      statusCode,
    };

    return NextResponse.json(errorResponse, { status: statusCode });
  }
}
