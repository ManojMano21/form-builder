import { createBrowserRouter } from "react-router-dom";

import { Home } from "./components/Home";
import { FormBuilder } from "./components/FormBuilder";
import { FormView } from "./components/FormView";
import { FormResponses } from "./components/FormResponses";

// ✅ 404 Component
function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/create",
    Component: FormBuilder,
  },
  {
    path: "/forms/:formId",
    Component: FormView,
  },
  {
    path: "/forms/:formId/responses",
    Component: FormResponses,
  },
  {
    path: "*",
    Component: NotFound, // ✅ FIXED (no error)
  },
]);