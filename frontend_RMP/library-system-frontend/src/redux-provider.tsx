'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'

export function Providers({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Provider store={store}>
      <div ref={ref}>{children}</div>
    </Provider>
  )
}
