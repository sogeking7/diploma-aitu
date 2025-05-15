import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
} from "@ionic/react";
import { personCircle, mail, school } from "ionicons/icons";
import { useAuth } from "../../../contexts/AuthContext/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardContent>Please login to view your profile</IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonAvatar
              style={{ margin: "0 auto", width: "100px", height: "100px" }}
            >
              <IonIcon
                icon={personCircle}
                style={{ width: "100%", height: "100%" }}
              />
            </IonAvatar>
            <IonCardTitle className="ion-padding-top">
              {user.first_name} {user.last_name}
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonItem lines="full">
              <IonIcon icon={mail} slot="start" />
              <IonLabel>
                <h2>Email</h2>
                <p>{user.email}</p>
              </IonLabel>
            </IonItem>

            <IonItem lines="full">
              <IonIcon icon={school} slot="start" />
              <IonLabel>
                <h2>Role</h2>
                <p>{user.role}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
