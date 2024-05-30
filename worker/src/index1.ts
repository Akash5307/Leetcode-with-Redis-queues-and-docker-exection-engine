import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
    console.log(submission);
    const { userId,problemId, code, language } = JSON.parse(submission);
    // console.log(`UserId :${userId}`);
    // console.log(`Processing submission for problemId :${problemId}`);
    // console.log(`Code :${code}`);
    // console.log(`Language :${language}`);


    //toDo
    //add processing logic here
    //Todo
    //run the user code here - docker exec

    //processing delay
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
    console.log(`Finished processing submission for userId :${userId}`);
};
async function startWorker() {
    try {
        await client.connect();
        console.log("Client connected to Redis");

        while (true) {
            try {
                //blocking rpop
                const poppedValue = await client.brPop("submissions", 0);
                //@ts-ignore
                await processSubmission(poppedValue.element);

            }
            catch (e) {
                console.log("Error processing submission :", e);
                //toDo
                //logic to put the submission back into the queue
                console.log("Re-queued the failed submission");
            }
        }

    } catch (e) {
        console.log("Failed to connect to Redis", e);
    }
}
startWorker(); 