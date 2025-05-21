import faiss
import numpy as np
import os
import pickle
from typing import List, Dict, Tuple, Optional


class FaceDatabase:
    def __init__(
        self,
        dimension: int = 512,
        index_file: str = "faiss/face_index.faiss",
        metadata_file: str = "faiss/face_metadata.pkl",
    ):
        self.dimension = dimension
        self.index_file = index_file
        self.metadata_file = metadata_file

        self._ensure_data_directory()
        self._initialize_database()

    def _ensure_data_directory(self) -> None:
        os.makedirs(os.path.dirname(self.index_file), exist_ok=True)

    def _initialize_database(self) -> None:
        if self._database_exists():
            self._load_existing_database()
        else:
            self._create_new_database()

    def _database_exists(self) -> bool:
        return os.path.exists(self.index_file) and os.path.exists(self.metadata_file)

    def _load_existing_database(self) -> None:
        self.index = faiss.read_index(self.index_file)
        with open(self.metadata_file, "rb") as f:
            self.metadata = pickle.load(f)
        print(f"Loaded existing face database with {self.index.ntotal} faces")

    def _create_new_database(self) -> None:
        self.index = faiss.IndexFlatL2(self.dimension)  # L2 distance
        self.metadata = {}
        print("Created new face database")

    def save(self) -> None:
        faiss.write_index(self.index, self.index_file)
        with open(self.metadata_file, "wb") as f:
            pickle.dump(self.metadata, f)

    def _normalize_embedding(self, embedding: np.ndarray) -> np.ndarray:
        return embedding.reshape(1, self.dimension).astype(np.float32)

    def add_face(
        self, face_id: int, embedding: np.ndarray, metadata: Optional[Dict] = None
    ) -> bool:
        if face_id in self.metadata:
            return False  # ID already exists

        normalized_embedding = self._normalize_embedding(embedding)
        self.index.add(normalized_embedding)

        self.metadata[face_id] = {
            "index": self.index.ntotal - 1,
            "info": metadata or {},
        }

        self.save()
        return True

    def search_face(
        self, embedding: np.ndarray, k: int = 1, threshold: float = 0.8
    ) -> List[Tuple[str, float, Dict]]:
        if self.index.ntotal == 0:
            return []

        normalized_embedding = self._normalize_embedding(embedding)
        distances, indices = self.index.search(normalized_embedding, k)

        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1:  # Invalid result
                continue

            face_id = self._find_face_id_by_index(idx)
            distance = distances[0][i]

            if face_id and distance < threshold:
                results.append(
                    (face_id, float(distance), self.metadata[face_id]["info"])
                )

        return results

    def _find_face_id_by_index(self, index: int) -> Optional[str]:
        for face_id, data in self.metadata.items():
            if data["index"] == index:
                return face_id
        return None

    def delete_face(self, face_id: str) -> bool:
        if face_id not in self.metadata:
            return False

        all_ids = list(self.metadata.keys())
        all_ids.remove(face_id)

        if not all_ids:  # No faces left
            self._create_new_database()
            self.save()
            return True

        self._rebuild_index_without_face(all_ids)
        self.save()
        return True

    def _rebuild_index_without_face(self, remaining_ids: List[str]) -> None:
        remaining_vectors = []
        new_metadata = {}

        for i, face_id in enumerate(remaining_ids):
            idx = self.metadata[face_id]["index"]
            vector = faiss.vector_to_array(self.index.get_vector(idx)).reshape(
                1, self.dimension
            )
            remaining_vectors.append(vector)

            new_metadata[face_id] = {"index": i, "info": self.metadata[face_id]["info"]}

        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(np.vstack(remaining_vectors).astype(np.float32))
        self.metadata = new_metadata

    def get_all_faces(self) -> Dict[str, Dict]:
        return {id: data["info"] for id, data in self.metadata.items()}
