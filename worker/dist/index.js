"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const client = (0, redis_1.createClient)();
const execPromise = util_1.default.promisify(child_process_1.exec);
const runUserCodeInDocker = (code, language) => __awaiter(void 0, void 0, void 0, function* () {
    const command = `docker run --rm code-execution-container ${language} -c "${code}"`;
    try {
        const { stdout, stderr } = yield execPromise(command);
        if (stderr) {
            console.error(`Execution error: ${stderr}`);
            throw new Error(`Execution failed: ${stderr}`);
        }
        return stdout;
    }
    catch (error) {
        console.error(`Error running Docker command: ${error}`);
        throw error;
    }
});
const processSubmission = (submission) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Received submission: ${submission}`);
    const { userId, problemId, code, language } = JSON.parse(submission);
    console.log(`Processing submission for userId: ${userId}, problemId: ${problemId}, language: ${language}`);
    try {
        const result = yield runUserCodeInDocker(code, language);
        console.log(`Execution result for userId: ${userId}, problemId: ${problemId}: ${result}`);
        yield new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Finished processing submission for userId: ${userId}`);
    }
    catch (error) {
        console.error(`Error processing submission for userId: ${userId}, problemId: ${problemId}: ${error}`);
        throw error;
    }
});
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Client connected to Redis");
            while (true) {
                try {
                    //@ts-ignore
                    const { element: submission } = yield client.brPop("submissions", 0);
                    console.log(submission);
                    try {
                        //blocking rpop
                        //@ts-ignore
                        yield processSubmission(submission);
                    }
                    catch (e) {
                        console.log("Error processing submission :", e);
                        //logic to put the submission back into the queue
                        try {
                            yield client.lPush("submissions", submission);
                            console.log("Re-queued the failed submission");
                        }
                        catch (error) {
                            console.error("Error re-queuing the failed submission:", error);
                        }
                    }
                }
                catch (e) {
                    console.log("Error in brPop ", e);
                }
            }
        }
        catch (e) {
            console.log("Failed to connect to Redis", e);
        }
    });
}
startWorker();
