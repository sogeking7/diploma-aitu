import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/auth.service';
import { UserOut, UsersService } from '../../../../lib/open-api';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzAvatarModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: UserOut | null = null;
  editForm!: FormGroup;

  constructor(
    private authenticateService: AuthenticationService,
    private usersService: UsersService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.user = this.authenticateService.user;
  }

  ngOnInit(): void {
    this.initEditForm();
  }

  private initEditForm(): void {
    this.editForm = this.fb.group({
      first_name: [this.user?.first_name, [Validators.required]],
      last_name: [this.user?.last_name, [Validators.required]],
      email: [this.user?.email, [Validators.required, Validators.email]],
      role: [this.user?.role, [Validators.required]],
    });
  }

  showEditModal(): void {
    this.modal.create({
      nzTitle: 'Edit Profile',
      nzContent: `
        <form nz-form [formGroup]="editForm" nzLayout="vertical">
          <nz-form-item>
            <nz-form-label nzRequired>First Name</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="first_name" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzRequired>Last Name</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="last_name" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzRequired>Email</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="email" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzRequired>Role</nz-form-label>
            <nz-form-control>
              <nz-select formControlName="role">
                <nz-option nzValue="ADMIN" nzLabel="Admin"></nz-option>
                <nz-option nzValue="TEACHER" nzLabel="Teacher"></nz-option>
                <nz-option nzValue="STUDENT" nzLabel="Student"></nz-option>
                <nz-option nzValue="PARENT" nzLabel="Parent"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </form>
      `,
      nzOnOk: () => {
        if (this.editForm.valid && this.user) {
          this.usersService.updateUser(this.user.id, this.editForm.value).subscribe({
            next: updatedUser => {
              this.user = updatedUser;
              this.authenticateService.user = updatedUser;
              this.message.success('Profile updated successfully');
            },
            error: error => {
              this.message.error('Failed to update profile');
              console.error('Update error:', error);
            },
          });
        }
      },
    });
  }

  showChangePasswordModal(): void {
    this.modal.create({
      nzTitle: 'Change Password',
      nzContent: 'Password change functionality will be implemented here',
      nzOnOk: () => {
        this.message.info('Password change functionality coming soon');
      },
    });
  }
}
