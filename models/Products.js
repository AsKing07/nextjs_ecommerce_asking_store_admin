import mongoose, {model, Schema, models} from "mongoose";
import { type } from "os";

const ProductSchema = new Schema({
    title: {type:String, required:true},
    description: String,
    price: {type: Number, required: true},
    images: [{type:String}],
    category: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: {type:Object},
})

export const Product =models.Product || model('Product', ProductSchema);