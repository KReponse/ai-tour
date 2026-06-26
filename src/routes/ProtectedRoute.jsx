import React from "react";

import {
  Navigate,
} from "react-router-dom";


const ProtectedRoute = ({
  children,
  allowedRoles,
  requireApproval = false,
}) => {


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );



  // =========================
  // NOT LOGGED IN
  // =========================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }




  // =========================
  // ROLE CHECK
  // =========================

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate
        to="/"
        replace
      />

    );

  }




  // =========================
  // PROVIDER APPROVAL CHECK
  // =========================

  if (

    allowedRoles?.includes(
      "provider"
    )

    &&

    user.role === "provider"

    &&

    user.verificationStatus !== "approved"

  ) {


    return (

      <Navigate

        to="/provider/pending"

        replace

      />

    );

  }





  // =========================
  // TRAVELER TRYING PROVIDER AREA
  // =========================

  if (

    allowedRoles?.includes(
      "provider"
    )

    &&

    user.role !== "provider"

  ) {


    return (

      <Navigate

        to="/provider/request"

        replace

      />

    );

  }





  return children;


};


export default ProtectedRoute;