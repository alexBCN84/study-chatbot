import path from "path";
import { fileURLToPath } from "url";

import { loadDocuments as loadFiles } from "../../loaders/documentLoader.ts";
import { loadDocuments as loadURLs } from "../../loaders/webLoader.ts";
import { chunkDocuments } from "../../splitter.ts";
import { embedAndStore } from "../../embedder.ts";
import { createRetriever } from "../../retriever.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectAndUserConfig = {
    userID: "aginesmartin",
    projectID: "react-solid"
};

export default async function indexDocuments({files = [], urls = [] }: {files: string[], urls: string[]}) {
    const rawDocuments = [];

    if (files.length) {
        for (const file of files) {
            const docs = await loadFiles(path.join(__dirname, `./../../../data/${file.split("/").pop()}`));
            rawDocuments.push(...docs);
            // console.log("docs: ", JSON.stringify(docs, null, 4));
        }
    }
    
    if (urls.length) {
        for (const url of urls) {
            const docs = await loadURLs(url);
            rawDocuments.push(...docs);
            console.log("urls: ", JSON.stringify(docs, null, 4));
        }
    }

    // console.log(`Documents: ${JSON.stringify(rawDocuments, null, 4)}`);
    console.log(`Loaded ${rawDocuments.length} total raw documents`);
    
    // chunk documents
    const chunkedDocuments = await chunkDocuments(rawDocuments);
    console.log(chunkedDocuments)

    // embed documents and store in database
    await embedAndStore(chunkedDocuments, projectAndUserConfig); 

    return;
}