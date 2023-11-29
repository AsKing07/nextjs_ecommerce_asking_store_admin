import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handler(req,res)
{
    await mongooseConnect();
    isAdminRequest(req,res);
    res.json( await Order.find().sort({createdAt:-1}));

}