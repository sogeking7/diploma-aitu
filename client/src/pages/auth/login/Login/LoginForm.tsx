import React from "react";
import {
  IonButton,
  IonItem,
  IonInput,
  IonText,
  IonInputPasswordToggle,
  IonLabel,
} from "@ionic/react";
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
  const { control, handleSubmit } = useForm<LoginFormValues>({
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

      <div>
        <IonItem>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <>
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
              </>
            )}
          />
        </IonItem>
      </div>

      <IonItem>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <IonInput
                label="Password"
                type="password"
                labelPlacement="stacked"
                value={field.value}
                onIonChange={(e) => field.onChange(e.detail.value!)}
                onIonBlur={field.onBlur}
                disabled={isLoading}
                errorText={fieldState.error?.message}
                className={`${fieldState.invalid && "ion-invalid"} ${fieldState.isTouched && "ion-touched"}`}
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </>
          )}
        />
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
