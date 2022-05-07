import {Request, Response} from "express"

export default async function getService(req: Request, res: Response) {
   // return an object with the status and headers
    return res.status(200).send({
        time: Date.now(),
        version: "1.0.0",
        message: "Service is running"
    })
}