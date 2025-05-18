import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
import numpy as np

# Choose device: GPU > CPU
if torch.cuda.is_available():
    device = 'cuda'
else:
    device = 'cpu'


class FaceDetector:
    def __init__(self):
        self.mtcnn = MTCNN(keep_all=False, device=device)
        self.resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)
        print(f"Face detector initialized on device: {device}")

    def extract_embedding(self, image):
        """Extract face embedding from an image"""
        face = self.mtcnn(image)
        if face is None:
            return None
        return self.resnet(face.unsqueeze(0).to(device)).detach().cpu().numpy()

    def get_device_info(self):
        """Return information about the current device"""
        mps_available = hasattr(torch.backends, 'mps') and torch.backends.mps.is_available()
        return {
            "device": device,
            "mps_available": mps_available,
            "torch_version": torch.__version__
        }
