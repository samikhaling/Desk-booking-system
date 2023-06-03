import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  getCompanyFloors,
  getFloorRooms,
  handleAddDesk,
} from "../../../../services/company";
import { connect } from "react-redux";

function DeskModal(props) {
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchCompanyFloors = async () => {
    try {
      const response = await getCompanyFloors(props.selectedCompany?._id);
      console.log(response?.results);
      setFloors(response?.results);
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    }
  };
  useEffect(() => {
    fetchCompanyFloors();
  }, []);

  const fetchFloorRooms = async (fid) => {
    console.log(fid, "option clicked");
    try {
      const response = await getFloorRooms(fid);
      setRooms(response?.results);
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    }
  };

  const formik = useFormik({
    initialValues: {
      floor: "",
      room: "",
      deskName: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = await handleAddDesk(props.selectedCompany?._id, values);
        if (!data) {
          throw new Error("Failed to add the floor");
        }
        props.handleClose();
        resetForm({ values: "" });
        // console.log(data);
        toast("desk added successfully");
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
          <h5 className="text-center">Add Desk</h5>
          <Form onSubmit={formik.handleSubmit} className="text-right">
            <Form.Group className="mb-3 text-left">
              <Form.Label className="mr-2">
                Floor<span>*</span>:{" "}
              </Form.Label>
              <Form.Select
                name="floor"
                value={formik.values.floor}
                onChange={formik.handleChange}
                onClick={() =>
                  formik.values.floor && fetchFloorRooms(formik.values.floor)
                }
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
              <Form.Label className="mr-2">
                Room<span>*</span>:{" "}
              </Form.Label>
              <Form.Select
                name="room"
                value={formik.values.room}
                onChange={formik.handleChange}
              >
                <option>Select Room</option>
                {rooms?.map((r) => {
                  return (
                    <option key={r._id} value={r._id}>
                      {r.roomName}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 text-left">
              <Form.Label>
                Desk Name<span>*</span>:{" "}
              </Form.Label>
              <Form.Control
                type="text"
                name="deskName"
                value={formik.values.deskName}
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

export default connect(mapStateToProps)(DeskModal);
