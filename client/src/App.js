import React from "react";

import { ToastContainer } from "react-toastify";

import { Routes, Route } from "react-router-dom";
import SignUp from "./Pages/Signup.js/Signup";
import Login from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Landing from "./Pages/landing/landing";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ROUTES } from "./helper/routes";
import CreateCompany from "./Pages/Dashboard/CreateCompany/CreateCompany";
import Company from "./Pages/Dashboard/Company/Company";
import DashboardHome from "./Pages/Dashboard/dashboard/dashboard";
import CompanyInfo from "./Pages/Dashboard/CompanyInfo/CompanyInfo";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path={ROUTES.LANDING} element={<Landing />} />

        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route
          path={ROUTES.ROOT}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardHome />} />
          <Route path={ROUTES.COMPANY} element={<Company />} />
          <Route
            path={`${ROUTES.COMPANY}/${ROUTES.COMPANY_INFO}/:cid`}
            element={<CompanyInfo />}
          />
          <Route
            path={`${ROUTES.COMPANY}/${ROUTES.CREATE_COMPANY}`}
            element={<CreateCompany />}
          />
        </Route>
        <Route
          path="*"
          element={<p className="text-center">404! Page Not Found</p>}
        />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
