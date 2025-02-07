// Punto de entrada del proyecto.

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { loadDocuments as loadFileDocuments } from "./loaders/documentLoader.ts";
import { loadDocuments as loadWebDocuments } from "./loaders/webLoader.ts";
import { chunkDocuments } from "./splitter.ts";
import { embedAndStore } from "./embedder.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

// load file documents
// const docs = await loadDocuments(path.join(__dirname, "../data/sampleDoc.docx"));
// console.log("docs: ", JSON.stringify(docs, null, 4));

// load content from websites
const documents = await loadWebDocuments("https://refine.dev/blog/react-design-patterns/");

// chunk documents
const documentsChunks = await chunkDocuments(documents);
embedAndStore(documentsChunks); 

// TODO
// indexing process is finished
// load project to github repository
// start query process by implementing retriever logic
