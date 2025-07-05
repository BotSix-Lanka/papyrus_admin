import DashboardLayout from "@/app/components/dashboard-layout"
import AuthGuard from "@/app/components/auth-guard"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  )
} 