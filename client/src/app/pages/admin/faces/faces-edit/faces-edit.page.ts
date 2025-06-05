import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule, NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { FacesService, UserOut, UsersService } from '../../../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime, switchMap } from 'rxjs/operators';
import { BehaviorSubject, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-faces-edit-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzUploadModule,
    FormsModule,
    NzTypographyComponent,
  ],
  templateUrl: './faces-edit.page.html',
})
export class FacesEditPage implements OnInit {
  searchStudents: UserOut[] = [];
  isEdit = false;
  isLoading = {
    searchStudents: false,
    save: false,
  };

  selectedFile: File | null = null;
  fileList: NzUploadFile[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  private usersService = inject(UsersService);
  private facesService = inject(FacesService);
  private messageService = inject(NzMessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NzNotificationService);

  searchInput$ = new BehaviorSubject<string>('');

  selectedStudentId: number | null = null;

  ngOnInit(): void {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    this.selectedFile = file as never;
    return false; // Prevent automatic upload
  };

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.messageService.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.messageService.error(`${file.name} file upload failed.`);
    }

    if (file.originFileObj) {
      this.selectedFile = file.originFileObj;
    }
  }

  async submitForm() {
    if (!this.selectedFile) {
      this.notification.warning('Error', 'Please select an image file');
      return;
    }

    if (!this.selectedStudentId) {
      this.notification.warning('Error', 'Please select an student');
      return;
    }

    const imageBlob: Blob = this.selectedFile;

    this.isLoading.save = true;

    try {
      await firstValueFrom(this.facesService.addFace(this.selectedStudentId, imageBlob));
      this.notification.success('Success', 'Face has been added successfully!');
      this.router.navigate(['/faces'], { relativeTo: this.router.routerState.root });
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.notification.error('Error', error.error?.message || 'Failed to add face. Please try again.');
    } finally {
      this.isLoading.save = false;
    }
  }

  onStudentSearch(value: string): void {
    this.searchInput$.next(value);
  }

  cancelCreate(): void {
    this.router.navigate(['/faces'], { relativeTo: this.router.routerState.root });
  }

  goBack(): void {
    this.router.navigate(['/faces'], { relativeTo: this.router.routerState.root });
  }
}
