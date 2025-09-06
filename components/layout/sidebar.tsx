"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Settings, 
  Crown,
  Truck
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Checklists',
    href: '/checklists',
    icon: CheckSquare,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link href="/" className="flex items-center space-x-2">
          <Truck className="h-8 w-8 text-orange-500" />
          <span className="text-lg font-semibold gradient-text">
            Compliance Buddy
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
                  : 'text-foreground/80 hover:bg-accent hover:text-orange-500'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center p-4 bg-gradient-to-r from-orange-600/20 to-orange-500/10 rounded-lg border border-orange-600/20">
          <Crown className="h-6 w-6 text-orange-500 mr-3" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
            <p className="text-xs text-foreground/60">Unlimited checklists</p>
          </div>
        </div>
      </div>
    </div>
  );
}