import React from 'react';

import {
  Navigate,
} from 'react-router-dom';

const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {

  const user =
    JSON.parse(
      localStorage.getItem(
        'user'
      )
    );

  /* NOT LOGGED IN */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  /* ROLE CHECK */

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

  return children;
};

export default ProtectedRoute;