import { createClient } from "redis";
import { exec } from "child_process";
import util from "util";

const client = createClient();
const execPromise = util.promisify(exec);


const runUserCodeInDocker = async (code: string, language: string): Promise<string> => {
    const command = `docker run --rm code-execution-container ${language} -c "${code}"`;
    try {
        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            console.error(`Execution error: ${stderr}`);
            throw new Error(`Execution failed: ${stderr}`);
        }
        return stdout;
    } catch (error) {
        console.error(`Error running Docker command: ${error}`);
        throw error;
    }
};

const processSubmission = async (submission: string) => {
    console.log(`Received submission: ${submission}`);
    const { userId, problemId, code, language } = JSON.parse(submission);
    console.log(`Processing submission for userId: ${userId}, problemId: ${problemId}, language: ${language}`);

    try {
        const result = await runUserCodeInDocker(code, language);
        console.log(`Execution result for userId: ${userId}, problemId: ${problemId}: ${result}`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`Finished processing submission for userId: ${userId}`);
    } catch (error) {
        console.error(`Error processing submission for userId: ${userId}, problemId: ${problemId}: ${error}`);
        throw error;
    }
};
async function startWorker() {
    try {
        await client.connect();
        console.log("Client connected to Redis");

        while (true) {
            try {
                //@ts-ignore
                const { element: submission } = await client.brPop("submissions", 0);
                console.log(submission);
                try {
                    //blocking rpop
                    //@ts-ignore
                    await processSubmission(submission);
                }
                catch (e) {
                    console.log("Error processing submission :", e);
                    //logic to put the submission back into the queue
                    try {
                        await client.lPush("submissions", submission);
                        console.log("Re-queued the failed submission");
                    } catch (error) {
                        console.error("Error re-queuing the failed submission:", error);
                    }
                }
            } catch (e) {
                console.log("Error in brPop ", e);
            }

        }
    } catch (e) {
        console.log("Failed to connect to Redis", e);
    }
}
startWorker(); 