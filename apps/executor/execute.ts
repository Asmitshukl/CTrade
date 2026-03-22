import {NodesModel} from "db/client"
import { execute as executeLighter } from "./executors/lighter";

export type NodeDocument={
     id:string;
     type:string;
     credentials?:any;
     data?:{
        metadeta?:any;
        kind?:"action" | "trigger" | null |undefined;
     };
     nodeId: string;
}

type EdgeDocument={
    source:string;
    target:string;
}
export async function execute(nodes:NodeDocument[] ,edges:EdgeDocument[] ){
    const trigger =nodes.find(x => x.data?.kind === "trigger") 
    if(!trigger){
        return;
    }
    await executeRecursive(trigger?.id, nodes , edges);
}   

export async function executeRecursive(sourceId:string , nodes: NodeDocument[] ,edges:EdgeDocument[]){
    const nodesToExecute = edges.filter(({source,target})=> source === sourceId).map(({target})=>target)

    await Promise.all(nodesToExecute.map(async (nodeClientId) =>{
        const node = nodes.find(({id}) => id === nodeClientId);
        if(!node){
            return ;
        }
        switch (node.type){
            case "Lighter":
                await executeLighter(node.data?.metadeta.asset , node.data?.metadeta.quantity , node.data?.metadeta.type , node.credentials.api_key)
        }
    }))


    await  Promise.all(nodesToExecute.map(id => executeRecursive(id,nodes,edges))) ;
}