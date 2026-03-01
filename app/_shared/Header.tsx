'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

function Header() {
  const {user} = useUser()
  
  return (
    <header className="relative flex items-center justify-between px-10 py-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UI/UX</span> Generator
        </h2>
      </div>
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ul className="flex gap-7 items-center text-md">
          <li className="cursor-pointer">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link href="/" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex items-center">
        {!user ? (
          <SignInButton mode="modal">
            <Button className="cursor-pointer">Get Started</Button>
          </SignInButton>
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  )
}

export default Header
