import faiss
import numpy as np
import os
import pickle
from typing import List, Dict, Tuple, Optional


class FaceDatabase:
    def __init__(self, dimension: int = 512,
                 index_file: str = "data/face_index.faiss",
                 metadata_file: str = "data/face_metadata.pkl"):
        self.dimension = dimension
        self.index_file = index_file
        self.metadata_file = metadata_file

        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(index_file), exist_ok=True)

        # Load existing index if it exists, otherwise create new one
        if os.path.exists(index_file) and os.path.exists(metadata_file):
            self.index = faiss.read_index(index_file)
            with open(metadata_file, 'rb') as f:
                self.metadata = pickle.load(f)
            print(f"Loaded existing face database with {self.index.ntotal} faces")
        else:
            self.index = faiss.IndexFlatL2(dimension)  # L2 distance
            self.metadata = {}
            print("Created new face database")

    def save(self):
        """Save the index and metadata to disk"""
        faiss.write_index(self.index, self.index_file)
        with open(self.metadata_file, 'wb') as f:
            pickle.dump(self.metadata, f)

    def add_face(self, face_id: str, embedding: np.ndarray, metadata: Dict = None) -> bool:
        """Add a face embedding to the database"""
        if face_id in self.metadata:
            return False  # ID already exists

        # Ensure embedding is the right shape and type
        embedding = embedding.reshape(1, self.dimension).astype(np.float32)

        # Add to index
        self.index.add(embedding)

        # Store ID -> index mapping and metadata
        self.metadata[face_id] = {
            'index': self.index.ntotal - 1,
            'info': metadata or {}
        }

        self.save()
        return True

    def search_face(self, embedding: np.ndarray, k: int = 1,
                    threshold: float = 0.8) -> List[Tuple[str, float, Dict]]:
        """Search for similar faces in the database"""
        if self.index.ntotal == 0:
            return []

        # Ensure embedding is the right shape and type
        embedding = embedding.reshape(1, self.dimension).astype(np.float32)

        # Search the index
        distances, indices = self.index.search(embedding, k)

        results = []
        for i in range(len(indices[0])):
            if indices[0][i] != -1:  # Valid result
                # Find which face_id corresponds to this index
                face_id = None
                for id, data in self.metadata.items():
                    if data['index'] == indices[0][i]:
                        face_id = id
                        break

                if face_id and distances[0][i] < threshold:
                    results.append((face_id, float(distances[0][i]),
                                    self.metadata[face_id]['info']))

        return results

    def delete_face(self, face_id: str) -> bool:
        """Delete a face from the database"""
        if face_id not in self.metadata:
            return False

        # FAISS doesn't support direct deletion, so we need to rebuild the index
        all_ids = list(self.metadata.keys())
        all_ids.remove(face_id)

        if not all_ids:  # No faces left
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = {}
            self.save()
            return True

        # Get vectors to keep
        remaining_vectors = []
        new_metadata = {}

        for i, id in enumerate(all_ids):
            idx = self.metadata[id]['index']
            vector = faiss.vector_to_array(self.index.get_vector(idx)).reshape(1, self.dimension)
            remaining_vectors.append(vector)

            # Update metadata with new index
            new_metadata[id] = {
                'index': i,
                'info': self.metadata[id]['info']
            }

        # Create a new index with the remaining vectors
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(np.vstack(remaining_vectors).astype(np.float32))
        self.metadata = new_metadata

        self.save()
        return True

    def get_all_faces(self) -> Dict[str, Dict]:
        """Get all faces in the database"""
        return {id: data['info'] for id, data in self.metadata.items()}
