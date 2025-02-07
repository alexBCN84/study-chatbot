import dotenv from "dotenv";
import { Document } from "@langchain/core/documents";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import cliProgress from "cli-progress";


dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX;

if (!PINECONE_API_KEY || !PINECONE_INDEX) {
    throw new Error("Missing Pinecone API Key or Index. Check your .env file.");
}

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(PINECONE_INDEX);

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export async function embedAndStore(chunkedDocuments: Document<Record<string, any>>[]) {

    // create a new instance from embedding LLM 
    const embeddingsLLM = new OpenAIEmbeddings({model: "text-embedding-3-small"})

    console.log("Starting vectorization");
    progressBar.start(chunkedDocuments.length, 0);

    // starting vectorisation in batches of 100 chunks
    for (let i = 0; i < chunkedDocuments.length; i+= 100) {
        const batch = chunkedDocuments.slice(i, i + 100);

        try {
            // vectorise and store in pinecone index
            await PineconeStore.fromDocuments(batch, embeddingsLLM, { pineconeIndex });
            progressBar.increment(batch.length);
        } catch (error) {
            console.error("Error processing batch: ", error);
        }
    }
    
    progressBar.stop();
    console.log("All chunked documents vectorized and stored in Pinecone");
}