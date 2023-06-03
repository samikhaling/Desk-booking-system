import React from "react";

export default function Avatar({ initial = "NA", name }) {
  return (
    <div className="avatar-wrapper">
      <div className="avatar">{initial}</div>
      {name}
    </div>
  );
}
