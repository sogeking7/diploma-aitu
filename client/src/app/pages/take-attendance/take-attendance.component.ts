import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AttendancesService, FaceAttendanceOut } from '../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-face',
  templateUrl: './take-attendance.component.html',
  styleUrl: './take-attendance.component.css',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
})
export class TakeAttendanceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;

  private stream: MediaStream | null = null;
  public searchResults: FaceAttendanceOut | null = null;
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
                this.searchResults = results;
                this.isSearching = false;
                this.cdr.detectChanges();
                const student_user = this.searchResults.student_user;
                const fullName = `${student_user?.first_name} ${student_user?.last_name}`;
                const time_in = this.searchResults.time_in;
                const time_out = this.searchResults.time_out;

                this.notification.success('Success', `Found: ${fullName} \nTime In: ${time_in} \nTime Out: ${time_out}`);
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
