import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import BookingModal from "../../../Components/UI/Modal/BookModal/BookModal";
import { useParams, useSearchParams } from "react-router-dom";
import { getCompanyFloors, getCompany } from "../../../services/company";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { isEmptyArray } from "formik";
import { MdKeyboardBackspace } from "react-icons/md";
import { getCurrentUserId, _getSecureLs } from "../../../helper/storage";
import ReactTooltip from "react-tooltip";
import { getIconBasedOnName } from "../../../helper/ammenites";

function CompanyInfo() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  console.log(userId);
  const userMode = _getSecureLs("auth")?.mode;
  const [showModal, setShowModal] = useState(false);
  const [isFetchingCompanyInfo, setIsFetchingCompanyInfo] = useState(true);
  const [isFetchingFloors, setIsFetchingFloors] = useState(true);
  const { cid } = useParams();
  const [searchParams] = useSearchParams();
  const [workspace, setWorkspace] = useState({
    company: null,
    floors: [],
    rooms: [],
    desks: 0,
    floorId: null,
  });

  const [currentFloor, setCurrentFloor] = useState({});
  const [bookingPayload, setBookingPayload] = useState({
    floorId: "",
    companyId: "",
    deskId: "",
    roomId: "",
    userMode: "",
    isCancel: false,
    isRoom: false,
  });

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchCompany = async () => {
    setIsFetchingCompanyInfo(true);
    try {
      const response = await getCompany(cid);
      setWorkspace((prevState) => {
        return {
          ...prevState,
          company: response?.result,
        };
      });
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    } finally {
      setIsFetchingCompanyInfo(false);
    }
  };

  const fetchCompanyFloors = async () => {
    setIsFetchingFloors(true);
    try {
      const response = await getCompanyFloors(cid);
      setWorkspace((prevState) => {
        return {
          ...prevState,
          floors: response?.results,
        };
      });

      // if floor is not set in URL, select the first floor available
      if (!searchParams.get("floor")) {
        const [firstFloor] = response?.results;
        setCurrentFloor(firstFloor);
        navigate("?floor=" + firstFloor._id);
      } else {
        selectFloorFromUrl(searchParams.get("floor"), response?.results);
      }
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    } finally {
      setIsFetchingFloors(false);
    }
  };
  useEffect(() => {
    fetchCompany();
    fetchCompanyFloors();
  }, []);

  const toggleBookingModal = (data) => {
    setBookingPayload(data);
    setShowModal(!showModal);
  };

  const selectFloorFromUrl = (id, floors) => {
    const selectedFloor = floors?.find((item) => item?._id === id);

    if (selectedFloor) {
      setCurrentFloor(selectedFloor);
    }
  };

  const getRoomBookStatus = (room) => {
    if (room?.bookStatus && room?.bookedBy === userId) return "Cancel Booking";
    if (room?.bookStatus && room?.bookedBy !== userId) return "Room Reserved";
    if (!room?.bookStatus) return "Book Room";
  };

  /**
   * Render the details of the company
   * P.S, it is the place where booking is placed
   * @returns
   */
  const renderCompanyDetails = () => {
    return (
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <div
              className="company-info-title"
              onClick={() => navigate("/company")}
            >
              <MdKeyboardBackspace />
              <span>{workspace?.company?.companyName || "-"}</span>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Row>
              <Col md={3}>
                <div className="mb-2">Available floors </div>
                <div className="info-sidebar-wrapper">
                  {!isFetchingFloors &&
                    workspace?.floors?.map((item) => {
                      return (
                        <div
                          className={classNames("floor-sidebar", {
                            "floor-sidebar--active":
                              item?._id === currentFloor?._id,
                          })}
                          role={"button"}
                          onClick={() => {
                            navigate("?floor=" + item._id);

                            setCurrentFloor(item);
                          }}
                        >
                          Floor {item.floorNumber}
                        </div>
                      );
                    })}
                  {!isFetchingFloors && isEmptyArray(workspace?.floors) && (
                    <div className="d-flex justify-content-center mt-3">
                      No floors available
                    </div>
                  )}

                  {isFetchingFloors && (
                    <div className="d-flex justify-content-center mt-3">
                      <Spinner animation="border" />
                    </div>
                  )}
                </div>
                <div className="booking-info-convention">
                  <div>
                    <span></span>Available
                  </div>
                  <div>
                    <span></span>Unavailable
                  </div>
                  <div>
                    <span></span>Reserved
                  </div>
                </div>
              </Col>

              <Col>
                <div className="contain-wrapper">
                  {currentFloor?._id ? (
                    <div className="floor-viewer-container">
                      {currentFloor?.rooms?.map((room) => {
                        return (
                          <div
                            className="room-container"
                            style={{
                              backgroundColor:
                                room?.bookStatus ||
                                (room.desks.filter((d) => d.bookStatus === true)
                                  .length > 0 &&
                                  room.desks.filter(
                                    (d) => d.bookStatus === false
                                  ).length === 0)
                                  ? "#5D5D5D"
                                  : "#d7e3ed",
                            }}
                          >
                            <div className="mb-2 d-flex align-items-center justify-content-between">
                              <div>
                                <p
                                  style={{
                                    color: room?.bookStatus ? "white" : "black",
                                  }}
                                >
                                  Room : {room?.roomNo}
                                </p>
                                <div className="amenities-wrapper">
                                  {room?.amenities?.map((item) => (
                                    <img
                                      className="amenities"
                                      alt="amenities"
                                      src={getIconBasedOnName(item)}
                                    ></img>
                                  ))}
                                </div>
                              </div>

                              <p
                                data-background-color={
                                  !room?.bookStatus ? "#273053" : "red"
                                }
                                data-tip={
                                  userMode === "user"
                                    ? !room?.bookStatus
                                      ? `click to book room ${room.roomNo}`
                                      : "click to cancel booking"
                                    : null
                                }
                              >
                                <button
                                  className={classNames("btn", {
                                    "btn-success": !room?.bookStatus,
                                    "btn-danger": room?.bookStatus,
                                  })}
                                  type="sm"
                                  onClick={() => {
                                    toggleBookingModal({
                                      roomId: room?._id,
                                      floorId: currentFloor?._id,
                                      companyId: cid,
                                      userMode,
                                      isCancel: room?.bookStatus,
                                      isRoom: true,
                                    });
                                  }}
                                >
                                  {" "}
                                  {getRoomBookStatus(room)}
                                  <ReactTooltip />
                                </button>
                              </p>
                            </div>
                            <div className="desk-container">
                              {room?.desks?.map((desk) => {
                                console.log(typeof desk?.bookedBy);
                                return (
                                  <div
                                    key={desk._id}
                                    data-background-color={
                                      !desk?.bookStatus ? "#273053" : "red"
                                    }
                                    data-tip={
                                      userMode === "user"
                                        ? !desk?.bookStatus
                                          ? `click to book desk ${desk.deskNo}`
                                          : "click to cancel booking"
                                        : null
                                    }
                                    onClick={() => {
                                      toggleBookingModal({
                                        deskId: desk?._id,
                                        roomId: room?._id,
                                        floorId: currentFloor?._id,
                                        companyId: cid,
                                        userMode,
                                        isCancel: desk?.bookStatus,
                                        isRoom: false,
                                      });
                                    }}
                                    className={classNames("desk", {
                                      "desk-active": !desk?.bookStatus,
                                      "desk-inactive":
                                        desk?.bookStatus &&
                                        desk?.bookedBy === userId,
                                      "desk-disabled":
                                        desk?.bookStatus &&
                                        desk?.bookedBy !== userId,
                                    })}
                                  >
                                    <ReactTooltip />
                                    {desk?.deskNo}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="empty-wrapper">
                      Click any floor to view the rooms
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <BookingModal
          Show={showModal}
          handleClose={closeModal}
          data={bookingPayload}
          refetchFloors={fetchCompanyFloors}
        />
      </Container>
    );
  };

  /**
   * Todo:: Remove this once properly tested
   * This is not in use anymore
   * @returns
   */

  return renderCompanyDetails();
}

export default CompanyInfo;
