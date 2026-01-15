import { BooksTable } from '@/components/dashboard/BooksTable'

export function BooksPage() {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">📚 Book Catalog</h1>
      </div>
      <BooksTable />
    </div>
  )
}
