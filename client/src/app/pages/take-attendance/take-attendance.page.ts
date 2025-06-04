import { Component, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AttendancesService, FaceAttendanceOut } from '../../../lib/open-api';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-take-attendance-page',
  templateUrl: './take-attendance.page.html',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule, DatePipe, NzResultModule, NzTypographyComponent],
})
export class TakeAttendancePage implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;

  private stream?: MediaStream;
  private countdownSubscription?: Subscription;

  faceAttendance?: FaceAttendanceOut;
  countdownValue = 3;
  error = '';
  isLoading = {
    create: false,
  };

  private attendanceService = inject(AttendancesService);
  private cdr = inject(ChangeDetectorRef);

  async ngAfterViewInit() {
    await this.setupCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
    this.cancelCountdown();
  }

  async captureAndSearch() {
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const rect = video.getBoundingClientRect();

    const canvas = document.createElement('canvas');

    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.drawImage(video, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

    canvas.toBlob(
      blob => {
        if (!blob) {
          return;
        }
        this.createFaceAttendance(blob);
      },
      'image/jpeg',
      1.0
    );
  }

  async createFaceAttendance(image: Blob) {
    this.isLoading.create = true;
    this.error = '';
    this.faceAttendance = undefined;

    try {
      this.faceAttendance = await firstValueFrom(this.attendanceService.createFaceAttendance(image));
    } catch (e) {
      const error = e as HttpErrorResponse;
      this.error = error.error?.message.split(':')[1] || 'Failed to search for faces. Please try again.';
    } finally {
      this.startCountdown();
      this.isLoading.create = false;
      this.cdr.detectChanges();
    }
  }

  startCountdown() {
    this.cancelCountdown();
    this.countdownValue = 3;

    this.countdownSubscription = interval(1000)
      .pipe(take(3))
      .subscribe({
        next: count => {
          this.countdownValue = 3 - (count + 1);
          console.log(count);
          this.cdr.detectChanges();
        },
        complete: () => {
          this.cancelCountdown();
        },
      });
  }

  cancelCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = undefined;
    }
  }

  private async setupCamera() {
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
      await video.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = undefined;
    }
  }
}
