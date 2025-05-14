import React from "react";
import { IonButton, IonItem, IonLabel, IonInput, IonText } from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "../../../../schemas/loginSchema";

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
  isLoading: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <IonText color="danger">
          <p>{error}</p>
        </IonText>
      )}

      <IonItem>
        <IonLabel position="floating">Email</IonLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <IonInput
              labelPlacement="floating"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
            />
          )}
        />
        {errors.email && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin ion-padding-top">
              {errors.email.message}
            </p>
          </IonText>
        )}
      </IonItem>

      <IonItem>
        <IonLabel position="floating">Password</IonLabel>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <IonInput
              type="password"
              labelPlacement="floating"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
            />
          )}
        />
        {errors.password && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin ion-padding-top">
              {errors.password.message}
            </p>
          </IonText>
        )}
      </IonItem>

      <IonButton
        expand="block"
        type="submit"
        className="ion-margin-top"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </IonButton>

      <IonButton
        expand="block"
        fill="clear"
        routerLink="/register"
        className="ion-margin-top"
        disabled={isLoading}
      >
        Create account
      </IonButton>
    </form>
  );
};

export default LoginForm;
