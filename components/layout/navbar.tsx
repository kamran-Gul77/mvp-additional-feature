"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu, X, Truck } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold gradient-text">
                Compliance Buddy
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/cities/nyc" 
              className="text-foreground/80 hover:text-orange-500 transition-colors"
            >
              NYC Checklist
            </Link>
            <Link 
              href="/cities/dallas" 
              className="text-foreground/80 hover:text-orange-500 transition-colors"
            >
              Dallas Checklist
            </Link>
            <Link 
              href="/cities/la" 
              className="text-foreground/80 hover:text-orange-500 transition-colors"
            >
              LA Checklist
            </Link>
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="hover:text-orange-500">
                    Dashboard
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/sign-in">
                  <Button variant="ghost" className="hover:text-orange-500">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-orange-500 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/cities/nyc"
              className="block px-3 py-2 text-foreground/80 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              NYC Checklist
            </Link>
            <Link
              href="/cities/dallas"
              className="block px-3 py-2 text-foreground/80 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dallas Checklist
            </Link>
            <Link
              href="/cities/la"
              className="block px-3 py-2 text-foreground/80 hover:text-orange-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              LA Checklist
            </Link>
            
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-foreground/80 hover:text-orange-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start hover:text-orange-500">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}