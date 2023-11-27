import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { withSwal } from "react-sweetalert2";
import NextAuth from 'next-auth'
import { useSession } from 'next-auth/react';
import Spinner from "@/components/Spinner";




function AdminManagement({ swal }) {
    const { data: session } = useSession();

    useEffect(() => {
        if (session && session.user.email === "charbelsnn@gmail.com") {
          setIsSuperAdmin(true);
        }
    
        getAdmins();
      }, [session]); // Assurez-vous d'inclure la session dans le tableau de dépendances useEffect si vous l'utilisez à l'intérieur
    



  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAdmins = async () => {
    try {
        setIsLoading(true);
      const res = await axios.get('/api/admin');
      setAdmins(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs :', error);
    }
  };

  const addAdmin = async () => {
    try {
      await axios.post('/api/admin', { email: newAdminEmail });
      setNewAdminEmail('');
      getAdmins();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'administrateur :', error);
    }
  };

  const removeAdmin = async (adminEmail) => {
    swal
      .fire({
        title: "Êtes-vous sûr?",
        text: `Voulez-vous supprimer l'administrateur ${adminEmail}?`,
        showCancelButton: true,
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui, Supprimer!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`/api/admin?email=${adminEmail}`); // Utilisation de l'email directement dans la requête DELETE
            getAdmins();
          } catch (error) {
            console.error('Erreur lors de la suppression de l\'administrateur :', error);
          }
        }
      });
  };


  
  

  return (
    <Layout>
      <div>
        <h1>Gestion des administrateurs</h1>
        {isSuperAdmin && (
   <div>
   <h2>Ajouter un nouvel administrateur :</h2>
   <input
     type="email"
     placeholder="Adresse email de l'administrateur"
     value={newAdminEmail}
     onChange={(e) => setNewAdminEmail(e.target.value)}
   />
   <button className='btn-primary' onClick={addAdmin}>Ajouter</button>
 </div>
        )}

      {isLoading? <div className="flex justify-center">
                <Spinner />
                </div> :
        <div class="table-container">    
          <table className="basic mt-2">
          <caption><h2>Liste des administrateurs </h2></caption>
          <caption>    <p>Pour supprimer ou ajouter des utilisateurs, veuillez contacter le SuperAdmin charbelsnn@gmail.com</p>
</caption>
            <thead>
              <tr>
                <th>Email</th>
                {isSuperAdmin &&(
                    <th>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.email}>
                  <td>{admin.email}</td>
                
                    {isSuperAdmin &&(
                          <td>
                    <button className='btn-red'  onClick={() => removeAdmin(admin.email)}>Supprimer</button>
                    </td>
                    )}
                  
                </tr>
              ))}
            </tbody>
          </table>
          <div class="table-legend">
  </div>
        </div>
}
       
      </div>
    </Layout>
  );
}


export default withSwal(({ swal }, ref) => <AdminManagement swal={swal} />);

