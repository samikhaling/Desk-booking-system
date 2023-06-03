import React from "react";
import "./Header.css";

function Header({ currentUser }) {
  return (
    <nav className="main-header navbar navbar-expand  mr-1">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#" role="button">
            <i className="fas fa-user" /> {currentUser?.fname}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
