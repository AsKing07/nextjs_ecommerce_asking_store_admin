// Exemple de modèle Admin (dans votre fichier /models/Admin.js)
import mongoose,{model, models, Schema} from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
},{timestamps: true});

export const Admin = models.Admin || model('Admin', adminSchema);
