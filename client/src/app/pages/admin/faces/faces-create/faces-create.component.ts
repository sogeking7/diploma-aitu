import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule, NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { FacesService } from '../../../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-faces-create',
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
    NzNotificationModule,
  ],
  templateUrl: './faces-create.component.html',
  styleUrls: ['./faces-create.component.css'],
})
export class FacesCreateComponent implements OnInit {
  faceForm!: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;
  fileList: NzUploadFile[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private facesService: FacesService,
    private router: Router,
    private notification: NzNotificationService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.faceForm = this.fb.group({
      user_id: [null, [Validators.required]],
      // Note: We don't include the image in the form model as we'll handle it separately
    });
  }

  // Handle file selection with native file input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Handle file selection with ng-zorro upload component
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    this.selectedFile = file as never;
    return false; // Prevent automatic upload
  };

  // Handle upload change events
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

    // Update the selected file if the file is valid
    if (file.originFileObj) {
      this.selectedFile = file.originFileObj;
    }
  }

  submitForm(): void {
    if (this.faceForm.valid) {
      if (!this.selectedFile) {
        this.notification.error('Error', 'Please select an image file');
        return;
      }

      this.isSubmitting = true;
      const userId = this.faceForm.get('user_id')?.value;

      // Convert File to Blob if needed (though File is already a Blob)
      const imageBlob: Blob = this.selectedFile;

      this.facesService.addFace(userId, imageBlob).subscribe({
        next: () => {
          this.notification.success('Success', 'Face has been added successfully!');
          this.router.navigate(['/faces'], { relativeTo: this.router.routerState.root });
        },
        error: err => {
          this.isSubmitting = false;
          this.notification.error('Error', err.error?.detail || err.error?.message || 'Failed to add face. Please try again.');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      Object.values(this.faceForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.notification.warning('Validation Error', 'Please fill in all required fields correctly.');
    }
  }

  cancelCreate(): void {
    this.router.navigate(['/faces'], { relativeTo: this.router.routerState.root });
  }

  goBack(): void {
    this.router.navigate(['/faces'], { relativeTo: this.router.routerState.root });
  }
}
