import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, personCircle, triangle } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.css";
import "./theme/variables.css";

import { AuthProvider, useAuth } from "./contexts/AuthContext/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./pages/auth/login/Login/Login";
import Register from "./pages/auth/register/Register/Register";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Profile from "./pages/profile/Profile/Profile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

setupIonicReact();

const AuthRoutes: React.FC = () => (
  <Switch>
    <Route path="/login" exact component={Login} />
    <Route path="/register" exact component={Register} />
    <Route path="*">
      <Redirect to="/login" />
    </Route>
  </Switch>
);

const AppRoutes: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Switch>
        <Route path="/tab1" exact component={Tab1} />
        <Route path="/tab2" exact component={Tab2} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/" exact>
          <Redirect to="/profile" />
        </Route>
        <Route path="*">
          <Redirect to="/profile" />
        </Route>
      </Switch>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/tab1">
        <IonIcon aria-hidden="true" icon={triangle} />
        <IonLabel>Tab 1</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tab2">
        <IonIcon aria-hidden="true" icon={ellipse} />
        <IonLabel>Tab 2</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        <IonIcon aria-hidden="true" icon={personCircle} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {isAuthenticated ? (
          <PrivateRoute component={AppRoutes} />
        ) : (
          <AuthRoutes />
        )}
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <IonApp>
        <AppRouter />
      </IonApp>
    </AuthProvider>
    {process.env.NODE_ENV !== "production" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
  </QueryClientProvider>
);

export default App;
