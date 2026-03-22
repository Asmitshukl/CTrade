import { ExecutionModel, Workflowmodel } from "db/client"
import { execute } from "./execute";
import mongoose from "mongoose";



async function main() {

    mongoose.connect(process.env.DATABASE_URL!);

    while(true){
        const workflows=await Workflowmodel.find({});
        workflows.map(async workflow=>{
            const trigger = workflow.nodes.find(x=> x.data?.kind === "trigger");
            if(!trigger){
                return;
            }

            switch (trigger?.type){
                case "timer" :
                    const timeInS = trigger?.data?.metadata.time;
                    const execution = await ExecutionModel.findOne({
                        workflowId : workflow.id,
                    }).sort({
                        startTime : "desc"
                    })

                    if(!execution || new Date(execution.startTime).getTime() < Date.now() - (timeInS * 1000)){
                        const execution=await ExecutionModel.create({
                            workflowId:workflow.id,
                            status:"PENDING",
                            startTime:new Date()
                        })
                        await execute(workflow.nodes ,workflow.edges);

                        execution.endTime = new Date();
                        execution.status = "SUCCESS";
                        await execution.save();
                    }
            } 
        })
        await new Promise(x => setTimeout(x,2000));
    }
}

main()