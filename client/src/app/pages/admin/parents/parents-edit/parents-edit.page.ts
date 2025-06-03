import { Component, inject, OnInit } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { ParentStudentOut, ParentStudentsService, UserOut, UsersService } from '../../../../../lib/open-api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForOf } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-parents-edit',
  imports: [
    NzButtonComponent,
    NzIconDirective,
    NzSpinComponent,
    NzPopconfirmDirective,
    RouterModule,
    NgForOf,
    NzTableModule,
    NzTypographyComponent,
    NzFormModule,
    NzSelectModule,
    FormsModule,
  ],
  templateUrl: './parents-edit.page.html',
})
export class ParentsEditPage implements OnInit {
  parent?: UserOut;
  parentStudents: ParentStudentOut[] = [];
  searchStudents: UserOut[] = [];

  isLoading = {
    parent: false,
    parentStudents: false,
    searchStudents: false,
    addStudent: false,
    removeStudent: false,
  };

  studentsPagination = {
    page: 1,
    count: 20,
    total: 0,
  };
  searchInput$ = new BehaviorSubject<string>('');

  selectedStudentId: number | null = null;

  private parentStudentService = inject(ParentStudentsService);
  private usersService = inject(UsersService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentsPagination.page = params['page'] ? +params['page'] : 1;
      this.studentsPagination.count = params['count'] ? +params['count'] : 20;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadParent(Number(id)).then(() => {
        if (this.parent) {
          this.loadParentStudents(this.parent.id);
        }
      });
    }

    this.searchInput$
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

  private async loadParent(parentId: number) {
    this.isLoading.parent = true;

    try {
      this.parent = await firstValueFrom(this.usersService.readUser(parentId));
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to load parent data');
      await this.router.navigate(['/parents']);
    } finally {
      this.isLoading.parent = false;
    }
  }

  private async loadParentStudents(parentId: number) {
    this.isLoading.parentStudents = true;

    try {
      const res = await firstValueFrom(this.parentStudentService.readStudentsByParent(parentId));
      this.parentStudents = res.items;
      this.studentsPagination.total = Number(res.total);
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to load parent students data');
      await this.router.navigate(['/parents']);
    } finally {
      this.isLoading.parentStudents = false;
    }
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

  async addStudent(parentId: number, studentId: number) {
    this.isLoading.addStudent = true;

    try {
      await firstValueFrom(
        this.parentStudentService.createParentStudent({
          parent_user_id: parentId,
          student_user_id: studentId,
        })
      );
      this.notification.success('Success', 'Student added to parent successfully');
      this.parent && (await this.loadParentStudents(this.parent.id));
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to add student to parent');
    } finally {
      this.isLoading.addStudent = false;
      this.selectedStudentId = null;
    }
  }

  async removeStudent(parentStudentId: number) {
    this.isLoading.removeStudent = true;

    try {
      await firstValueFrom(this.parentStudentService.deleteParentStudent(parentStudentId));
      this.notification.success('Success', 'Student removed from parent successfully');
      this.parent && (await this.loadParentStudents(this.parent.id));
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to remove student from parent');
    } finally {
      this.isLoading.removeStudent = false;
    }
  }

  onStudentSearch(value: string): void {
    this.searchInput$.next(value);
  }

  goBack(): void {
    this.router.navigate(['/parents']);
  }
}
