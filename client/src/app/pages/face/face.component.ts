import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrl: './face.component.css',
  standalone: true,
})
export class FaceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;

  private stream: MediaStream | null = null;

  ngAfterViewInit(): void {
    this.setupCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
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
