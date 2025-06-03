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
import { ClassCreate, ClassesService, UsersService, UserOut, RoleEnum } from '../../../../../lib/open-api';

@Component({
  selector: 'app-class-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzButtonModule, NzGridModule, NzCardModule, NzIconModule],
  styleUrls: ['./classes-create.component.css'],
  templateUrl: './classes-create.component.html',
})
export class ClassesCreateComponent implements OnInit {
  classForm!: FormGroup;
  isSubmitting = false;
  teachers: UserOut[] = [];
  loading = false;

  // Properties for teacher search
  teacherSearchResults: UserOut[] = [];
  isSearchingTeachers = false;
  readonly nzFilterOption = (): boolean => true; // Always return true to let the server handle filtering

  constructor(
    private fb: FormBuilder,
    private classesService: ClassesService,
    private usersService: UsersService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.classForm = this.fb.group({
      name: [null, [Validators.required]],
      teacher_user_id: [null, [Validators.required]],
    });

    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    this.usersService.readUsers(RoleEnum.teacher, undefined, 1, 100).subscribe({
      next: response => {
        this.loading = false;
        this.teachers = response.items;
      },
      error: err => {
        this.loading = false;
        this.notification.error('Error', err.error?.message || 'Failed to load teachers. Please try again.');
      },
    });
  }

  submitForm(): void {
    if (this.classForm.valid) {
      this.isSubmitting = true;

      const classData: ClassCreate = this.classForm.value;

      this.classesService.createClass(classData).subscribe({
        next: () => {
          this.notification.success('Success', 'Class has been created successfully!');
          this.router.navigate(['/classes'], { relativeTo: this.router.routerState.root });
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.message || 'Failed to create class. Please try again.');
        },
      });
    } else {
      Object.values(this.classForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelCreate(): void {
    this.router.navigate(['/classes'], { relativeTo: this.router.routerState.root });
  }

  goBack(): void {
    this.router.navigate(['/classes'], { relativeTo: this.router.routerState.root });
  }

  searchTeachers(searchText: string): void {
    if (!searchText || searchText.trim() === '') {
      this.teacherSearchResults = this.teachers;
      return;
    }

    const lowerSearchText = searchText.toLowerCase();
    this.teacherSearchResults = this.teachers.filter(teacher => {
      const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
      return fullName.includes(lowerSearchText);
    });
  }

  // Get teacher display name
  getTeacherDisplayName(teacher: UserOut): string {
    return `${teacher.first_name} ${teacher.last_name}`;
  }
}
