import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { ClassesService, ClassOut, ClassUpdate, UsersService, UserOut } from '../../../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-classes-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzSpinModule,
    NzIconModule,
    NzTypographyComponent,
    NgForOf,
  ],
  templateUrl: './classes-edit.component.html',
  styleUrl: './classes-edit.component.css',
})
export class ClassesEditComponent implements OnInit {
  classId: number | null = null;
  classData: ClassOut | null = null;
  isLoading = true;
  isSaving = false;
  editForm!: FormGroup;
  teachers: UserOut[] = [];
  isLoadingTeachers = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private classesService: ClassesService,
    private usersService: UsersService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.classId = +idParam;
        this.loadClassData();
        this.loadTeachers();
      } else {
        this.notification.error('Error', 'Class ID is missing');
        this.router.navigate(['/classes']);
      }
    });
  }

  private createForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      teacher_user_id: [null, [Validators.required]],
    });
  }

  private loadClassData(): void {
    if (!this.classId) {
      return;
    }

    this.isLoading = true;
    this.classesService.readClass(this.classId).subscribe({
      next: data => {
        this.classData = data;
        this.updateForm(data);
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load class data');
        this.router.navigate(['/classes']);
      },
    });
  }

  private loadTeachers(): void {
    this.isLoadingTeachers = true;
    this.usersService.readUsers('teacher', undefined, 1, 100).subscribe({
      next: response => {
        this.teachers = response.items;
        this.isLoadingTeachers = false;
      },
      error: error => {
        this.isLoadingTeachers = false;
        this.notification.error('Error', error.error?.detail || 'Failed to load teachers');
      },
    });
  }

  private updateForm(data: ClassOut): void {
    this.editForm.patchValue({
      name: data.name,
      teacher_user_id: data.teacher_user_id,
    });
  }

  submitForm(): void {
    if (this.editForm.invalid) {
      Object.values(this.editForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
      return;
    }

    if (!this.classId) {
      return;
    }

    this.isSaving = true;
    const updateData: ClassUpdate = this.editForm.value;

    this.classesService.updateClass(this.classId, updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.notification.success('Success', 'Class updated successfully');
        this.router.navigate(['/classes/', this.classId]);
      },
      error: error => {
        this.isSaving = false;
        this.notification.error('Error', error.error?.detail || 'Failed to update class');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/classes/', this.classId]);
  }
}
