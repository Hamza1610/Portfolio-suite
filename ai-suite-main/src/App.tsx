import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Workspace from "./pages/Workspace";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CreateBlog from "./pages/CreateBlog";
import Admin from "./pages/Admin";
import EditBlog from './pages/EditBlog';

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/create" element={<CreateBlog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/blog/:id/edit" element={<CreateBlog />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/blog/edit/:id" element={<EditBlog />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
