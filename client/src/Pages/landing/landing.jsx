import React, { useState, useEffect } from "react";

import Navbar from "../../Components/UI/navbar/navbar";
import video from "../../Assets/Images/view.mp4";
import { useFormik } from "formik";
import { handleUserMessage, getNewWorkspace } from "../../services/auth";
import image1 from "../../Assets/Images/schedule/business-woman-making-presentation-office.jpg";
import image2 from "../../Assets/Images/schedule/clayton-cardinalli-JMoFpdqL3XM-unsplash.jpg";
import { GoLocation } from "react-icons/go";
import { toast } from "react-toastify";
import Avatar from "../../Components/UI/avatar/avatar";
import nameInitials from "name-initials";

function LandingPage() {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await getNewWorkspace();
      setCompanies(response?.result);
    } catch (e) {
      toast.error(e);
      throw new Error(e);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = await handleUserMessage(values);
        console.log(data);
        if (!data) {
          throw new Error("Message can't be send");
        }
        resetForm({ values: "" });
        toast("Message Sent Successfully");
        window.scrollTo(0, 0);
      } catch (e) {
        toast.error(e);
        console.log("error", e);
      }
    },
  });
  return (
    <div>
      <Navbar />
      <main>
        <section class="hero" id="section_1">
          <div class="container">
            <div class="row">
              <div>
                <div class="hero-text">
                  <h2 class="text-white ">Book your Workspace </h2>
                  <p class="text-white mb-4">Work from anywhere </p>

                  <a
                    href="#workspace"
                    class="custom-link bi-arrow-down arrow-icon"
                  ></a>
                </div>
              </div>
            </div>
          </div>

          <div class="video-wrap">
            <video autoPlay loop muted="" class="custom-video" poster="">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        <section class="schedule section-padding" id="workspace">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-12">
                <h2 class="mb-5 text-center">
                  New <u class="text-info">Workspace</u>
                </h2>

                <div class="tab-content mt-5" id="nav-tabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nav-DayOne"
                    role="tabpanel"
                    aria-labelledby="nav-DayOne-tab"
                  >
                    {companies
                      ?.reverse()
                      .splice(0, 2)
                      .map((c, index) => {
                        return (
                          <div key={c._id} class="row border-bottom pb-5 mb-5">
                            <div class="col-lg-4 col-12">
                              <img
                                src={index === 0 ? image1 : image2}
                                class="schedule-image img-fluid"
                                alt=""
                              />
                            </div>

                            <div class="col-lg-8 col-12 mt-3 mt-lg-0">
                              <h4 class="mb-2">{c.companyName}</h4>

                              <p>
                                Activity based working or flexible working are
                                becoming increasingly popular ways of working in
                                the modern workplace. Hence the need of bookable
                                workspaces has skyrocketed. Desk Booking System
                                enables easy management and scheduling of
                                physical desks and other workspaces in your
                                office – either on site or on your phone.
                              </p>

                              <div class="d-flex align-items-center mt-4">
                                <div class="avatar-group d-flex">
                                  <Avatar
                                    initial={nameInitials(
                                      `${c.companyOwner?.fname} ${c.companyOwner.lname}`
                                    )}
                                  />

                                  <div class="ms-3">
                                    {c.companyOwner.fname}{" "}
                                    {c.companyOwner.lname}
                                    <p class="speakers-text mb-0">
                                      CEO / Founder
                                    </p>
                                  </div>
                                </div>

                                <span class="mx-3 mx-lg-5">
                                  <GoLocation
                                    style={{
                                      marginBottom: "3px",
                                      marginRight: "3px",
                                    }}
                                  />
                                  {c.address.country}
                                </span>

                                <span class="mx-1 mx-lg-5">
                                  <i
                                    class="fa fa-phone me-2"
                                    aria-hidden="true"
                                  ></i>
                                  {c.contactNumber}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="call-to-action section-padding">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-7 col-12">
                <h2 class="text-white mb-4">
                  Want to <u class="text-info">resister your workspace?</u>
                </h2>

                <p class="text-white">
                  Build your dream office with Us. The perfect booking platform
                  for your floors, rooms, desks, and more.
                </p>
              </div>

              <div class="col-lg-3 col-12 ms-lg-auto mt-4 mt-lg-0">
                <a href="/signup" class="custom-btn btn">
                  Register Today
                </a>
              </div>
            </div>
          </div>
        </section>

        <section class="venue section-padding" id="about">
          <div class="container">
            <div class="row">
              <div class="col-lg-12 col-12">
                <h2 class="mb-5">
                  Visit to our <u class="text-info">office</u>
                </h2>
              </div>

              <div class="col-lg-6 col-12">
                <iframe
                  title="map"
                  class="google-map"
                  src="https://maps.google.com/maps?q=61%20hullrick%20drive,%20Etobicoke,%20Ontario,%20Canada&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="371.59"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              <div class="col-lg-6 col-12 mt-5 mt-lg-0">
                <div class="venue-thumb bg-white shadow-lg">
                  <div class="venue-info-title">
                    <h2 class="text-white mb-0">61 Hillrick Dr</h2>
                  </div>

                  <div class="venue-info-body">
                    <h4 class="d-flex">
                      <i class="bi-geo-alt me-2"></i>
                      <span>61 hullrick drive, Etobicoke, Ontario, Canada</span>
                    </h4>

                    <h5 class="mt-4 mb-3">
                      <a href="mailto:hello@yourgmail.com">
                        <i class="bi-envelope me-2"></i>
                        bookyourdesk2022@gmail.com
                      </a>
                    </h5>

                    <h5 class="mb-0">
                      <a href="tel: 305-240-9671">
                        <i class="bi-telephone me-2"></i>
                        010-020-0340
                      </a>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="contact section-padding" id="contact-section">
          <div class="container">
            <div class="row">
              <div class="col-lg-8 col-12 mx-auto">
                <form
                  class="custom-form contact-form bg-white shadow-lg"
                  onSubmit={formik.handleSubmit}
                >
                  <h2>Please Say Hi</h2>

                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-12">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        class="form-control"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        placeholder="Name"
                        required=""
                      />
                    </div>

                    <div class="col-lg-4 col-md-4 col-12">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        pattern="[^ @]*@[^ @]*"
                        class="form-control"
                        placeholder="Email"
                        required=""
                      />
                    </div>

                    <div class="col-lg-4 col-md-4 col-12">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        class="form-control"
                        placeholder="Subject"
                      />
                    </div>

                    <div class="col-12">
                      <textarea
                        class="form-control"
                        rows="5"
                        id="message"
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        placeholder="Message"
                      ></textarea>

                      <button type="submit" class="form-control">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
