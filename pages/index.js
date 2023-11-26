import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return <Layout>test</Layout>

}


///pages/api/auth/[...nextauth].js