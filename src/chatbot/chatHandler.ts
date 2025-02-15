import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { createRetriever } from "./../retriever.ts";
import { ReadableStream } from "node:stream/web";

dotenv.config();

const llm = new ChatOpenAI({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 500,
})

const projectAndUserConfig = {
    userID: "aginesmartin",
    projectID: "react-solid"
};

export async function chatWithBot(question: string) {
    const retriever = await createRetriever(projectAndUserConfig);
    const relevantDocs = await retriever.invoke(question);

    console.log("\n🔎 Retrieved Context:");
    console.log(relevantDocs);

    const context = relevantDocs.map( doc => doc.pageContent).join("\n");

    const prompt = `You are an AnpmI assistant helping a student study. Use the following context to answer the user's question.
    Context: ${context}
  
    Question: ${question}
    Answer:`;

    const response = await llm.invoke(prompt);
    return response;
}