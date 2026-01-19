import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useNavigation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Login from "@/pages/Login";
import PrivateRoutes from "@/routes/PrivateRoutes";

import { AuthProvider } from "./hooks/useAuth";
import { protectedRoutes } from "./routes/protectedRoutes";
import Dashboard from "./pages/Dashboard";
import { AppDataProvider } from "./contex/DataContext";
import AppRoutes from "./AppRoutes";


const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <AppDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

         <Router>
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </AppDataProvider>
    </QueryClientProvider>
  );
};

export default App;
