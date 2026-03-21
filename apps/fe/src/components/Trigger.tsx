import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TriggerSheet } from './TriggerSheet';
import { ActionSheet } from './ActionSheet';
import { Hyperliquid } from '@/nodes/Actions/HyperLiquid';
import { Backpack } from '@/nodes/Actions/Backpack';
import type { PriceTriggerMetaData, TimerNodeMetaData, TradingMetadata } from 'common/types';
import { PriceTrigger } from '@/nodes/Triggers/PriceTrigger';
import { Timer } from '@/nodes/Triggers/Timer';
import { Lighter } from '@/nodes/Actions/Lighter';

export type NodeKind= "price-trigger" | "timer" | "hyperLiquid" | "backpack" | "lighter";
export type NodeMetaData=TradingMetadata | TimerNodeMetaData | PriceTriggerMetaData;

const nodetypes={
    "price-trigger":PriceTrigger,
    "timer":Timer,
    "lighter":Lighter,
    "hyperliquid":Hyperliquid,
    "backpack":Backpack
}

interface NodeType{
    type : NodeKind,
    data :{
        kind : "action" | "trigger",
        metadata:NodeMetaData
    }
    id: string, 
    position: { x: number, y: number }
}

interface Edge{
    id: string, source: string, target: string 
} 

export default function Trigger() {

  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);



  const [selectedActions ,setSelectedAction]=useState<{
    position:{x:number,y:number},
    startingNodeId:string,
  } | null>(null)
 
  const onNodesChange = useCallback(
    (changes:any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes:any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params:any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const POSTION_OFFSET=50;
  const onConnectEnd= useCallback(
    (params,connectionInfo)=>{
        if(!connectionInfo.isValid){
            setSelectedAction({
              startingNodeId:connectionInfo.fromNode.id,
              position:{
                x:connectionInfo.from.x +POSTION_OFFSET,
                y:connectionInfo.from.y + POSTION_OFFSET
              }
            })
        }
    },[]
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
    {!nodes.length && <TriggerSheet  onselect={(type,metadata)=>
        {setNodes([...nodes,{
            id: Math.random().toString(),
            type,
            data:{
                kind:"trigger",
                metadata
            },
            position:{x:0,y:0}
        }])
    } }/> }
    {selectedActions && <ActionSheet onselect={(type,metadata)=>
        {
          const nodeid=Math.random().toString()
          setNodes([...nodes,{
            id: nodeid ,
            type,
            data:{
                kind:"action",
                metadata
            },
            position:selectedActions.position
        }]);
        setEdges([...edges,{
          id:`${selectedActions.startingNodeId}-${nodeid}`,
          source :selectedActions.startingNodeId,
          target: nodeid
        }])
        setSelectedAction(null)
    } }/>}
      <ReactFlow
        nodeTypes={nodetypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
      />
    </div>
  );
}