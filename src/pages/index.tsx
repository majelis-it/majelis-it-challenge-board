import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    window.location.href = '/challenge/1'
  }, [0])
  return <>Redirecting</>
}
