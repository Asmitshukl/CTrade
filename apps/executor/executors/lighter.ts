// import { SignerClient } from "./lighter-sdk-ts/signer";
// import { NonceManagerType } from "./lighter-sdk-ts/nonce_manager";
import { SignerClient } from "./lighter/lighter-sdk-ts/signer";
import { NonceManagerType } from "./lighter/lighter-sdk-ts/nonce_manager";

export const MARKETS = {
    "BTC": {
        "marketId": 1,
        "qtyDecimals": 100000,
    },
    "ETH": {
        "marketId": 0,
        "qtyDecimals": 10000,
    },
    "SOL": {
        "marketId": 2,
        "qtyDecimals": 1000,
    }
}

const BASE_URL = process.env.LIGHTER_BASE_URL || "https://mainnet.zklighter.elliot.ai";

export async function execute(asset: "SOL" | "BTC" | "ETH", qty: number, type: "LONG" | "SHORT", API_KEY: string, ACCOUNT_INDEX: number,API_KEY_INDEX:number) {
    const marketIndex = MARKETS[asset].marketId;
    const client = await SignerClient.create({
        url: BASE_URL,
        privateKey: API_KEY,
        apiKeyIndex: API_KEY_INDEX,
        accountIndex: ACCOUNT_INDEX,
        nonceManagementType: NonceManagerType.OPTIMISTIC
    });

    const isAsk = type === "SHORT";
    const baseAmount = Math.round(qty * MARKETS[asset].qtyDecimals);

    await client.createOrder({
        marketIndex,
        clientOrderIndex: Math.floor(Math.random() *100000),
        baseAmount,
        price: SignerClient.NIL_TRIGGER_PRICE,
        isAsk,
        orderType: SignerClient.ORDER_TYPE_MARKET,
        timeInForce: SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduceOnly: 0,
        triggerPrice: SignerClient.NIL_TRIGGER_PRICE,
        orderExpiry: SignerClient.DEFAULT_28_DAY_ORDER_EXPIRY,
    });
}