import { Link } from 'react-router-dom'
import { BookOpen, User, LogOut, LayoutDashboard, History, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/slices/authSlice'
import { useLocation } from 'react-router-dom'

export function Sidebar() {
  const dispatch = useAppDispatch()
  const location = useLocation()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/books', label: 'Books', icon: BookOpen },
    { href: '/loans', label: 'My Loans', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          📚 Library
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start h-12 gap-3"
            >
              <Link to={item.href}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 gap-3 text-destructive hover:text-destructive/90 hover:bg-destructive/5"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
