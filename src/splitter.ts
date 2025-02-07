import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";

// function will take the raw documents and will return the split documents
export async function chunkDocuments(docs: Document[]): Promise<Document[]> {

    console.log("Splitting documents...");

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
        chunkSize: 500,
        chunkOverlap: 100,
    });

    // split the documents
    const documentChunks = await splitter.splitDocuments(docs);

    console.log(`splitted ${docs.length} documents into ${documentChunks.length} chunks`);

    // return the split documents
    return documentChunks;
}