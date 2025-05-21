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
        if not isinstance(self.index, faiss.IndexIDMap):
            self.index = faiss.IndexIDMap(self.index)
        with open(self.metadata_file, "rb") as f:
            self.metadata = pickle.load(f)
        print(f"Loaded existing face database with {self.index.ntotal} faces")

    def _create_new_database(self) -> None:
        base_index = faiss.IndexFlatL2(self.dimension)
        self.index = faiss.IndexIDMap(base_index)
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

        embedding = self._normalize_embedding(embedding)
        self.index.add_with_ids(embedding, np.array([face_id], dtype=np.int64))

        self.metadata[face_id] = {
            "info": metadata or {},
            "embedding": embedding.tolist(),
        }

        self.save()
        return True

    def search_face(
        self, embedding: np.ndarray, k: int = 1, threshold: float = 0.8
    ) -> List[Tuple[int, float, Dict]]:
        if self.index.ntotal == 0:
            return []

        embedding = self._normalize_embedding(embedding)
        distances, ids = self.index.search(embedding, k)

        results = []
        for i, face_id in enumerate(ids[0]):
            if face_id == -1:
                continue
            distance = distances[0][i]
            if distance < threshold and face_id in self.metadata:
                results.append(
                    (face_id, float(distance), self.metadata[face_id]["info"])
                )
        return results

    def delete_face(self, face_id: int) -> bool:
        if face_id not in self.metadata:
            return False

        selector = faiss.IDSelectorBatch(np.array([face_id], dtype=np.int64))
        self.index.remove_ids(selector)
        del self.metadata[face_id]

        self.save()
        return True

    def get_all_faces(self) -> Dict[int, Dict]:
        return {face_id: data["info"] for face_id, data in self.metadata.items()}
