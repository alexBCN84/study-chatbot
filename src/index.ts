// Punto de entrada del proyecto.
import { setupKnowledgeBase } from "./chatbot/chat.ts";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// import { loadDocuments as loadFileDocuments } from "./loaders/documentLoader.ts";
// import { loadDocuments as loadWebDocuments } from "./loaders/webLoader.ts";
// import { chunkDocuments } from "./splitter.ts";
// import { embedAndStore } from "./embedder.ts";
// import { createRetriever } from "./retriever.ts";
// import { startChat } from "./chatbot/chat.ts";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


dotenv.config();

// load file documents
// const docs = await loadDocuments(path.join(__dirname, "../data/sampleDoc.docx"));
// console.log("docs: ", JSON.stringify(docs, null, 4));

// load content from websites
// const documents = await loadWebDocuments("https://refine.dev/blog/react-design-patterns/");

// chunk documents
// const documentsChunks = await chunkDocuments(documents);

// embed documents and store in database
// embedAndStore(documentsChunks); 

// retrieve documents
// const retriever = await createRetriever();
// const context = await retriever.invoke("What are the main React Design Patterns");

// console.log({context});

// startChat();

setupKnowledgeBase();


// TODO


// 1. create CLI for managing app create open and delete project
// 2. implement query process logic
// 4. implement chat logic
// 3. connect to chatbot to index.ts
// run & test

// DONE
// we need to create a CLI where user is prompted to either upload files or share web urls that will be used as documents and will be processed. 
// User to be given the chance to upload or share more than once.
// Remove the data folder and add logs in CLI so user can see the files and URLs that are being uploaded.
// connect the newly created CLI with the subsequent steps of indexing process > loading / chunking / vectorization

