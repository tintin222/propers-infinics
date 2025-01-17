import Image from 'next/image'
import React from 'react'

export const Header: React.FC = async () => {
  return (
    <header className="fixed w-full p-4 flex justify-between items-center z-50 backdrop-blur bg-background/80">
      <div className="flex-1 flex justify-start">
        <a href="/" className="flex items-center">
          <Image 
            src="/logo-dark.png"
            alt="Propers Logo"
            width={100}
            height={20}
            className="dark:hidden object-contain"
            priority
          />
          <Image 
            src="/logo-light-propers.png"
            alt="Propers Logo"
            width={100}
            height={20}
            className="hidden dark:block object-contain"
            priority
          />
        </a>
      </div>
    </header>
  )
}

export default Header
