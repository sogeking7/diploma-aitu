import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { UserOut, UserUpdate, UsersService } from '../../../../../lib/open-api';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzSpinModule,
    NzIconModule,
    RouterModule,
    NzTypographyComponent,
  ],
})
export class UsersEditComponent implements OnInit {
  userId: number | null = null;
  user: UserOut | null = null;
  editForm: FormGroup | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private usersService: UsersService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Get the user ID from the route params
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.loadUserData();
      } else {
        this.notification.error('Error', 'User ID is missing');
        this.router.navigate(['/admin/users']);
      }
    });
  }

  private loadUserData(): void {
    if (!this.userId) {
      return;
    }

    this.usersService.readUser(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.initForm(user);
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load user data');
        this.router.navigate(['/admin/users']);
      },
    });
  }

  private initForm(user: UserOut): void {
    this.editForm = this.fb.group({
      first_name: [user.first_name, [Validators.required]],
      last_name: [user.last_name, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      role: [user.role, [Validators.required]],
    });
  }

  updateUser(): void {
    if (!this.editForm || !this.userId) {
      return;
    }

    if (this.editForm.valid) {
      this.isSubmitting = true;
      const userData: UserUpdate = this.editForm.value;

      this.usersService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notification.success('Success', 'User has been updated successfully!');
          this.router.navigate(['/users']);
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.detail || 'Failed to update user. Please try again.');
        },
      });
    } else {
      Object.values(this.editForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
