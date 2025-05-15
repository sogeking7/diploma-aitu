import React from "react";
import { IonButton, IonItem, IonInput, IonText } from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormValues,
  registerSchema,
} from "../../../../schemas/registerSchema";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => void;
  isLoading: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      role: "student",
      email: "",
      password: "",
      confirmPassword: "",
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
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <IonInput
              labelPlacement="floating"
              label="Name"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
            />
          )}
        />
        {errors.first_name && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin ion-padding-top">
              {errors.first_name.message}
            </p>
          </IonText>
        )}
      </IonItem>

      <IonItem>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <IonInput
              labelPlacement="floating"
              label="Last Name"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
            />
          )}
        />
        {errors.last_name && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin ion-padding-top">
              {errors.last_name.message}
            </p>
          </IonText>
        )}
      </IonItem>

      <IonItem>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <IonInput
              labelPlacement="floating"
              label="Email"
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
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <IonInput
              label="Password"
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

      <IonItem>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <IonInput
              label="Confirm Password"
              type="password"
              labelPlacement="floating"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
            />
          )}
        />
        {errors.confirmPassword && (
          <IonText color="danger" className="ion-padding-start">
            <p className="ion-no-margin ion-padding-top">
              {errors.confirmPassword.message}
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
        {isLoading ? "Registering..." : "Register"}
      </IonButton>

      <IonButton
        expand="block"
        fill="clear"
        routerLink="/login"
        className="ion-margin-top"
        disabled={isLoading}
      >
        Already have an account? Login
      </IonButton>
    </form>
  );
};

export default RegisterForm;
