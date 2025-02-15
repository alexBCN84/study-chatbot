import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { fileURLToPath } from "url";
import fs from "fs";
import chalk from "chalk";
import path from "path";

import fileSelector from "../utils/fileSelector.ts";
import indexDocuments from "../rag/indexing/index-documents.ts";
import generateQuery from "../rag/query/query-process.ts";

// import { chatWithBot } from "./chatHandler.ts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FOLDER = path.join(__dirname, "../../data");

// Recreate the readline interface every time we return to the menu
const userInterface = readline.createInterface({
    input,
    output,
    terminal: false,
}); 

function createProject() {
    console.log("create project");
}

function openProject() {
    console.log("open project");
}

function deleteProject() {
    console.log("delete project");
}

// Main function to start the CLI
export async function startCLI() {
    console.log("\n📚 Welcome to Study Chatbot CLI!");
    console.log("=====================================");
    
    while (true) {
        console.log("\nWhat would you like to do?");
        console.log("1️⃣  Create a new project");
        console.log("2️⃣  Open an existing project");
        console.log("3️⃣  Delete a project");
        console.log("4️⃣  Exit");

        const userInput = await userInterface.question("Enter your choice (1-4): ");

        if (userInput === "4") {
            console.log("👋 Goodbye!");
            userInterface.close();
            process.exit(0);
        }

        switch (userInput) {
            case "1":
                await createProject();
                break;
            case "2":
                await openProject();
                break;
            case "3":
                await deleteProject();
                break;
            default:
                console.log("❌ Invalid choice. Please enter a number between 1 and 4.");
        }
    }
}

async function selectFile(files: string[]) {
    try {
        console.log("🟢 Opening file selector...");

        const filePath = await fileSelector();

        console.log(`file path: ${filePath}`)

        if (!filePath) {
            console.log("❌ No file selected.");
            return;
        }

        console.log(`✅ Selected file: ${filePath}`);
        const fileName = path.basename(filePath);
        const destination = path.join(DATA_FOLDER, fileName);

        fs.copyFileSync(filePath, destination);
        files.push(destination.trim());
        console.log(`✅ File added: ${fileName}`);
        console.log("🟢 File selection complete. Returning to menu...");

    } catch (error) {
        console.error("❌ Error selecting file:", error);
        console.log("🔄 Returning to main menu...");
    }
}

export async function setupKnowledgeBase() {
    console.log("\n📚 Welcome to Study Chatbot! 🚀");
    console.log("This tool will help you study by processing documents and web content.");
    console.log("You can upload multiple files or share URLs to build your knowledge base.\n");

    let files: string[] = [];
    let urls: string[] = [];

    while (true) {
        console.log("\nOptions:");
        console.log("1️⃣  Add a file (PDF, DOC, DOCX)");
        console.log("2️⃣  Add a website URL");
        console.log("3️⃣  Done! Start processing");
        console.log("4️⃣  Ask a question");
        console.log("5️⃣  Exit");

        // Ensure stdin remains readable
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.resume();
        }

        const choice = await userInterface.question("\nChoose an option (1-5): ");

        switch (choice.trim()) {
            case "1":
                console.log("\n📂 Select a file:");
                await selectFile(files);
                console.log(`Added 📄: \n${files.map((file, index) => chalk.italic.greenBright(`${index + 1}. ${file}`)).join("\n")}`);
                break;  

            case "2":
                const url = await userInterface.question("Enter website URL: ");
                urls.push(url.trim());
                console.log(`✅ Added URL: ${url}`);
                console.log(`Added 🌐: \n${urls.map((file, index) => chalk.italic.blueBright(`${index + 1}. ${file}`)).join("\n")}`);
                break;

            case "3":
                console.log("\n📥 Files to process:", files.length ? files : "No files added.");
                console.log("🌐 URLs to process:", urls.length ? urls : "No URLs added.");
                console.log("\n🔄 Starting processing...\n");

                await indexDocuments({ files, urls });
                break;
                // userInterface.close();  // Close before processing
                // return; 

            case "4":
                generateQuery("What are SOLID principles?");
                userInterface.close();  // Close before processing
                return; 

            case "5":
                console.log("\n👋 Exiting Study Chatbot. See you soon!");
                userInterface.close();
                process.exit(0); 

            default:
                console.log("❌ Invalid option. Please enter a number between 1 and 4.");
        }
    }
}


// export async function startChat() {
//     while (true) {
//         const userInput = await userIntrerface.question("Human: ");

//         // this breaks the while loop
//         if (userInput.toLowerCase() === "exit") {
//             console.log("Goodbye! 👋");
//             userIntrerface.close();
//             process.exit(0);
//         }

//         // const AIresponse = await chatWithBot(userInput);
//         // console.log(`AI response: ${JSON.stringify(AIresponse)}`);
//     }
// }