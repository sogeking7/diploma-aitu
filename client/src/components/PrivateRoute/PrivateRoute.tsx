import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext/AuthContext";

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (loading) {
                    return <div>Loading...</div>;
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
