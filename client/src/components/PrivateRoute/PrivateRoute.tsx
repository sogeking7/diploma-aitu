import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext/AuthContext";
import { IonLoading } from "@ionic/react";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <IonLoading
              isOpen={true}
              message={"Please wait..."}
              spinner="circular"
            />
          );
        }

        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default PrivateRoute;
