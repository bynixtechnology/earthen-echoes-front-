import {
  Navigate,
  useRoutes,
} from "react-router-dom";

import publicRoutes from "./PublicRoutes";
import userRoutes from "./UserRoutes";
import adminRoutes from "./AdminRoutes";

const AppRoutes = () => {
 

  const routes = [
    ...publicRoutes,
    ...userRoutes,
    ...adminRoutes,
    {
      path: "*",

      element: (
        <Navigate
          to="/"
          replace
        />
      ),
    },
  ];


  return useRoutes(routes);
};

export default AppRoutes;