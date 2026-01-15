'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { bookAPI } from '@/lib/api'
import { BookOpen, Search } from 'lucide-react'

interface Book {
  id: number
  title: string
  isbn: string
  category: { name: string }
  copies_available: number
  total_copies: number
}

export function BooksTable() {
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()  // ✅ FIXED: Hook at top level
  
  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ['books', search],
    queryFn: bookAPI.getAvailableBooks,
  })

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.isbn.includes(search) ||
    book.category.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleBorrow = (book: Book) => {
    setSelectedBook(book)
  }

  const confirmBorrow = async () => {
    if (!selectedBook) return
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/books/${selectedBook.id}/borrow/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        toast({
          title: "✅ Book Borrowed Successfully!",
          description: `"${selectedBook.title}" added to your loans`,
        })
        setSelectedBook(null)
        queryClient.invalidateQueries({ queryKey: ['books'] })  // ✅ Better than reload
      } else {
        const errorData = await response.json()
        toast({
          title: "❌ Borrow Failed",
          description: errorData.error || "Book not available",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "❌ Network Error",
        description: "Failed to borrow book",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading books...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-destructive text-lg">Failed to load books</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['books'] })}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header - OPTIMIZED */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            Available Books
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredBooks.length} of {books.length} books available
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, ISBN, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md w-full"
          />
        </div>
      </div>

      {/* Books Table - ENHANCED */}
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length ? (
              filteredBooks.map((book) => (
                <TableRow key={book.id} className="border-b hover:bg-muted/50">
                  <TableCell className="font-medium max-w-[300px] truncate" title={book.title}>
                    {book.title}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{book.isbn}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{book.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={book.copies_available > 0 ? "default" : "destructive"}
                        className={book.copies_available > 0 ? "bg-green-100 text-green-800 border-green-200" : ""}
                      >
                        {book.copies_available}
                      </Badge>
                      <span className="text-sm text-muted-foreground">of {book.total_copies}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {book.copies_available > 0 ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBorrow(book)}
                        className="h-9 px-4"
                      >
                        Borrow
                      </Button>
                    ) : (
                      <Badge variant="destructive" className="px-3 py-1">
                        Unavailable
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center py-8">
                  <div className="space-y-2">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-xl font-medium text-muted-foreground">
                      No books found matching "{search || 'your search'}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search terms
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Borrow Dialog - ENHANCED */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Borrow Book
            </DialogTitle>
            <DialogDescription>
              Confirm you want to borrow <strong>"{selectedBook?.title}"</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ISBN:</span>
                <span className="font-mono text-sm">{selectedBook?.isbn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Available Copies:</span>
                <span className="font-semibold text-green-600">{selectedBook?.copies_available}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Loan Period:</span>
                <span className="text-sm text-muted-foreground">14 days</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setSelectedBook(null)}
            >
              Cancel
            </Button>
            <Button onClick={confirmBorrow}>Borrow Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
