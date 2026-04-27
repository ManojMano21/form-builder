import { createBrowserRouter } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import { Home } from "./components/Home";
import Dashboard from "./components/Dashboard";
import { FormBuilder } from "./components/FormBuilder";
import { FormView } from "./components/FormView"; // ✅ ADD THIS

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  { path: "/dashboard", element: <Dashboard /> },

  { path: "/create", element: <FormBuilder /> },

  { path: "/home", element: <Home /> },

  // 🔥 THIS IS THE MISSING PIECE
  { path: "/forms/:formId", element: <FormView /> },

  { path: "*", element: <NotFound /> },
]);