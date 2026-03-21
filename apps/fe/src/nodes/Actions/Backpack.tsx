import { Handle, Position } from "@xyflow/react"
import type { TradingMetadata } from "common/types"



export function Backpack({data}:{
    data:{
        metadata: TradingMetadata
    }
}){
    return <div className="p-4 border">
        Backpack Trade
        <div>{data.metadata.type}</div>
        <div>{data.metadata.quantity}</div>
        <div>{data.metadata.symbol}</div>
        <Handle type="source" position={Position.Right}></Handle>
        <Handle type="target" position={Position.Left}></Handle>
    </div>
}