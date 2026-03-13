const express=require("express");
const router=express.Router();
const protect=require("../middleware/auth")
const {validateQuery}=require("../utils/validator");
const {generateEmbeddings}=require("../utils/embedder");
const {searchChunks}=require("../utils/vectorDB")
const {askLLm, askLLM}=require("../utils/llm")


router.post("/",protect,async(req,res)=>{
    try{
        const {question}=req.body;
        const userId=req.user._id.toString()

        //validate question
        const cleanQuestion=validateQuery(question);

        //Embedding  the question
        const questionVector=await generateEmbeddings(cleanQuestion);
        
        //search for relavant chunks top 5,filtered by uder id
        const relevantChunks=await searchChunks(questionVector,userId);
    
        if(relevantChunks.length===0){
            return res.json({
                answer:"No relevant information found in your documents. Please upload document first",
                source:[]
            })
        }

        //get answer from LLM

        const answer=await askLLM(cleanQuestion,relevantChunks);//sends question + relevant(top 5 chunks)
        
        res.json({
            answer:answer,
            sources:relevantChunks.map(chunk=>({
                filename:chunk.source,
                score:chunk.score
            }))//display "Answer from HR_Policy.pdf"
        })
    }catch(err){
        res.status(500).json({error:err.message})
    }
});

module.exports=router;