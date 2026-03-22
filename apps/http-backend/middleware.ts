import type { Request, Response , NextFunction } from "express";
import Jwt, { type JwtPayload }  from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET!

export function authmiddleware(req:Request,res:Response,next:NextFunction){
    const header= req.headers["authorization"] || "";
    try{
        const response= Jwt.verify(header,JWT_SECRET) as JwtPayload;
        //@ts-ignore
        res.userId=response.id; 
        next();
    }catch(e){
        return res.json({
            message:"Authentication Failed"
        })
    }
} 