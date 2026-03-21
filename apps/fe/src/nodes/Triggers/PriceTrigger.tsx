import { Handle, Position } from "@xyflow/react";
import type { PriceTriggerMetaData } from "common/types";



export function PriceTrigger({data,isConnectable}:{
    data:{
        metadata:PriceTriggerMetaData
    },
    isConnectable:boolean
}){
    return <div className="p-4 border">
        {data.metadata.asset}
        {data.metadata.price}
          <Handle type="source" position={Position.Right}></Handle>
    </div>
}