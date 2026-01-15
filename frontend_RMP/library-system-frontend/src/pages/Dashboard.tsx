import { BooksTable } from '@/components/dashboard/BooksTable'
import { RequireAuth } from '@/hooks/useAuthGuard'
import { Header } from '@/components/layout/Header'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r hidden md:block">
          {/* Sidebar content */}
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          <BooksTable />
        </main>
      </div>
    </div>
  )
}
