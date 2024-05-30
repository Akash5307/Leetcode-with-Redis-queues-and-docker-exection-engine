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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function processSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(submission);
        const { userId, problemId, code, language } = JSON.parse(submission);
        // console.log(`UserId :${userId}`);
        // console.log(`Processing submission for problemId :${problemId}`);
        // console.log(`Code :${code}`);
        // console.log(`Language :${language}`);
        //toDo
        //add processing logic here
        //Todo
        //run the user code here - docker exec
        //processing delay
        yield new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        console.log(`Finished processing submission for userId :${userId}`);
    });
}
;
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("Client connected to Redis");
            while (true) {
                try {
                    //blocking rpop
                    const poppedValue = yield client.brPop("submissions", 0);
                    //@ts-ignore
                    yield processSubmission(poppedValue.element);
                }
                catch (e) {
                    console.log("Error processing submission :", e);
                    //toDo
                    //logic to put the submission back into the queue
                    console.log("Re-queued the failed submission");
                }
            }
        }
        catch (e) {
            console.log("Failed to connect to Redis", e);
        }
    });
}
startWorker();