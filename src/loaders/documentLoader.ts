// create module to load documents
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export async function loadDocuments(filePath: string) {
    let loader;
    
    const extension = filePath.split(".").pop()?.toLowerCase();

    switch (extension) {
        case "txt":
            loader = new TextLoader(filePath);
            break;
        case "pdf":
            loader = new PDFLoader(filePath);
            break;
        case "docx":
            loader = new DocxLoader(filePath);
            break;
        case "doc": 
            loader = new DocxLoader(filePath, {type: "doc"});
            break;
        default: 
            throw new Error("Unsupported file format. Use TXT PDF or Word Documents,");
    }

    return await loader.load();
}

// Test de function
// (async () => {
//     const docs = await loadDocuments(path.join(__dirname, "../data/sampleDoc.docx"));
//     console.log("docs: ", JSON.stringify(docs, null, 4));
// })();