import express from "express";
import {createClient} from "redis";

const app=express();
app.use(express.json());

const client=createClient();

client.on('error',(e)=>console.log("Redis Client Error ",e));

app.post("/submit",async(req,res)=>{
    const problemId=req.body.problemId;
    const code=req.body.code;
    const language=req.body.language;
    const userId=req.body.userId;
    console.log(req.body);
    try{
        await client.lPush("submissions",JSON.stringify({userId,problemId,code,language}));
        res.status(200).json("Submission received and stored");

    }catch(e){
        console.log("Redis error :",e);
        res.status(500).send("Failed to store the submission");
    }
} )
  
async function startServer(){
    try{
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000,()=>{
            console.log("Server is running on port 3000");
        })
    }catch(e){
        console.log("Failed to connect to Redis ",e);
    }
}
startServer();