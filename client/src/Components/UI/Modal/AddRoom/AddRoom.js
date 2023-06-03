import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getCompanyFloors, handleAddRoom } from "../../../../services/company";
import { connect } from "react-redux";

function RoomModal(props) {
  console.log(props.selectedCompany?._id);
  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);

  const fetchCompanyFloors = async () => {
    try {
      const response = await getCompanyFloors(props.selectedCompany?._id);
      // setFloors((prevState) => {
      //   return [...prevState, ...response?.results];
      // });
      setFloors(response?.results);
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    }
  };
  useEffect(() => {
    navigate("/manage");
    fetchCompanyFloors();
    // return () => {
    //   setFloors([]);
    // };
  }, []);

  const formik = useFormik({
    initialValues: {
      floor: "",
      roomName: "",
      deskCapacity: 0,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = await handleAddRoom(props.selectedCompany?._id, values);
        if (!data) {
          throw new Error("Failed to add the room");
        }
        props.handleClose();
        resetForm({ values: "" });
        // console.log(data);
        toast("room added successfully");
        // navigate(`/${ROUTES.COMPANY}`);
      } catch (e) {
        toast.error(e);
        console.log("error", e);
      }
    },
  });
  return (
    <>
      <Modal show={props.Show} onHide={props.handleClose} className="addModal">
        <Modal.Body>
          <h5 className="text-center m-3">Add Room</h5>
          <Form onSubmit={formik.handleSubmit} className="text-right">
            <Form.Group className="mb-3 text-left">
              <Form.Label className="mr-2">
                Floor<span>*</span>:{" "}
              </Form.Label>
              <Form.Select
                name="floor"
                value={formik.values.floor}
                onChange={formik.handleChange}
              >
                <option>Select Floor</option>
                {floors?.map((f) => {
                  return (
                    <option key={f._id} value={f._id}>
                      Floor {f.floorName}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 text-left">
              <Form.Label>
                Room Name<span>*</span>:{" "}
              </Form.Label>
              <Form.Control
                type="text"
                name="roomName"
                value={formik.values.roomName}
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 text-left">
              <Form.Label>
                Total Desk Capacity<span>*</span>:{" "}
              </Form.Label>
              <Form.Control
                type="number"
                name="deskCapacity"
                value={formik.values.deskCapacity}
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Button variant="success" type="submit" className="text-right">
              Add Now
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedCompany: state.selectedCompany,
  };
};

export default connect(mapStateToProps)(RoomModal);
