import { BooksTable } from '@/components/dashboard/BooksTable'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { RequireAuth } from '@/hooks/useAuthGuard'
import { useAppSelector } from '@/store/hooks'
import { Badge } from '@/components/ui/badge'

export function Dashboard() {
   const user = useAppSelector((state) => state.auth.user)

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-64 border-r bg-card hidden md:flex shrink-0">
            <Sidebar />
          </div>
          
          {/* Mobile Sidebar Overlay */}
          <div className="md:hidden flex-1">
            {/* Sidebar will be in Sheet from Header */}
          </div>
          
          {/* Main Content */}
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <div className="mb-6 flex items-center gap-3">
              <Badge className="text-lg px-4 py-2">Welcome, {user?.username}</Badge>
              <div className="text-3xl font-bold">Library Dashboard</div>
            </div>
            <BooksTable />
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
