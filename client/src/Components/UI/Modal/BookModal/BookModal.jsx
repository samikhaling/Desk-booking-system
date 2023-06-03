import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { DateRangePicker } from "react-date-range";
import {
  bookDesk,
  bookRoom,
  cancelDesk,
  cancelRoom,
} from "../../../../services/company";

function BookingModal(props) {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  console.log(props?.data);

  const handleSelect = (ranges) => {
    setSelectionRange((prev) => ({
      ...prev,
      endDate: ranges?.selection?.endDate,
      startDate: ranges?.selection?.startDate,
    }));
  };

  const bookSpace = async ({
    floorId,
    deskId,
    roomId,
    companyId,
    userMode,
  }) => {
    try {
      !props?.data?.isRoom
        ? await bookDesk(
            deskId,
            roomId,
            floorId,
            companyId,
            selectionRange,
            userMode
          )
        : await bookRoom(roomId, floorId, companyId, selectionRange, userMode);

      props?.refetchFloors();
      props?.handleClose();
    } catch (e) {
      throw new Error(e);
    }
  };

  const cancelSpace = async ({ floorId, deskId, roomId, userMode }) => {
    try {
      !props?.data?.isRoom
        ? await cancelDesk(deskId, roomId, floorId, userMode)
        : await cancelRoom(roomId, floorId, userMode);

      props?.refetchFloors();
      props?.handleClose();
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <Modal
      size="lg"
      show={props.Show}
      onHide={props.handleClose}
      className="addModal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {!props?.data?.isCancel ? "Book Now" : "Cancel Booking"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center mb-3">
          Please select the data below for booking
        </div>

        <div className="d-flex justify-content-center">
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
        </div>
      </Modal.Body>

      <Modal.Footer closeButton>
        <Button onClick={props?.handleClose} variant="danger">
          Cancel
        </Button>
        <Button
          onClick={() => {
            !props?.data?.isCancel
              ? bookSpace(props?.data)
              : cancelSpace(props?.data);
          }}
        >
          {props?.data?.isCancel ? "Cancel Booking?" : "Book Now"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default BookingModal;
