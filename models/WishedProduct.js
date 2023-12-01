import {model, models, Schema} from "mongoose";
import {Product} from "@/models/Products";

const WishedProductSchema = new Schema({
  userEmail: {type: String, required: true},
  product: {type: Schema.Types.ObjectId, ref: Product},
});

export const WishedProduct = models?.WishedProduct || model('WishedProduct', WishedProductSchema);