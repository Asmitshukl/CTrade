import type { NodeKind, NodeMetaData } from "./Trigger";
  
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Input } from "./ui/input";
import { Supported_Assets, type TradingMetadata } from "common/types";

const Supported_Actions=[{
            id:"hyperliquid",
            title:"Hyperliquid",
            description:"Place a trade on hyperliquid"
        },{
            id:"lighter",
            title:"Lighter",
            description:"Place a trade on lighter"
        },{
            id:"backpack",
            title:"Backpack",
            description:"Place a trade on Backpack"
        }];


export const ActionSheet=({
    onselect }:{onselect:(kind : NodeKind ,metadata :NodeMetaData )=>void })=>{

        const [metadata,setMetadata]=useState<TradingMetadata | {}>({});

        const [selectedActions,setSelectedAction]=useState(Supported_Actions[0].id);

    return (         
    <Sheet open={true}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-amber-900">Actions</SheetTitle>
          <SheetDescription>
            Select the type of Action that you need. 
            <Select value= {selectedActions} onValueChange={(value)=> setSelectedAction(value)}>
            <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select a Trigger" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Actions</SelectLabel>
                {Supported_Actions.map(({id,title})=><SelectItem 
                key={id}
                value={id} >{title} </SelectItem>)}
                </SelectGroup>
            </SelectContent>
            </Select>
            {(selectedActions === "hyperliquid" || selectedActions === "backpack"  || selectedActions === "lighter" ) && <div>
                <div className="pt-4">
                    Select the Type
                </div>
                <Select value= {metadata?.type} onValueChange={(value)=> setMetadata(metadata=>({
                    ...metadata,
                    type:value
                }))}>
                <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select an Asset" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectItem  value={"long"} >LONG</SelectItem>
                    <SelectItem  value={"short"} >SHORT</SelectItem>
                    </SelectGroup>
                </SelectContent>
                </Select>

                <div className="pt-4">
                    Select the Symbol
                </div>
                <Select value= {metadata?.symbol} onValueChange={(value)=> setMetadata(metadata=>({
                    ...metadata,
                    symbol:value
                }))}>
                <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select a symbol" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {Supported_Assets.map(asset => <SelectItem key={asset} value={asset}>
                            {asset}
                        </SelectItem>)}
                    </SelectGroup>
                </SelectContent>
                </Select>

                <div className="pt-4">
                    Select the Quantity
                </div>
                <Input value= {metadata.time} onChange={(e)=> setMetadata(metadata=>({
                    ...metadata,
                    quantity:Number(e.target.value)
                }))}></Input>
            </div>}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button 
          onClick={()=>{
            onselect(
                selectedActions,
                metadata
            )
          }}
          type="submit">Create Actions</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}