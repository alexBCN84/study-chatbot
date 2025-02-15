import Enquirer from 'enquirer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const enquirer = new Enquirer();

export default async function fileSelector(): Promise<string> {
    let currentPath = os.homedir(); // Start from the user's home directory

    while (true) {
        let filesAndDirs = fs.readdirSync(currentPath).map(file => {
            const fullPath = path.join(currentPath, file);
            const isDirectory = fs.statSync(fullPath).isDirectory();
            return { name: file + (isDirectory ? '/' : ''), value: fullPath, isDirectory };
        });

        // Add navigation options
        if (currentPath !== os.homedir()) {
            filesAndDirs.unshift({ name: '.. (Go up)', value: path.dirname(currentPath), isDirectory: true });
        }

        const response: any = await enquirer.prompt({
            type: 'select',
            name: 'selectedPath',
            message: `📂 Select a file or navigate directories:`,
            choices: filesAndDirs.map(item => ({ name: item.name, value: item.value }))
        });

        const selected = filesAndDirs.find(item => item.name === response.selectedPath);

        if (!selected) {
            console.log("❌ Invalid selection. Try again.");
            continue;
        }

        if (selected.isDirectory) {
            currentPath = selected.value; // Navigate into the directory
        } else {
            return selected.value; // Return the selected file path
        }
    }
}
