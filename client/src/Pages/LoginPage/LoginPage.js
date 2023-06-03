import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useFormik } from "formik";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loader from "../../Components/UI/Loader/Loader";
import { handleUserLogin } from "../../services/auth";
import { handleCompanyLogin } from "../../services/company";

import { _getSecureLs, _setSecureLs } from "../../helper/storage";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../helper/routes";

import "./LoginPage.css";
import Navbar from "../../Components/UI/navbar/navbar";

import loginImage from "../../Assets/Images/login-vector.jpg";

function Login(props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        let data;
        if (loginMode) {
          data = await handleCompanyLogin(values);
        } else {
          data = await handleUserLogin(values);
        }
        if (!data.userId) {
          console.log(data);
          return;
        }

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        _setSecureLs("auth", {
          isLoggedIn: true,
          token: data.token,
          user: data.userId,
          mode: loginMode ? "company" : "user",
          expiryDate: expiryDate.toISOString(),
        });

        navigate(`${ROUTES.DASHBOARD}`);
      } catch (e) {
        toast.error(e);
        console.log("error", e);
      }
    },
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLoginMode = () => {
    setLoginMode(!loginMode);
  };

  return (
    <div>
      <Navbar />
      <div className="login-wrapper">
        <div className="login-wrapper__image">
          <img src={loginImage} />
        </div>
        <div className="login-form">
          <Form className="card w-50" onSubmit={formik.handleSubmit}>
            <div className="card-body">
              <div className="card-title-wrapper">
                <h3 className="text-center mb-3">Login</h3>
              </div>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  placeholder="Enter Email"
                  isInvalid={formik.errors.email}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  placeholder="Password"
                  isInvalid={formik.errors.password}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  onClick={togglePassword}
                  label="Show Password"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  onClick={handleLoginMode}
                  label="Sign In as company"
                />
              </Form.Group>
              <div className="row">
                <div className="col d-grid">
                  <Button
                    className="btn btn-primary"
                    size="lg"
                    variant="primary"
                    type="submit"
                  >
                    {props.loading ? <Loader /> : "Login"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-center mb-2">
              <Form.Text>
                Don't have account?
                <Link to={ROUTES.SIGN_UP} style={{ fontWeight: "bold" }}>
                  {" "}
                  Sign Up
                </Link>
              </Form.Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
