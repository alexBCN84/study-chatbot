import dotenv from "dotenv";
import { Document } from "@langchain/core/documents";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import cliProgress from "cli-progress";


dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX;
const EMBEDDING_LLM_MODEL = process.env.EMBEDDING_LLM_MODEL;

if (!PINECONE_API_KEY) {
    throw new Error("Missing Pinecone API. Check your .env file.");
}

if (!PINECONE_INDEX) {
    throw new Error("Missing Pinecone key Index. Check your. env file. ");
}

if (!EMBEDDING_LLM_MODEL) {
    throw new Error("Missing Embedding LLM model. Check your. env file. ");
}

const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(PINECONE_INDEX);

const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

type EmbedOptions = {
    userID: string
    projectID: string
}

export async function embedAndStore(
    chunkedDocuments: Document<Record<string, any>>[], { 
        userID,
        projectID
    }: EmbedOptions
) {
    // Create dynamic namespace
    const namespace = `user:${userID}_project:${projectID}`;

    // create a new instance from embedding LLM 
    const embeddingsLLM = new OpenAIEmbeddings({model: EMBEDDING_LLM_MODEL})

    console.log(`Starting vectorization for namespace: ${namespace}`);
    progressBar.start(chunkedDocuments.length, 0);

    // starting vectorisation in batches of 100 chunks
    for (let i = 0; i < chunkedDocuments.length; i+= 100) {
        const batch = chunkedDocuments.slice(i, i + 100);

        try {
            // vectorise and store in pinecone index
            await PineconeStore.fromDocuments(batch, embeddingsLLM, { 
                pineconeIndex,
                namespace 
            });

            progressBar.increment(batch.length);
        } catch (error) {
            console.error("Error processing batch: ", error);
        }
    }
    
    progressBar.stop();
    console.log(`All chunked documents vectorized and stored in Pinecone (namespace: ${namespace}).`);
}