import type { NodeKind, NodeMetaData } from "./Trigger";
  
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Supported_Assets, type PriceTriggerMetaData, type TimerNodeMetaData } from "common/types";

const Supported_Triggers=[{
            id:"timer",
            title:"Timer",
            description:"Run this trigger every x seconds/minutes"
        },{
            id:"price-trigger",
            title:"Price Trigger",
            description:"Runs whenever the price goes below or above x for an asset."
        }];



export const TriggerSheet=({
    onselect }:{onselect:(kind : NodeKind ,metadata :NodeMetaData )=>void })=>{

        

        const [metadata,setMetadata]=useState<PriceTriggerMetaData | TimerNodeMetaData>({
            time:3600
        });
        const [selectedTrigger,setSelectedTrigger]=useState(Supported_Triggers[0].id);

    return (         
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-amber-900">Triggers</SheetTitle>
          <SheetDescription>
            Select the type of trigger that you need. 
            <Select value= {selectedTrigger} onValueChange={(value)=> setSelectedTrigger(value)}>
            <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select a Trigger" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Trigger</SelectLabel>
                {Supported_Triggers.map(({id,title})=><SelectItem 
                key={id}
                value={id} >{title} </SelectItem>)}
                </SelectGroup>
            </SelectContent>
            </Select>
            {selectedTrigger === "timer" && <div>
                <div className="pt-4">
                    Number of seconds after which to run the timer
                </div>
                <Input value= {metadata.time} onChange={(e)=> setMetadata(metadata=>({
                    ...metadata,
                    time:Number(e.target.value)
                }))}></Input>
            </div>}
            {selectedTrigger === "price-trigger" && <div>
                Price:
                <Input type ="text"
                 onChange={(e)=> setMetadata(m => ({
                    ...m,
                    price:Number(e.target.value)
                 }))}
                ></Input>
                Asset
                <Select value= {metadata.asset} onValueChange={(value)=> setMetadata(metadata=>({
                    ...metadata,
                    asset:value
                }))}>
                <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select an Asset" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Trigger</SelectLabel>
                    {Supported_Assets.map((id)=><SelectItem 
                    key={id}
                    value={id} >{id}</SelectItem>)}
                    </SelectGroup>
                </SelectContent>
                </Select>
            </div>}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button 
          onClick={()=>{
            onselect(
                selectedTrigger,
                metadata
            )
          }}
          type="submit">Create Trigger</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}