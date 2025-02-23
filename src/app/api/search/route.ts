import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

function convertToMinutes(timeRange : string) {
  // Split the time range into start and end times
  const [startTime, endTime] = timeRange.split('-');
  
  // Helper function to convert time to minutes since midnight
  function timeToMinutes(time : string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Convert both start and end times to minutes
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Return an array with start and end times in minutes
  return [ startMinutes, endMinutes ];
}

// Initialize API clients once
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
const indexName = "events-index2";
const index = pinecone.Index(indexName);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = body.theme;
  const filter: Record<string, any> = {};

  const topK = body.topK || 10;
  if (body.perk) {
    if (body.perk == "Free Food")
      filter["perks"] = { "$in": ["Free Food, Credit", "Free Food, Free Stuff, Credit"] };
    else if (body.perk == "Free Stuff")
      filter["perks"] = { "$in": ["Free Stuff, Credit", "Free Food, Free Stuff, Credit"] };
  }
  
  console.log(body);
  if (body.start_after)
    filter["start"] = { "$gte": body.start_after }
  if (body.end_before)
    filter["end"] = { "$lte": body.end_before }
  if (body.main_host)
    filter["main_host"] = { "$eq": body.main_host }
  if (body.category)
    filter["categories"] = { "$eq": body.category }
  console.log(body.time);
  if (body.time) {
    const [start, end] = convertToMinutes(body.time);
    filter["start_day_time"] = { "$gte": start }
    filter["end_day_time"] = { "$lte": end }
  }

  try {
    // Generate vector embedding using OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    console.log(filter);
    const vector = response.data[0].embedding;
    // Query Pinecone with the generated vector
    const searchResults = await index.query({
      vector,
      topK: topK,
      includeMetadata: true,
      filter: (Object.keys(filter).length > 0) ? filter : undefined
    });
    return NextResponse.json({ data: searchResults.matches.map((match) => match.metadata) });
  } catch (error) {
    console.error(error);

    // Return 500 if there's an error during the process
    return new Response(JSON.stringify({ error: `Internal server error: ${error}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
