import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data: session} = useSession();
  if(!session)
  {
    return (
      <div className='bg-blue-900 w-screen h-screen flex items-center'>
        <div className='text-center w-full'>
          <button 
            onClick={() =>signIn('google')}
            className='bg-white p-2 px-4 rounded-lg'>
            Se connecter avec Google
          </button>
        </div>
      </div>
      )
  }
  else
  {
    return(
      <div className='bg-blue-900 min-h-screen'>
                <Nav />
                <div>Connecté en tant que {session.user.email}</div>
      </div>
    )
  }

}


///pages/api/auth/[...nextauth].js