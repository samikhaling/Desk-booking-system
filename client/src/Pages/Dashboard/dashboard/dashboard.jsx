import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Avatar from "../../../Components/UI/avatar/avatar";
import { getAllCompanies } from "../../../services/company";
import { getCurrentUserId, _getSecureLs } from "../../../helper/storage";
import { toast } from "react-toastify";

import { Calendar } from "react-date-range";

import nameInitials from "name-initials";
import { getTotalRoomsBookedByUser } from "../../../helper/misc";
import { Card, Table } from "react-bootstrap";

export default function DashboardHome() {
  const userMode = _getSecureLs("auth")?.mode;
  const userId = getCurrentUserId();
  const [currentUser] = useOutletContext();
  const [totalWorkspace, setTotalWorkspace] = useState(0);
  const [totalFloors, setTotalFloors] = useState(0);
  const [totalDesks, setTotalDesks] = useState(0);
  const [userBookInfo, setUserBookInfo] = useState({});

  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      console.log(response?.result);
      setTotalWorkspace(response?.result.length);
      const total = response?.result
        .map((f) => f.floors.length)
        .reduce(
          (previousValue, currentValue) => previousValue + currentValue,
          0
        );
      setTotalFloors(total);
      setTotalDesks(
        response?.result
          .map((c) =>
            c.floors
              .map((f) =>
                f.rooms
                  .map((d) => d.desks.length)
                  .reduce(
                    (previousValue, currentValue) =>
                      previousValue + currentValue,
                    0
                  )
              )
              .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0
              )
          )
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          )
      );

      const data = getTotalRoomsBookedByUser({
        userId,
        companies: response?.result,
      });

      setUserBookInfo(data);
    } catch (e) {
      toast.error(e);
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  console.log(userBookInfo);

  return (
    <>
      <div>
        <div>
          <div className="mb-3">
            Welcome,{" "}
            <div className="d-flex align-items-center">
              <Avatar
                initial={nameInitials(
                  `${currentUser?.fname}${currentUser?.lname}`
                )}
              />
              <h4 className="ml-2">
                {currentUser?.fname} {currentUser?.lname}!
              </h4>
            </div>
          </div>
          <div className="dashboard-wrapper">
            <div className="info-box">
              <span className="info-box-icon bg-info">
                <i class="fas fa-bookmark"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Total Floors</span>
                <span className="info-box-number">{totalFloors}</span>
              </div>
            </div>
            <div className="info-box ">
              <span className="info-box-icon bg-warning">
                <i class="fas fa-building"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">
                  {userMode === "user" ? "Total Workspace" : "Your Workspace"}
                </span>
                <span className="info-box-number">{totalWorkspace}</span>
              </div>
            </div>
            <div className="info-box ">
              <span className="info-box-icon bg-success">
                <i class="fa fa-desktop"></i>
              </span>
              <div className="info-box-content">
                <span className="info-box-text">Total Desk</span>
                <span className="info-box-number">{totalDesks}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-start gap-2">
          <Card className="w-100">
            <Card.Body>
              <h6>Your active booking</h6>
              <Table bordered hover>
                <thead>
                  <th>Company</th>
                  <th>Room no</th>
                </thead>
                <tbody>
                  {userBookInfo?.totalRoomBooked === 0 && (
                    <div>You don't any active booking</div>
                  )}
                  {userBookInfo?.roomsBookedByUser?.map((item) => {
                    return (
                      <tr>
                        <td>{item?.companyName}</td>
                        <td>{item?.roomNo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Calendar />
        </div>
      </div>
    </>
  );
}
