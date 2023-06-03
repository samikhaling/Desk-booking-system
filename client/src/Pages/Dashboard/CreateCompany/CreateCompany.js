import React, { useState, useEffect } from "react";
import "./CreateCompany.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { handleCreateCompany, handleEditCompany } from "../../../services/auth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../helper/routes";
import { _setSecureLs, _getSecureLs } from "../../../helper/storage";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import * as actions from "../../../store/action/index";

function CreateCompany(props) {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => {
        if (res.status !== 200) {
          const err = new Error("Cannot fetch the country");
          throw err;
        }
        return res.json();
      })
      .then((resData) => {
        const countryNames = resData?.map((n) => n.name.common).sort();
        setCountries(countryNames);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: props.isEditing ? props.selectedCompany.companyName : "",
      contactNumber: props.isEditing ? props.selectedCompany.contactNumber : "",
      street: props.isEditing ? props.selectedCompany.address.street : "",
      city: props.isEditing ? props.selectedCompany.address.city : "",
      state: props.isEditing ? props.selectedCompany.address.state : "",
      country: props.isEditing ? props.selectedCompany.address.country : "",
    },
    onSubmit: async (values) => {
      try {
        let data;
        if (props.isEditing) {
          data = handleEditCompany(props.selectedCompany._id, values);
        } else {
          data = await handleCreateCompany(values);
        }
        if (!data) {
          return;
        }
        console.log(data);

        props.isEditing
          ? (window.location.href = `/${ROUTES.COMPANY}/${ROUTES.COMPANY_INFO}/${props.selectedCompany?._id}`)
          : navigate(`/${ROUTES.COMPANY}`);
        props.onFinishEditing();
        toast(
          `Company ${props.isEditing ? "updated" : "registered"} successfully`
        );
      } catch (e) {
        toast.error(e);
        console.log("error", e);
      }
    },
  });

  return (
    <div className="dashboard__create__company">
      <div className="dashboard__create__company__header">
        <h2>{props.isEditing ? "Update" : "Register"} Your Company</h2>
        <p>
          Please provide the required details to register your company with us
        </p>
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Company Name<span>*</span>:{" "}
          </Form.Label>
          <Form.Control
            type="text"
            name="companyName"
            value={formik.values.companyName}
            onChange={formik.handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Contact Number<span>*</span>:
          </Form.Label>
          <Form.Control
            type="number"
            name="contactNumber"
            value={formik.values.contactNumber}
            onChange={formik.handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            Address<span>*</span>:
          </Form.Label>
          <Form.Control
            type="text"
            name="street"
            value={formik.values.street}
            onChange={formik.handleChange}
            placeholder="Street Address"
          />
          <Form.Control
            type="text"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            placeholder="City"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label></Form.Label>
          <Form.Control
            type="text"
            name="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            placeholder="State/Province"
          />
          <Form.Select
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
          >
            <option>Select Country</option>
            {countries?.map((name) => {
              return (
                <option key={name} value={name}>
                  {name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          {props.isEditing ? "Update Company" : "Register Now"}
        </Button>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isEditing: state.isEditing,
    selectedCompany: state.selectedCompany,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitEditing: () => dispatch(actions.editCompany()),
    onFinishEditing: () => dispatch(actions.finishEditCompany()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCompany);
