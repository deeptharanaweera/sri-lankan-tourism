/**
 * Get image URL from Google Search
 * Uses Google Custom Search API if available, otherwise falls back to a constructed URL
 */



/**
 * Get image URL from Google Search using Google Custom Search API
 * @param query - Search query (e.g., "Hotel Name Location Sri Lanka")
 * @returns Image URL or fallback URL
 */
export async function getGoogleImageUrl(query: string): Promise<string> {
  const apiKey = process.env.NEXT_GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.NEXT_GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  // If Google Custom Search API is configured, use it
  if (apiKey && searchEngineId) {
    try {
      const searchQuery = encodeURIComponent(query);
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${searchQuery}&searchType=image&num=1&safe=active`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          return data.items[0].link;
        }
      }
    } catch (error) {
      console.error("Error fetching from Google Custom Search API:", error);
    }
  }

  // Fallback: Use a service that provides Google image search results
  // This uses a proxy service that searches Google Images
  try {
    const encodedQuery = encodeURIComponent(query);
    // Using a service that can fetch Google image results
    // Note: This is a fallback and may have rate limits
    // const fallbackUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey || 'demo'}&cx=${searchEngineId || 'demo'}&q=${encodedQuery}&searchType=image&num=1`;

    // If API keys are not available, use Unsplash as fallback with Google-style search
    // This ensures we always return a valid image URL
    return `https://source.unsplash.com/800x600/?${encodedQuery}`;
  } catch (error) {
    console.error("Error in fallback image search:", error);
    // Ultimate fallback
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
  }
}

/**
 * Get multiple image URLs from Google Search
 * @param query - Search query
 * @param count - Number of images to fetch (default: 1)
 * @returns Array of image URLs
 */
export async function getGoogleImageUrls(query: string, count: number = 1): Promise<string[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

  if (apiKey && searchEngineId) {
    try {
      const searchQuery = encodeURIComponent(query);
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${searchQuery}&searchType=image&num=${Math.min(count, 10)}&safe=active`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          return data.items.slice(0, count).map((item: { link: string }) => item.link);
        }
      }
    } catch (error) {
      console.error("Error fetching from Google Custom Search API:", error);
    }
  }

  // Fallback: Return array with Unsplash URLs
  const encodedQuery = encodeURIComponent(query);
  return Array.from({ length: count }, (_, i) =>
    `https://source.unsplash.com/800x600/?${encodedQuery}&sig=${i}`
  );
}

