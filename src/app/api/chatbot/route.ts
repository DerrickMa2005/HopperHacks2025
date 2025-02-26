import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

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
  
  if (body.start_after)
    filter["start"] = { "$gte": body.start_after }
  if (body.end_before)
    filter["end"] = { "$lte": body.end_before }
  if (body.main_host)
    filter["main_host"] = { "$eq": body.main_host }
  if (body.category)
    filter["categories"] = { "$eq": body.category }

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
      topK: topK,
      includeMetadata: true,
      filter: (Object.keys(filter).length > 0) ? filter : undefined
    });
    const completion = openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {"role": "developer", "content": "User will give you a question and a RAG system will give you relevant events to that question. Tell them what events are relevant, and let them know if nothing was found."},
          {"role": "user", "content": `context: ${JSON.stringify(searchResults)}\n\nNow, answer this question: ${query}`}
        ]
  })
    return NextResponse.json({ data: (await completion).choices[0].message.content });
  } catch (error) {
    console.error(error);

    // Return 500 if there's an error during the process
    return new Response(JSON.stringify({ error: `Internal server error: ${error}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
