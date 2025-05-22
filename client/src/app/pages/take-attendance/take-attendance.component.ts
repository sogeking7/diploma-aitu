import { Component, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AttendancesService, FaceAttendanceOut } from '../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-face',
  templateUrl: './take-attendance.component.html',
  styleUrl: './take-attendance.component.css',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, DatePipe, NzResultModule],
})
export class TakeAttendanceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;

  private stream: MediaStream | null = null;
  public searchResult: FaceAttendanceOut | null = null;
  public isSearching = false;
  public showSuccessResult = false;
  public countdownValue = 3;
  private countdownSubscription: Subscription | null = null;

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
    this.cancelCountdown();
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
                this.showSuccessResult = true;
                this.startCountdown();
                this.cdr.detectChanges();
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

  startCountdown(): void {
    this.countdownValue = 3;
    this.cancelCountdown(); // Cancel any existing countdown

    this.countdownSubscription = interval(1000)
      .pipe(take(4)) // 0,1,2,3 seconds (4 emissions)
      .subscribe({
        next: count => {
          this.countdownValue = 3 - count;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.resetCamera();
        },
      });
  }

  cancelCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = null;
    }
  }

  resetCamera(): void {
    this.cancelCountdown();
    this.showSuccessResult = false;
    this.searchResult = null;
    this.cdr.detectChanges();
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
