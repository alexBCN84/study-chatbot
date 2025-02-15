import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import dotenv from "dotenv";

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

type RetrieverConfigOptions = {
    userID: string 
    projectID: string
}

export async function createRetriever({
    userID,
    projectID
}: RetrieverConfigOptions) {
    const namespace = `user:${userID}_project:${projectID}`;
    const embeddingLLM = new OpenAIEmbeddings({model: EMBEDDING_LLM_MODEL});
    
    const vectorStore = await PineconeStore.fromExistingIndex(embeddingLLM, {
        pineconeIndex,
        namespace
    });

    return vectorStore.asRetriever();
}