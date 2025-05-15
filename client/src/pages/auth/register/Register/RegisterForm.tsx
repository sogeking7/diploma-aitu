import React from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonText,
  IonInputPasswordToggle,
} from "@ionic/react";
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
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
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
          render={({ field, fieldState }) => (
            <IonInput
              labelPlacement="stacked"
              label="Name"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
              onIonBlur={field.onBlur}
              errorText={fieldState.error?.message}
              className={`${fieldState.invalid && "ion-invalid"} ${fieldState.isTouched && "ion-touched"}`}
            />
          )}
        />
      </IonItem>

      <IonItem>
        <Controller
          name="last_name"
          control={control}
          render={({ field, fieldState }) => (
            <IonInput
              labelPlacement="stacked"
              label="Last Name"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
              onIonBlur={field.onBlur}
              errorText={fieldState.error?.message}
              className={`${fieldState.invalid && "ion-invalid"} ${fieldState.isTouched && "ion-touched"}`}
            />
          )}
        />
      </IonItem>

      <IonItem>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <IonInput
              labelPlacement="stacked"
              label="Email"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              onIonBlur={field.onBlur}
              disabled={isLoading}
              errorText={fieldState.error?.message}
              className={`${fieldState.invalid && "ion-invalid"} ${fieldState.isTouched && "ion-touched"}`}
            />
          )}
        />
      </IonItem>

      <IonItem>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <IonInput
              label="Password"
              type="password"
              labelPlacement="stacked"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
              onIonBlur={field.onBlur}
              errorText={fieldState.error?.message}
              className={`${fieldState.invalid && "ion-invalid"} ${fieldState.isTouched && "ion-touched"}`}
            >
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
            </IonInput>
          )}
        />
      </IonItem>

      <IonItem>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <IonInput
              label="Confirm Password"
              type="password"
              labelPlacement="stacked"
              value={field.value}
              onIonChange={(e) => field.onChange(e.detail.value!)}
              disabled={isLoading}
              onIonBlur={field.onBlur}
              errorText={fieldState.error?.message}
              className={`${fieldState.invalid && "ion-invalid"} ${fieldState.isTouched && "ion-touched"}`}
            >
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
            </IonInput>
          )}
        />
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
