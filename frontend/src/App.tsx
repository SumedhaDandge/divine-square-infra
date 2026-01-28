import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppDataProvider } from "./contex/DataContext";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <AppRoutes />
            </Router>
          </TooltipProvider>
        </AppDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
