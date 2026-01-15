import { BookOpen, User, LogOut, LayoutDashboard, History } from 'lucide-react'
import { SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'

export function Sidebar() {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="font-bold text-xl text-primary">📚 Library</div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col space-y-2 w-full">
            <NavigationMenuItem>
              <NavigationMenuLink href="/dashboard" className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start">
                <LayoutDashboard className="mr-3 h-4 w-4" />
                <span>Dashboard</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/books" className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start">
                <BookOpen className="mr-3 h-4 w-4" />
                <span>Books</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/loans" className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start">
                <History className="mr-3 h-4 w-4" />
                <span>My Loans</span>
              </NavigationMenuLink>
            <NavigationMenuItem>
              <NavigationMenuLink href="/profile" className="group flex w-full items-center rounded-md border p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground justify-start">
                <User className="mr-3 h-4 w-4" />
                <span>Profile</span>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-sm text-destructive hover:text-destructive/80"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
  )
}
