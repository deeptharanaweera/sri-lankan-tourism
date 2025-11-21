import { getGoogleImageUrl } from "@/lib/google-images";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { location, budget, travelers, preferences, checkIn, checkOut } = await request.json();

    const apiKey = process.env.NEXT_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a hotel booking expert specializing in Sri Lanka. Provide hotel recommendations as a JSON array based on the following criteria:

Location: ${location}
Budget: ${budget}
Travelers: ${travelers}
Preferences: ${preferences}
${checkIn ? `Check-in: ${checkIn}` : ""}
${checkOut ? `Check-out: ${checkOut}` : ""}

Return a JSON array of 5-7 recommended hotels. Each hotel object must have this exact structure:
{
  "name": "Hotel name",
  "rating": 4.5,
  "stars": 4,
  "priceRange": "$50-$100 per night",
  "priceMin": 50,
  "priceMax": 100,
  "location": "Specific location description",
  "description": "Brief description of the hotel",
  "amenities": ["WiFi", "Pool", "Spa", "Restaurant"],
  "highlights": ["Beachfront", "City Center", "Mountain View"],
  "pros": ["Pro 1", "Pro 2"],
  "cons": ["Con 1", "Con 2"],
  "whySuitable": "Why this hotel matches the preferences"
}

Return ONLY valid JSON array, no additional text. Example format:
[
  {
    "name": "Example Hotel",
    "rating": 4.5,
    "stars": 4,
    "priceRange": "$80-$120 per night",
    "priceMin": 80,
    "priceMax": 120,
    "location": "Beachfront, Galle",
    "description": "A luxurious beachfront resort",
    "amenities": ["WiFi", "Pool", "Spa"],
    "highlights": ["Beachfront", "Ocean View"],
    "pros": ["Great location", "Excellent service"],
    "cons": ["Can be noisy"],
    "whySuitable": "Perfect for beach lovers"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    let hotels = [];
    try {
      // Remove markdown code blocks if present
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        hotels = JSON.parse(jsonMatch[0]);
      } else {
        hotels = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("Error parsing hotel data:", parseError);
      // Fallback: return text response
      return NextResponse.json({ 
        suggestions: text,
        hotels: null 
      });
    }

    // Add image URLs based on hotel name and location
    interface HotelResponse {
      name: string;
      rating?: number;
      stars?: number;
      priceRange?: string;
      priceMin?: number;
      priceMax?: number;
      location?: string;
      description?: string;
      amenities?: string[];
      highlights?: string[];
      pros?: string[];
      cons?: string[];
      whySuitable?: string;
    }

    // Add image URLs using Google Search
    const hotelsWithImages = await Promise.all(
      hotels.map(async (hotel: HotelResponse) => {
        const imageQuery = `${hotel.name} ${location} Sri Lanka hotel`;
        const imageUrl = await getGoogleImageUrl(imageQuery);
        return {
          ...hotel,
          imageUrl,
        };
      })
    );

    return NextResponse.json({ 
      hotels: hotelsWithImages,
      suggestions: null 
    });
  } catch (error) {
    console.error("Error getting hotel suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get hotel suggestions" },
      { status: 500 }
    );
  }
}

