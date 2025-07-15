'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  UtilityPole,
  Wallet,
  Recycle,
  Vote,
  User,
  Users,
  Home
} from 'lucide-react'
import { title } from 'process'

const links = [
  { id: 1, title: 'Home', url: '/', icon: Home },
  { id: 2, title: 'Wallet', url: '/wallet', icon: Wallet },
  { id: 3, title: 'Recycle', url: '/recycle', icon: Recycle },
  { id: 4, title: 'Utilities', url: '/utilities', icon: UtilityPole },
  { id: 5, title: 'DAO Voting', url: '/dao', icon: Vote },
  { id: 6, title: 'Referrals', url: '/referrals', icon: Users },
  { id: 7, title: 'Agents', url: '/agents', icon: User },
]

const SideNav = () => {
  const pathname = usePathname();

  return (
    <div>
      <nav className="hidden md:inset-y-0 sticky md:left-0 md:flex basis-[30%] h-[100dvh] overflow-y-hidden md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              PayVerse
            </h1>
          </div>

          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.url;

                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-5 w-5" />
                    {link.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default SideNav
