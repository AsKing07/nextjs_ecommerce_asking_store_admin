import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav';

const inter = Inter({ subsets: ['latin'] })

export default function  Layout({children}){
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
      <div className='bg-blue-900 min-h-screen flex'>
                <Nav />
                <div className='bg-white flex-grow mt-1 mr-1 mb-2 rounded-lg p-4'>{children}</div>
      </div>
    )
  }

}


