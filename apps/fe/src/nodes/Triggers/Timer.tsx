import { Handle, Position } from "@xyflow/react";
import type { TimerNodeMetaData } from "common/types";




export function Timer({data}:{
    data:{
        metadata:TimerNodeMetaData
    },
    isConnectable:boolean
}){
    return <div className="p-4 border">
        Every{data.metadata.time } seconds
          <Handle type="source" position={Position.Right}></Handle>
    </div>
}