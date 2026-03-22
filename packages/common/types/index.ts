import z from "zod";

export const Signupschema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})

export const Signinschema=z.object({
    username:z.string().min(3).max(20),
    password:z.string()
})

export const CreateWorkflowSchema=z.object({
    nodes:z.array(z.object({
        nodeId:z.string(),
        data:z.object({
            kind:z.enum(["action" , "trigger"]),
            metadata:z.any()
        }),
        credentials:z.any(),
        id:z.string(),
        position:z.object({
            x:z.number(), 
            y:z.number()
        })
    })),
    edges:z.array(z.object({
        id:z.string(),
        source:z.string(),
        target:z.string()
    }))
})

export const UpdateWorkflowSchema=z.object({
    nodes:z.array(z.object({
        nodeId:z.string(),
        data:z.object({
            kind:z.enum(["action" , "trigger"]),
            metadata:z.any()
        }),
        credentials:z.any(),
        id:z.string(),
        position:z.object({
            x:z.number(),
            y:z.number()
        })
    })),
    edges:z.array(z.object({
        id:z.string(),
        source:z.string(),
        target:z.string(),
    }))
})