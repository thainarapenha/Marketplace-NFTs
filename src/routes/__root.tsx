import { createRootRoute, Outlet } from '@tanstack/react-router'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

function RootLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})