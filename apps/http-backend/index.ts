import  express  from "express";
import { UserModel } from "db/client";
import mongoose from "mongoose";
import {Signinschema, Signupschema} from "common/types"
import  Jwt  from "jsonwebtoken";
mongoose.connect(process.env.DATABASE_URL!);

const app=express();
app.use(express.json());

const JWT_SECRET  =process.env.JWT_SECRET as string;

app.post("/signup",async(req,res)=>{
    const {success,data}=Signupschema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Incorrect Input"
        })
        return ;
    }
    try{
        const user=await UserModel.create({
            username:data.username,
            password:data.password
        })
        res.json({
            userid:user._id
        })
    }catch(e){
        console.log(e);
        return res.json({
            message:"errorOccured"
        })
    }
})

app.post("/signin",async(req,res)=>{
    const {success,data}=Signinschema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Incorrect Input"
        })
        return ;
    }
    try{
        const user=await UserModel.findOne({
            username:data.username,
            password:data.password
        })
        if(user){
            const token=Jwt.sign({
                id:user._id
            }, JWT_SECRET)
            
            res.json({
                id:user._id,
                token
            })
        }else{
            res.status(403).json({
                message:"Incorrect"
            })
        }
    }catch(e){
        console.log(e);
        return res.json({
            message:"errorOccured"
        })
    }
})

app.post("/workflow",(req,res)=>{
    
})

app.put("/workflow",(req,res)=>{

})

app.get("/workflow/:workflowId",(req,res)=>{

})

app.get("/workflow/executions/:workflowId",(req,res)=>{

})

app.get("/nodes",(req,res)=>{
    
})


app.listen(3000);