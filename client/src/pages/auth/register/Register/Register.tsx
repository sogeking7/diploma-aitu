import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../../contexts/AuthContext/AuthContext";
import { RegisterFormValues } from "../../../../schemas/registerSchema";
import RegisterForm from "./RegisterForm";
import { RoleEnum } from "../../../../lib/open-api";

const Register: React.FC = () => {
  const { register } = useAuth();
  const history = useHistory();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => {
      return register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        role: data.role as RoleEnum,
      });
    },
    onSuccess: () => {
      history.replace("/login");
    },
  });

  const handleSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={registerMutation.isPending} />

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={registerMutation.isPending}
          error={
            registerMutation.isError
              ? "Failed to register. Please check your information."
              : undefined
          }
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
