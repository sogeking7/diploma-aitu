import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { triangle, ellipse, personCircle } from "ionicons/icons";
import { Switch, Route, Redirect } from "react-router-dom";
import Profile from "../../pages/profile/Profile/Profile";
import Tab2 from "../../pages/Tab2";
import Tab1 from "../../pages/Tab1";

const MainTabs: React.FC = () => (
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
        <IonIcon icon={triangle} />
        <IonLabel>Tab 1</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tab2">
        <IonIcon icon={ellipse} />
        <IonLabel>Tab 2</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        <IonIcon icon={personCircle} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default MainTabs;
