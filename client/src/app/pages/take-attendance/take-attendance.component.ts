import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AttendancesService, FaceAttendanceOut } from '../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableCellDirective } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-face',
  templateUrl: './take-attendance.component.html',
  styleUrl: './take-attendance.component.css',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, DatePipe, NzTableCellDirective],
})
export class TakeAttendanceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('customNotification') customNotificationTpl!: TemplateRef;

  private stream: MediaStream | null = null;
  public searchResult: FaceAttendanceOut | null = null;
  public isSearching = false;

  constructor(
    private attendanceService: AttendancesService,
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService
  ) {}

  ngAfterViewInit(): void {
    this.setupCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  captureAndSearch(): void {
    this.isSearching = true;

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        blob => {
          if (blob) {
            this.attendanceService.createFaceAttendance(blob).subscribe({
              next: results => {
                this.searchResult = results;
                this.isSearching = false;
                this.cdr.detectChanges();
                this.notification.template(this.customNotificationTpl);
              },
              error: error => {
                this.isSearching = false;
                this.cdr.detectChanges();
                this.notification.error('Error', error.error?.detail || error.error?.message || 'Failed to search for faces. Please try again.');
              },
            });
          } else {
            this.isSearching = false;
            this.cdr.detectChanges();
            this.notification.error('Error', 'Could not initialize camera capture. Please try again.');
          }
        },
        'image/jpeg',
        1.0
      ); // JPEG format with 100% quality
    }
  }

  private async setupCamera(): Promise<void> {
    try {
      const constraints = {
        video: {
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight },
          facingMode: 'user',
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
