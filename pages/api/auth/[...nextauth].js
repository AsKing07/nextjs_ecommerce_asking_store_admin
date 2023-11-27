import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from "@/lib/mongodb";
import { Admin } from '@/models/Admin'; 
import { mongooseConnect } from '@/lib/mongoose';


export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session,token,user}) => {
      await mongooseConnect(); // Connexion à MongoDB
      const admin = await Admin.findOne({ email: session.user.email });

      if (admin || session.user.email==="charbelsnn@gmail.com") {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);



export async function isAdminRequest(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Vérification si la session est valide
    if (!session?.user?.email) {
      res.status(401).end();
      throw "Vous n'êtes pas connecté en tant qu'administrateur";
    }

    await mongooseConnect(); // Connexion à MongoDB
    const admin = await Admin.findOne({ email: session.user.email });

    // Vérification si l'utilisateur actuel est un administrateur dans la base de données
    if (!admin && session.user.email!=="charbelsnn@gmail.com" ) {
      res.status(401).end();
      throw "Vous n'êtes pas un administrateur";
    }
  } catch (error) {
    res.status(401).json({ message: 'Accès refusé', error });
  }
}
