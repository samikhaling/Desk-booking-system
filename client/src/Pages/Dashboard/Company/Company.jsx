import React, { useState, useEffect } from "react";

import { MdDelete, MdMoreVert, MdEdit, MdEventAvailable } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { AiFillSetting } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { getAllCompanies, deleteCompany } from "../../../services/company";
import { ROUTES } from "../../../helper/routes";
import { toast } from "react-toastify";
import Modal from "../../../Components/UI/Modal/AddFloor/AddModal";
import Form from "react-bootstrap/Form";
import nameInitials from "name-initials";
import Avatar from "../../../Components/UI/avatar/avatar";
import { _getSecureLs } from "../../../helper/storage";
import * as actions from "../../../store/action/index";
import { connect } from "react-redux";
import { CustomToggle } from "../../../Components/UI/Dropdown/DropdownMenu";

function Company(props) {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const userMode = _getSecureLs("auth")?.mode;
  const [query, setQuery] = useState("");

  const fetchCompanies = async () => {
    try {
      const response = await getAllCompanies();
      setCompanies(response?.result);
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const handledeleteCompany = async (cid) => {
    try {
      const data = await deleteCompany(cid);
      if (!data) {
        const error = new Error("failed to delete company");
        throw error;
      }
      const updatedCompanies = companies?.filter(
        (c) => c._id.toString() !== cid.toString()
      );
      setCompanies(updatedCompanies);
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    }
  };

  const handleEditCompany = (cid, company) => {
    props.onInitEditing();
    props.onEditing(company);
    navigate(`/${ROUTES.COMPANY}/${ROUTES.CREATE_COMPANY}`);
  };

  const handleAddFloor = (company) => {
    props.onEditing(company);
    setShowModal(true);
  };

  return (
    <div>
      <div className="content-header d-flex justify-content-between align-items-center">
        <h1 className="m-0">Workspace</h1>
        {userMode === "company" && (
          <Button
            variant="primary"
            className="my-3"
            onClick={() => navigate(ROUTES.CREATE_COMPANY)}
          >
            <i className="fa fa-plus"></i>
            {""} Create your own workspace
          </Button>
        )}
        {userMode === "user" && (
          <div>
            <Form.Group controlId="formBasicSearch">
              <Form.Label>Search Workspace:</Form.Label>
              <Form.Control
                className="col-7"
                style={{ display: "inline-block", position: "relative" }}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Searcy by country"
              />
              {query.length > 0 && (
                <IoMdClose
                  onClick={() => setQuery("")}
                  style={{
                    position: "absolute",
                    right: "28px",
                    top: "22px",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                  }}
                />
              )}
            </Form.Group>
          </div>
        )}
      </div>

      <table className="table">
        <thead>
          <th>S.N</th>
          <th>Workspace</th>
          {/* <th>Available Space</th> */}
          <th>Created by</th>
          {userMode === "company" && <th>Created on</th>}
          {userMode === "user" && <th>Available Space</th>}
          <th>Address</th>
          {/* {userMode === "company" && <th>Actions</th>} */}
        </thead>
        <tbody>
          {companies
            ?.filter((c) => c.address.country?.toLowerCase().includes(query))
            .map((company, _idx) => (
              <tr key={company._id}>
                <td>{_idx + 1}</td>
                <td>
                  {" "}
                  <a
                    href={`${ROUTES.COMPANY}/${ROUTES.COMPANY_INFO}/${company?._id}`}
                  >
                    {company?.companyName || ""}
                  </a>{" "}
                </td>
                {/* <td>0/5</td> */}
                <td>
                  <Avatar
                    initial={nameInitials(
                      `${company?.companyOwner?.fname} ${company?.companyOwner?.lname}`
                    )}
                    name={`${company?.companyOwner?.fname} ${company?.companyOwner?.lname}`}
                  />
                </td>
                {userMode === "company" && (
                  <td>
                    {new Date(company?.createdAt).toLocaleDateString("en-US")}
                  </td>
                )}
                {userMode === "user" && (
                  <td>
                    {company.floors
                      .map((f) =>
                        f.rooms
                          .map(
                            (r) =>
                              r.desks.filter((d) => d.bookStatus === false)
                                .length
                          )
                          .reduce(
                            (previousValue, currentValue) =>
                              previousValue + currentValue,
                            0
                          )
                      )
                      .reduce(
                        (previousValue, currentValue) =>
                          previousValue + currentValue,
                        0
                      )}
                    /
                    {company.floors
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
                        (previousValue, currentValue) =>
                          previousValue + currentValue,
                        0
                      )}
                  </td>
                )}
                <td>{`${company?.address?.street}, ${company?.address?.country}`}</td>
                {/* {userMode === "company" && (
                <>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handledeleteCompany(company?._id)}
                    >
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </td>
                </>
              )} */}

                <td>
                  <Dropdown>
                    <Dropdown.Toggle
                      as={CustomToggle}
                      id="dropdown-custom-components"
                    >
                      <MdMoreVert />
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ marginBottom: "0 !important" }}>
                      {userMode === "company" ? (
                        <>
                          <Dropdown.Item
                            as="button"
                            eventKey="1"
                            onClick={() => {
                              props.onSelectCompany(company);
                              navigate(
                                `${ROUTES.COMPANY_INFO}/${company?._id}`
                              );
                            }}
                          >
                            <div className="d-flex align-items-center text-primary">
                              <TbListDetails className="mr-2" />{" "}
                              <span style={{ marginTop: "1px" }}>
                                View Details
                              </span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            eventKey="2"
                            onClick={() => handleAddFloor(company)}
                          >
                            <div className="d-flex align-items-center text-primary">
                              <AiFillSetting className="mr-2" />{" "}
                              <span style={{ marginTop: "1px" }}>
                                Manage Floor
                              </span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item as="button" eventKey="3">
                            <div
                              className="d-flex align-items-center text-primary"
                              onClick={() =>
                                handleEditCompany(company?._id, company)
                              }
                            >
                              <MdEdit className="mr-2" />{" "}
                              <span style={{ marginTop: "2px" }}>Edit</span>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item as="button" eventKey="3">
                            <div
                              className="d-flex align-items-center text-danger"
                              onClick={() => handledeleteCompany(company?._id)}
                            >
                              <MdDelete className="mr-2" />{" "}
                              <span style={{ marginTop: "2px" }}>Delete</span>
                            </div>
                          </Dropdown.Item>
                        </>
                      ) : (
                        <>
                          <Dropdown.Item
                            as="button"
                            eventKey="1"
                            onClick={() => {
                              props.onSelectCompany(company);
                              navigate(
                                `${ROUTES.COMPANY_INFO}/${company?._id}`
                              );
                            }}
                          >
                            <div className="d-flex align-items-center text-primary">
                              <MdEventAvailable className="mr-2" />{" "}
                              <span>See Availability</span>
                            </div>
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        Show={showModal}
        handleClose={closeModal}
        companyId={props.selectCompany?._id}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedCompany: state.selectedCompany,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitEditing: () => dispatch(actions.editCompany()),
    onEditing: (company) => dispatch(actions.selectCompany(company)),
    onSelectCompany: (company) => dispatch(actions.selectCompany(company)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Company);
