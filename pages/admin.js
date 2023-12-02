/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { withSwal } from "react-sweetalert2";
import NextAuth from 'next-auth'
import { useSession } from 'next-auth/react';
import Spinner from "@/components/Spinner";
import { prettyDate } from '@/lib/date';





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
      swal.fire({
        title: 'Erreur!',
        text:`Erreur lors de la récupération des administrateurs : ${ error.response.data.message}`,
        icon: 'error',
      });
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin', { email: newAdminEmail });
      swal.fire({
        title: 'Admin créé!',
        icon: 'success',
      });
      setNewAdminEmail('');
      getAdmins();
    } catch (error) {
      swal.fire({
        title: 'Erreur!',
        text:`Erreur lors de l\'ajout de l\'administrateur : ${error.response.data.message}` ,
        icon: 'error',
      });
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
            swal.fire({
              title: 'Admin supprimé!',
              icon: 'success',
            });
            getAdmins();
          } catch (error) {
            swal.fire({
              title: 'Erreur!',
              text:`Erreur lors de la suppression de l\'administrateur : ${error.response.data.message}` ,
              icon: 'error',
            });
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
   <h1>Ajouter un nouvel administrateur :</h1>
   <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
          required
            type="text"
            className="mb-0"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Email Google de l'administrateur"/>
          <button
            type="submit"
            className="btn-primary py-1 whitespace-nowrap">
            Ajouter l'adminisrateur
          </button>
        </div>
      </form>
  
 </div>
        )}

      {isLoading? <div className="flex justify-center">
                <Spinner />
                </div> :
           
          <table className="basic mt-2">
          <caption><h2>Administrateur existants </h2></caption>
          <caption>    <p>Pour supprimer ou ajouter des utilisateurs, veuillez contacter le SuperAdmin charbelsnn@gmail.com</p>
</caption>
            <thead>
              <tr>
                <th className="text-left">Email Google Admin</th>
                <th>Date de création</th>
                {isSuperAdmin &&(
                    <th>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 && admins.map((admin) => (
                <tr key={admin.email}>
                  <td>{admin.email}</td>
                  <td>{admin?.createdAt && prettyDate(admin?.createdAt)}</td>
                
                    {isSuperAdmin &&(
                          <td>
                    <button className='btn-red'  onClick={() => removeAdmin(admin.email)}>Supprimer</button>
                    </td>
                    )}
                  
                </tr>
              ))}
            </tbody>
          </table>
       
       
}
       
      </div>
    </Layout>
  );
}


export default withSwal(({ swal }, ref) => <AdminManagement swal={swal} />);

