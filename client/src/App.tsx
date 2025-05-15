import React, { ReactNode } from "react";
import { IonApp, IonLoading, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Switch, Route, Redirect } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, useAuth } from "./contexts/AuthContext/AuthContext";
import MainTabs from "./components/MainTabs/MainTabs";
import Register from "./pages/auth/register/Register/Register";
import Login from "./pages/auth/login/Login/Login";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <>{children}</> : <Redirect to="/login" />;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Redirect to="/profile" /> : children;
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <Switch>
            <Route
              path="/login"
              exact
              render={() => (
                <PublicRoute>
                  <Login />
                </PublicRoute>
              )}
            />
            <Route
              path="/register"
              exact
              render={() => (
                <PublicRoute>
                  <Register />
                </PublicRoute>
              )}
            />
            <Route
              path="/*"
              render={() => (
                <PrivateRoute>
                  <MainTabs />
                </PrivateRoute>
              )}
            />
          </Switch>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
    {process.env.NODE_ENV !== "production" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default App;
