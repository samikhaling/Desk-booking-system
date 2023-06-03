import { Navigate } from "react-router-dom";
import { ROUTES } from "../../helper/routes";
import { _getSecureLs } from "../../helper/storage";

function PrivateRoute({ children }) {
  const { isLoggedIn } = _getSecureLs("auth");
  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return children;
}

export default PrivateRoute;
