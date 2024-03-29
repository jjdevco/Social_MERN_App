import React from "react";
import { Route, Redirect } from "react-router-dom";

//Store
import { connect } from "react-redux";

function AuthRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(AuthRoute);
