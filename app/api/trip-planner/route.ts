import { getGoogleImageUrl } from "@/lib/google-images";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { duration, budget, travelers, interests, preferredLocations } =
      await request.json();

    const apiKey = process.env.NEXT_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 
    // HERE IS THE FIX:
    // Use the current model name "gemini-1.5-pro-latest"
    //
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a travel expert specializing in Sri Lanka tourism. Create a detailed, personalized trip plan as a JSON object based on the following requirements:

Duration: ${duration}
Budget: ${budget}
Travelers: ${travelers}
Interests: ${interests}
${preferredLocations ? `Preferred Locations: ${preferredLocations}` : ""}

Return a JSON object with this exact structure:
{
  "title": "Trip Plan Title",
  "summary": "Brief overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "Day 1",
      "title": "Day Title",
      "locations": ["Location 1", "Location 2"],
      "activities": [
        {
          "time": "Morning",
          "activity": "Activity name",
          "description": "Detailed description",
          "location": "Location name",
          "duration": "2 hours",
          "cost": "$50"
        }
      ],
      "accommodation": "Hotel/Accommodation name",
      "meals": ["Breakfast", "Lunch", "Dinner"],
      "tips": "Tips for the day"
    }
  ],
  "destinations": [
    {
      "name": "Destination name",
      "description": "Description of destination",
      "highlights": ["Highlight 1", "Highlight 2"],
      "bestTimeToVisit": "Best time to visit",
      "estimatedCost": "$100"
    }
  ],
  "accommodations": [
    {
      "name": "Hotel/Accommodation name",
      "type": "Hotel/Resort/Guesthouse",
      "location": "Location",
      "priceRange": "$50-$100 per night",
      "description": "Description",
      "amenities": ["WiFi", "Pool"]
    }
  ],
  "transportation": "Transportation recommendations",
  "totalEstimatedCost": "$500-$1000",
  "tips": ["Tip 1", "Tip 2"],
  "culturalEtiquette": "Cultural etiquette information"
}

Return ONLY valid JSON object, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    let tripPlan = null;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        tripPlan = JSON.parse(jsonMatch[0]);
      } else {
        tripPlan = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("Error parsing trip plan data:", parseError);
      // Fallback: return text response
      return NextResponse.json({ 
        plan: text,
        structuredPlan: null 
      });
    }

    // Add image URLs for destinations and accommodations using Google Search
    interface Destination {
      name: string;
      description?: string;
      highlights?: string[];
      bestTimeToVisit?: string;
      estimatedCost?: string;
    }

    interface Accommodation {
      name: string;
      type?: string;
      location?: string;
      priceRange?: string;
      description?: string;
      amenities?: string[];
    }

    if (tripPlan.destinations && Array.isArray(tripPlan.destinations)) {
      tripPlan.destinations = await Promise.all(
        tripPlan.destinations.map(async (dest: Destination) => {
          const imageQuery = `${dest.name} Sri Lanka tourism`;
          const imageUrl = await getGoogleImageUrl(imageQuery);
          return {
            ...dest,
            imageUrl,
          };
        })
      );
    }

    if (tripPlan.accommodations && Array.isArray(tripPlan.accommodations)) {
      tripPlan.accommodations = await Promise.all(
        tripPlan.accommodations.map(async (acc: Accommodation) => {
          const imageQuery = `${acc.name} ${acc.location || ''} Sri Lanka hotel`;
          const imageUrl = await getGoogleImageUrl(imageQuery);
          return {
            ...acc,
            imageUrl,
          };
        })
      );
    }

    return NextResponse.json({ 
      structuredPlan: tripPlan,
      plan: null 
    });
  } catch (error) {
    console.error("Error generating trip plan:", error);

    // You can keep the improved error logging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: "Failed to generate trip plan",
        detailedError: errorMessage 
      },
      { status: 500 }
    );
  }
}