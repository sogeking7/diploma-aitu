import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { UserCreate, UsersService } from '../../../../../lib/open-api';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzButtonModule, NzGridModule, NzCardModule, NzIconModule],
  styleUrls: ['./users-create.component.css'],
  templateUrl: './users-create.component.html',
})
export class UsersCreateComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;

  // Password visibility flags
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        first_name: [null, [Validators.required]],
        last_name: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirm_password: [null, [Validators.required]],
        role: [null, [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  submitForm(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      // Create a copy of the form value without the confirm_password field
      const formData = { ...this.userForm.value };
      delete formData.confirm_password;

      const userData: UserCreate = formData;

      this.usersService.createUser(userData).subscribe({
        next: () => {
          this.notification.success('Success', 'User has been created successfully!');
          this.router.navigate(['/users'], { relativeTo: this.router.routerState.root });
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.message || 'Failed to create user. Please try again.');
        },
      });
    } else {
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelCreate(): void {
    this.router.navigate(['/users'], { relativeTo: this.router.routerState.root });
  }

  goBack(): void {
    this.router.navigate(['/users'], { relativeTo: this.router.routerState.root });
  }
}
