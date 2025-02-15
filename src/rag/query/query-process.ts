import { createRetriever } from "../../retriever.ts";

const projectAndUserConfig = {
    userID: "aginesmartin",
    projectID: "react-solid"
};

export default async function queryprocess(question: string) {
    // retrieve documents to get context
    const retriever = await createRetriever(projectAndUserConfig);
    const context = await retriever.invoke(question);
    console.log("Resultados obtenidos: ", context); 
}