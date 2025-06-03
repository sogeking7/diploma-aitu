import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassesService, ClassOut, UsersService, UserOut, ClassStudentsService, ClassStudentOut } from '../../../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { BehaviorSubject, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NgForOf } from '@angular/common';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-classes-edit',
  standalone: true,
  imports: [
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
    NzPopconfirmDirective,
    NzTableModule,
    FormsModule,
  ],
  templateUrl: './classes-edit.page.html',
})
export class ClassesEditPage implements OnInit {
  class?: ClassOut;
  classStudents: ClassStudentOut[] = [];
  searchTeachers: UserOut[] = [];
  searchStudents: UserOut[] = [];

  isLoading = {
    class: false,
    save: false,
    searchTeachers: false,
    searchStudents: false,
    addStudent: false,
    removeStudent: false,
    classStudents: false,
  };
  isEdit = false;
  editForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    teacher_user_id: new FormControl<number | null>(null, [Validators.required]),
  });

  studentsPagination = {
    page: 1,
    count: 20,
    total: 0,
  };

  searchTeacherInput$ = new BehaviorSubject<string>('');
  searchStudentInput$ = new BehaviorSubject<string>('');

  selectedStudentId: null | number = null;

  private classesService = inject(ClassesService);
  private usersService = inject(UsersService);
  private classStudentsService = inject(ClassStudentsService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadClass(Number(id)).then(() => {
        if (this.class) {
          this.loadClassStudents(this.class.id);
        }
      });

      this.route.queryParams.subscribe(params => {
        this.studentsPagination.page = params['page'] ? +params['page'] : 1;
        this.studentsPagination.count = params['count'] ? +params['count'] : 20;
      });
    }
    this.searchTeacherInput$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(query => {
          this.isLoading.searchTeachers = true;
          return this.usersService.readUsers('teacher', String(query), 1, 100);
        })
      )
      .subscribe({
        next: res => {
          this.searchTeachers = res.items;
          this.isLoading.searchTeachers = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.searchTeachers = false;
          this.notification.error('Error', err.error?.message || 'Failed to search teachers');
        },
      });

    if (this.isEdit) {
      this.searchStudentInput$
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap(query => {
            this.isLoading.searchStudents = true;
            return this.usersService.readUsers('student', String(query), 1, 100);
          })
        )
        .subscribe({
          next: res => {
            this.searchStudents = res.items;
            this.isLoading.searchStudents = false;
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading.searchStudents = false;
            this.notification.error('Error', err.error?.message || 'Failed to search students');
          },
        });
    }
  }

  private async loadClass(classId: number) {
    this.isLoading.class = true;
    try {
      this.class = await firstValueFrom(this.classesService.readClass(classId));
      this.editForm.patchValue({
        name: this.class.name,
        teacher_user_id: this.class.teacher_user_id,
      });
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to load class data');
      this.router.navigate(['/classes']);
    } finally {
      this.isLoading.class = false;
    }
  }

  async saveClass() {
    Object.values(this.editForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (!this.editForm.valid) {
      return;
    }

    const formModel = this.editForm.value;

    if (!formModel.name || !formModel.teacher_user_id) {
      throw new Error('required.fields');
    }

    this.isLoading.save = true;
    try {
      if (this.class) {
        await firstValueFrom(
          this.classesService.updateClass(this.class.id, {
            name: formModel.name,
            teacher_user_id: formModel.teacher_user_id,
          })
        );
      } else {
        const res = await firstValueFrom(
          this.classesService.createClass({
            name: formModel.name,
            teacher_user_id: formModel.teacher_user_id,
          })
        );
        this.notification.success('Success', 'Class has been saved successfully!');
        this.router.navigate(['classes', 'edit', res.id]);
        return;
      }

      this.notification.success('Success', 'Class has been saved successfully!');
      this.router.navigate(['classes']);
    } catch (e: unknown) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to save class');
    } finally {
      this.isLoading.save = false;
    }
  }

  private async loadClassStudents(classId: number) {
    this.isLoading.classStudents = true;
    try {
      const res = await firstValueFrom(
        this.classStudentsService.readStudentsByClass(classId, this.studentsPagination.page, this.studentsPagination.count)
      );
      this.classStudents = res.items;
      this.studentsPagination.total = Number(res.total);
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to load class students');
      this.router.navigate(['/classes']);
    } finally {
      this.isLoading.classStudents = false;
    }
  }

  async addStudent(classId: number, studentId: number) {
    this.isLoading.addStudent = true;

    try {
      await firstValueFrom(
        this.classStudentsService.createClassStudent({
          student_user_id: studentId,
          class_id: classId,
        })
      );
      this.notification.success('Success', 'Student added to class successfully');
      this.class && (await this.loadClassStudents(this.class.id));
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to add student to class');
    } finally {
      this.isLoading.addStudent = false;
      this.selectedStudentId = null;
    }
  }

  async removeStudent(classStudentId: number) {
    this.isLoading.removeStudent = true;

    try {
      await firstValueFrom(this.classStudentsService.deleteClassStudent(classStudentId));
      this.notification.success('Success', 'Student removed from class successfully');
      this.class && (await this.loadClassStudents(this.class.id));
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to remove student from class');
    } finally {
      this.isLoading.removeStudent = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/classes']);
  }

  onTeacherSearch(value: string): void {
    this.searchTeacherInput$.next(value);
  }

  onStudentSearch(value: string): void {
    this.searchStudentInput$.next(value);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex, pageSize } = params;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: pageIndex,
        count: pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }
}
