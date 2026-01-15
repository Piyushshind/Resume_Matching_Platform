import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "./redux-provider";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Dashboard } from "@/pages/Dashboard";
import { Profile } from "@/pages/Profile";
import { RequireAuth } from "@/hooks/useAuthGuard";
import "./index.css";
import { Loans } from "./pages/Loans";
import { BooksPage } from "./pages/Books";

function App() {
  return (
    <Providers>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
     <Routes>
  {/* Auth */}
  <Route path="/login" element={<LoginForm />} />
  <Route path="/register" element={<RegisterForm />} />
  
  {/* Dashboard */}
  <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
  <Route path="/books" element={<RequireAuth><BooksPage /></RequireAuth>} />
  <Route path="/loans" element={<RequireAuth><Loans /></RequireAuth>} />
  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
  
  <Route path="/" element={<Navigate to="/dashboard" replace />} />
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>

            <Toaster />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Providers>
  );
}

export default App;
