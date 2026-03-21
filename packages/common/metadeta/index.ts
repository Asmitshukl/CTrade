export type TimerNodeMetaData={
    time:number;
}

export const Supported_Assets=["SOL","BTC","ETH"];

export type TradingMetadata={
    type:"LONG" | "SHORT",
    quantity:number,
    symbol: typeof Supported_Assets
}

export type PriceTriggerMetaData={
    asset:string,
    price:number,
}