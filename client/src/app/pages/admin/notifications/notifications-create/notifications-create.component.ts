import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { NotificationCreate, NotificationsService } from '../../../../../lib/open-api';

@Component({
  selector: 'app-notifications-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzButtonModule, NzGridModule, NzCardModule, NzIconModule],
  templateUrl: './notifications-create.component.html',
  styleUrl: './notifications-create.component.css',
})
export class NotificationsCreateComponent implements OnInit {
  notificationForm!: FormGroup;
  isSubmitting = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.notificationForm = this.fb.group({
      user_id: [null, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)]],
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      body: [null],
    });
  }

  submitForm(): void {
    if (this.notificationForm.valid) {
      this.isSubmitting = true;

      const notificationData: NotificationCreate = this.notificationForm.value;

      this.notificationsService.sendNotification(notificationData).subscribe({
        next: () => {
          this.notification.success('Success', 'Notification has been created successfully!');
          this.router.navigate(['/notifications'], { relativeTo: this.router.routerState.root });
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.message || 'Failed to create notification. Please try again.');
        },
      });
    } else {
      Object.values(this.notificationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelCreate(): void {
    this.router.navigate(['/notifications'], { relativeTo: this.router.routerState.root });
  }

  goBack(): void {
    this.router.navigate(['/notifications'], { relativeTo: this.router.routerState.root });
  }
}
