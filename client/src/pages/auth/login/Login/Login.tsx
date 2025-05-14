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
import { LoginFormValues } from "../../../../schemas/loginSchema";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => {
      return login({ email: data.email, password: data.password });
    },
    onSuccess: () => {
      history.replace("/dashboard");
    },
  });

  const handleSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loginMutation.isPending} />

        <LoginForm
          onSubmit={handleSubmit}
          isLoading={loginMutation.isPending}
          error={
            loginMutation.isError
              ? "Failed to login. Please check your credentials."
              : undefined
          }
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
