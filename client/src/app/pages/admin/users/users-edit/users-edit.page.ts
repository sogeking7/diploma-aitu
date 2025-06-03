import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { UserOut, UsersService, RoleEnum } from '../../../../../lib/open-api';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.page.html',
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
export class UsersEditPage implements OnInit {
  user?: UserOut;

  editForm = new FormGroup({
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.email]),
    role: new FormControl<RoleEnum | null>(null, [Validators.required]),
    password: new FormControl<string | null>(null, [Validators.minLength(8)]),
  });
  isLoading = {
    user: false,
    save: false,
  };
  isEdit = false;

  passwordVisible = false;
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      await this.loadUser(Number(id));
    }
  }

  private async loadUser(userId: number) {
    this.isLoading.user = true;
    try {
      this.user = await firstValueFrom(this.usersService.readUser(userId));
      this.editForm.patchValue({
        firstName: this.user.first_name,
        lastName: this.user.last_name,
        email: this.user.email,
        role: this.user.role,
      });
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to load user');
      await this.router.navigate(['/users']);
    } finally {
      this.isLoading.user = false;
    }
  }

  async saveUser() {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (!this.editForm.valid) {
      return;
    }

    const formModel = this.editForm.value;

    if (!this.user) {
      if (!formModel.password || !formModel.email) {
        throw new Error('required.fields');
      }
    } else {
      if (!formModel.firstName || !formModel.lastName || !formModel.role) {
        throw new Error('required.fields');
      }
    }

    this.isLoading.save = true;
    try {
      if (this.user) {
        await firstValueFrom(
          this.usersService.updateUser(this.user.id, {
            first_name: formModel.firstName!,
            last_name: formModel.lastName!,
            email: formModel.email!,
            role: formModel.role!,
          })
        );
      } else {
        await firstValueFrom(
          this.usersService.createUser({
            first_name: formModel.firstName!,
            last_name: formModel.lastName!,
            email: formModel.email!,
            password: formModel.password!,
            role: formModel.role!,
          })
        );
      }

      this.notification.success('Success', 'User has been saved successfully!');
      this.router.navigate(['/users']);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.description || 'Failed to save user');
    } finally {
      this.isLoading.save = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
