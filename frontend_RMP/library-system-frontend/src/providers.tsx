'use client'
import { Providers } from './redux-provider'

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
