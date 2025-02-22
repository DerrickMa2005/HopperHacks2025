import { NextRequest } from 'next/server';
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Initialize API clients once
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
const indexName = "events-index";
const index = pinecone.Index(indexName);

export async function GET(request: NextRequest) {
  const query = request?.nextUrl?.searchParams.get('text');

  // Check if query parameter exists
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing search query" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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

    return new Response(JSON.stringify(searchResults), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);

    // Return 500 if there's an error during the process
    return new Response(JSON.stringify({ error: `Internal server error: ${error}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
