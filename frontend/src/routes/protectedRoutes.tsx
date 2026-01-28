import CompleteTask from "@/pages/CompleteTask";
import ScheduleSiteVisit from "@/pages/ScheduleSiteVisit";
import CreateQuotation from "@/pages/CreateQuotation";
import AddLead from "@/pages/AddLead";
import AddProject from "@/pages/AddProject";
import AddTask from "@/pages/AddTask";
import Dashboard from "@/pages/Dashboard";
import LeadDetail from "@/pages/LeadDetail";
import Leads from "@/pages/Leads";
import Projects from "@/pages/Projects";
import Reports from "@/pages/Reports";
import Inquiries from "@/pages/Inquiries";
import ImportLeads from "@/pages/ImportLeads";
import UsersPage from "@/pages/Users";
import path from "path";


import ProjectDetail from "@/pages/ProjectDetail";
import Profile from "@/pages/Profile";
import AddUser from "@/pages/AddUser";
import Notifications from "@/pages/Notifications";
import Privacy from "@/pages/Privacy";
import Help from "@/pages/Help";

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
    path: "/leads/:id",
    element: <LeadDetail />,
  },
  {
    path: "/tasks/new",
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
  {
    path: "/projects/:id",
    element: <ProjectDetail />,
  },
  {
    path: "/leads/import",
    element: <ImportLeads />,
  },
  {
      path: "/users",
      element: <UsersPage />,
  },
  {
      path: "/users/new",
      element: <AddUser />,
  },
  {
    path: "/inquiries",
    element: <Inquiries />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings/notifications",
    element: <Notifications />,
  },
  {
    path: "/settings/privacy",
    element: <Privacy />,
  },
  {
    path: "/settings/help",
    element: <Help />,
  },
  {
      path: "/tasks/complete/:id",
      element: <CompleteTask />,
  },
  {
      path: "/site-visits/new",
      // element: <ScheduleSiteVisit />, // Assuming this component exists as file, need import
      element: <ScheduleSiteVisit />, 
  },
  {
      path: "/quotations/new",
      // element: <CreateQuotation />, // need import
      element: <CreateQuotation />,
  },
];
