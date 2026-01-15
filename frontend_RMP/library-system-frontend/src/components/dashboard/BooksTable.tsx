import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
// import { bookAPI } from '@/lib/api'

interface Book {
  id: number
  title: string
  isbn: string
  category: { name: string }
  copies_available: number
  total_copies: number
}

export function BooksTable() {
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:8000/api/books/?copies_available__gt=0', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch books')
      return response.json()
    }
  })

  if (isLoading) {
    return <div className="text-center py-12">Loading books...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Available Books</h2>
        <div className="text-sm text-muted-foreground">
          {books?.length || 0} books available
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books?.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>
                <Badge variant="secondary">{book.category.name}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Badge variant={book.copies_available > 0 ? "default" : "destructive"}>
                    {book.copies_available}
                  </Badge>
                  <span className="text-sm text-muted-foreground">of {book.total_copies}</span>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Borrow</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
