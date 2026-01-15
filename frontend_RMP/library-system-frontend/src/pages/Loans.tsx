import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'

interface Loan {
  id: number
  title: string
  loan_date: string
  due_date: string
  status: 'active' | 'overdue' | 'returned'
}

export function Loans() {
  const { data: loans = [], isLoading } = useQuery<Loan[]>({
    queryKey: ['loans'],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:8000/api/me/loans/', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || null}`,  
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch loans')
      return response.json()
    }
  })

  if (isLoading) return <div className="text-center py-12">Loading loans...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">My Loans</h2>
        <div className="text-2xl font-bold text-muted-foreground">
          {loans.length} active
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Loan Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length ? (
              loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.title}</TableCell>
                  <TableCell>{new Date(loan.loan_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(loan.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={loan.status === 'overdue' ? 'destructive' : 'default'}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Return</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No active loans
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
