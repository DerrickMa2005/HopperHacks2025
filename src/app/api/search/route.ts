import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Initialize API clients once
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
const indexName = "events-index";
const index = pinecone.Index(indexName);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = `Search for events with theme: ${body.theme}, category: ${body.category}, perk: ${body.perk}`;
  try {
    // Generate vector embedding using OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const vector = response.data[0].embedding;
    // Query Pinecone with the generated vector
    const searchResults = await index.query({
      vector,
      topK: 10,
      includeMetadata: true,
    });
    return NextResponse.json({data: searchResults.matches.map((match) => match.metadata)});
  } catch (error) {
    console.error(error);

    // Return 500 if there's an error during the process
    return new Response(JSON.stringify({ error: `Internal server error: ${error}`}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
