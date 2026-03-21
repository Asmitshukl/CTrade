import z from "zod";

export const Signupschema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})

export const Signinschema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})