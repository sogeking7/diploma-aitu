import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  useIonRouter,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../../contexts/AuthContext/AuthContext";
import { LoginFormValues } from "../../../../schemas/loginSchema";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
  const { login, fetchUser } = useAuth();
  const router = useIonRouter();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => {
      return login({ email: data.email, password: data.password });
    },
    onSuccess: async () => {
      await fetchUser();
      router.push("/profile");
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
