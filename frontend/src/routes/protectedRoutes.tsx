import AddLead from "@/pages/AddLead";
import AddProject from "@/pages/AddProject";
import AddTask from "@/pages/AddTask";
import Dashboard from "@/pages/Dashboard";
import LeadDetail from "@/pages/LeadDetail";
import Leads from "@/pages/Leads";
import Projects from "@/pages/Projects";
import path from "path";


export const protectedRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/leads",
    element: <Leads />,
  },
  {
    path: "/leads/new",
    element: <AddLead />,
  },
  {
    path: "/leads/:leadId",
    element: <LeadDetail />,
  },
  {
    path: "/tasks/new/:leadId",
    element: <AddTask />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/projects/new",
    element: <AddProject />,
  },
];
