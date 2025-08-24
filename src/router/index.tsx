import { useRoutes } from "react-router";
import Dashboard from "../pages/dashboard";
import Records from "../pages/records";
import Login from "../pages/login";
import Tools from "../pages/tools";
import App from "../App.tsx";
import Page404 from "../pages/404";
import Page400 from "../pages/400";
import Page500 from "../pages/500";

function Router() {
  const routes = [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/records",
          element: <Records />,
        },
        {
          path: "/tools",
          element: <Tools />,
        },
        {
          path: "/records/:tab",
          element: <Records />,
        },
      ],
    },
    {
      path: "/404",
      element: <Page404 />,
    },
    {
      path: "/400",
      element: <Page400 />,
    },
    {
      path: "/500",
      element: <Page500 />,
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
