// Import des dépendances nécessaires
import {  isAdminRequest } from "./auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from '@/models/Admin'; // Import du modèle de données pour les administrateurs





export default async function handle(req, res)
{
    const {method} = req;
    await mongooseConnect();

    await isAdminRequest(req,res);

    if(method === 'GET') {
        try {
            const { email } = req.query;
    
            // Vérification si un email est spécifié dans la requête
            if (email) {
                const admin = await Admin.findOne({ email }); // Recherche de l'administrateur par email
                if (!admin) {
                    return res.status(404).json({ message: 'Administrateur non trouvé' });
                }
                return res.status(200).json(admin); // Renvoyer l'administrateur trouvé
            }
    
            // Si aucun email spécifié, récupérer tous les administrateurs
            const admins = await Admin.find(); // Récupération de tous les administrateurs depuis la base de données
            res.status(200).json(admins);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la récupération des administrateurs', error });
        }
    }
    

    if(method === 'POST')
    {
        try {
            const { email } = req.body;
            const admin = new Admin({ email }); // Création d'un nouvel objet Admin avec l'email reçu
            await admin.save(); // Sauvegarde du nouvel administrateur dans la base de données
            res.status(201).json({ message: 'Administrateur ajouté avec succès', admin });
          } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'administrateur', error });
          }
    }
    if (method === 'DELETE') {
        try {
          const email = req.query.email; // Obtenir l'email directement sans la déstructuration
          const deletedAdmin = await Admin.findOneAndDelete({ email }); // Recherche et suppression de l'administrateur par son email
          if (!deletedAdmin) {
            return res.status(404).json({ message: 'Administrateur non trouvé' });
          }
          res.status(200).json({ message: 'Administrateur supprimé avec succès', deletedAdmin });
        } catch (error) {
          res.status(500).json({ message: 'Erreur lors de la suppression de l\'administrateur', error });
        }
      }

}



