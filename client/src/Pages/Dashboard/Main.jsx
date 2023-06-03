import React from "react";
import { Outlet } from "react-router-dom";

function Main({ currentUser }) {
  return (
    <div className="content-wrapper">
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col m-3">
              <Outlet context={[currentUser]} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
