import { BookOpen, User, LogOut, LayoutDashboard, History } from 'lucide-react'
import { NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { Link } from 'react-router-dom'

export function Sidebar() {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-4 border-b">
        <div className="font-bold text-xl text-primary">📚 Library</div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-2">
          <NavigationMenuItem className="w-full">
            <NavigationMenuLink asChild>
              <Link 
                to="/dashboard" 
                className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start h-12"
              >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-full">
            <NavigationMenuLink asChild>
              <Link 
                to="/books" 
                className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start h-12"
              >
                <BookOpen className="mr-3 h-4 w-4" />
                <span>Books</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-full">
            <NavigationMenuLink asChild>
              <Link 
                to="/loans" 
                className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start h-12"
              >
                <History className="mr-3 h-4 w-4" />
                <span>My Loans</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-full">
            <NavigationMenuLink asChild>
              <Link 
                to="/profile" 
                className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start h-12"
              >
                <User className="mr-3 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-sm text-destructive hover:text-destructive/80 p-3 rounded-md hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
