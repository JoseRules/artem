'use client';

import Link from 'next/link';
import { ArtemIcon, CandleIcon } from '@/assets/icons';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="
      sticky top-0 z-50
      bg-background/80 backdrop-blur-md
      border-b border-border
      shadow-sm
    ">
      <div className="
        max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        h-16 sm:h-20
      ">
        <div className="
          flex items-center justify-between
          h-full
        ">
          {/* Logo and Brand */}
          <div className="
            flex items-center space-x-3
            group cursor-pointer
          ">

              <ArtemIcon color="white" size={40} className="w-8 h-8 sm:w-10 sm:h-10" />

            <h1 className="
              text-xl sm:text-2xl lg:text-3xl
              font-bold
              text-foreground
              group-hover:text-primary
              transition-colors duration-200
            ">
              Artem
            </h1>
          </div>

          {/* Right side - Sign Up Button and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              href="/signUp"
              className="
                px-4 py-2
                rounded-lg
                bg-primary hover:bg-primary/90
                text-white
                font-medium
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                active:scale-95
              "
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
