const express=require("express");
const router=express.Router();

router.get("/docs",async(req,res)=>{
    res.json({message:"docs route is also working"});

});


module.exports=router;