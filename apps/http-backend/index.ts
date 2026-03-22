import  express  from "express";
import { ExecutionModel, NodesModel, UserModel, Workflowmodel } from "db/client";
import mongoose from "mongoose";
import {CreateWorkflowSchema, Signinschema, Signupschema, UpdateWorkflowSchema} from "common/types"
import  Jwt  from "jsonwebtoken";
import { authmiddleware } from "./middleware";
mongoose.connect(process.env.DATABASE_URL!);

const app=express();
app.use(express.json());

const JWT_SECRET  =process.env.JWT_SECRET!;

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

app.post("/workflow",authmiddleware,async(req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const {success,data}=CreateWorkflowSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Incorrect Inputs"
        })
        return
    }try{
        const workflow=await Workflowmodel.create({
            userId,
            nodes:data.nodes,
            edges:data.edges
        })
        res.json({
            id:workflow._id
        })
    }catch(e){
        return res.json({
            message:"Failed to create Workflow"
        })
    }   
})

app.put("/workflow/:workflowId",authmiddleware,async(req,res)=>{
    const {success, data}=UpdateWorkflowSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message:"Incorrect Inputs"
        })
        return
    }
    try{
        const workflow=await Workflowmodel.findByIdAndUpdate(req.params.workflowId,data,{new:true});
        if(!workflow){
            res.status(404).json({
                message:"Workflow not found"
            })
            return
        }
        res.json({
            id:workflow._id
        })
    }catch(e){
        return res.status(411).json({
            message:"Failed to update Workflow"
        })
    }
})

app.get("/workflow/:workflowId",authmiddleware,async(req,res)=>{
    const workflow=await Workflowmodel.findById(req.params.workflowId);
    //@ts-ignore
    if(!workflow || workflow.userId.toString() !== req.userId){
        return res.status(404).json({
            message:"Workflow not found"
        })
    }
    res.json(workflow)
})

app.get("/workflows",authmiddleware,async(req,res)=>{
    try{
        //@ts-ignore
        const workflows=await Workflowmodel.find({userId:req.userId});
        if(!workflows){
            return res.json({
                messaage:"No workflows found"
            })
        }
        res.json(workflows)
    }catch(e){
        console.log(e);
        return res.json({
            mesaage:"wtf"
        })
    }
})

app.get("/workflow/executions/:workflowId",authmiddleware,async(req,res)=>{
    const executions=await ExecutionModel.find({workflowId : req.params.workflowId});
    res.json(executions)
})

app.get("/nodes",async(req,res)=>{
    const nodes=await NodesModel.find();
    res.json(nodes);
})


app.listen(3000);