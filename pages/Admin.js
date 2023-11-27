import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Fonction pour récupérer la liste des administrateurs
  const getAdmins = async () => {
    try {
      const res = await axios.get('/api/admins'); // Endpoint à créer pour récupérer les admins depuis la base de données
      setAdmins(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs :', error);
    }
  };

  // Fonction pour ajouter un nouvel administrateur
  const addAdmin = async () => {
    try {
      await axios.post('/api/admins', { email: newAdminEmail }); // Endpoint à créer pour ajouter un nouvel admin dans la base de données
      setNewAdminEmail(''); // Réinitialiser le champ d'entrée après l'ajout
      getAdmins(); // Rafraîchir la liste des admins après l'ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'administrateur :', error);
    }
  };

  // Fonction pour supprimer un administrateur
  const removeAdmin = async (adminEmail) => {
    try {
      await axios.delete(`/api/admins/${adminEmail}`); // Endpoint à créer pour supprimer un admin de la base de données
      getAdmins(); // Rafraîchir la liste des admins après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'administrateur :', error);
    }
  };

  useEffect(() => {
    getAdmins(); // Charger la liste des admins lors du chargement initial de la page
  }, []);

  return (
    <Layout>
      <div>
        <h1>Gestion des administrateurs</h1>
        <div>
          <h2>Liste des administrateurs :</h2>
          <ul>
            {admins.map((admin) => (
              <li key={admin.email}>
                {admin.email}
                <button onClick={() => removeAdmin(admin.email)}>Supprimer</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Ajouter un nouvel administrateur :</h2>
          <input
            type="email"
            placeholder="Adresse email de l'administrateur"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
          />
          <button onClick={addAdmin}>Ajouter</button>
        </div>
      </div>
    </Layout>
  );
}
