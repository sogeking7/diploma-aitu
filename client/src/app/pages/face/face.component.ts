import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FaceOut, FacesService } from '../../../lib/open-api';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrl: './face.component.css',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
})
export class FaceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;

  private stream: MediaStream | null = null;
  public searchResults: {
    face: FaceOut;
    distance: number;
  } | null = null;
  public isSearching = false;

  constructor(
    private facesService: FacesService,
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

    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const rect = video.getBoundingClientRect();

    const canvas = document.createElement('canvas');

    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

      canvas.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            this.facesService.searchFace(blob).subscribe({
              next: results => {
                this.searchResults = results;
                this.isSearching = false;
                this.cdr.detectChanges();
                if (results['face']) {
                  const face = this.searchResults?.face;
                  // const distance = this.searchResults?.distance;
                  const fullName = `${face?.user?.first_name} ${face?.user?.last_name}`;
                  this.notification.success('Success', `Found: ${fullName}`);
                } else {
                  this.notification.info('Information', 'No matching faces found in the database.');
                }
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
