import os
from pinecone import Pinecone, ServerlessSpec

api_key = os.environ.get("PINECONE_API_KEY")
region = os.environ.get("PINECONE_REGION")

if not api_key or not region:
    raise ValueError(
        "PINECONE_API_KEY and PINECONE_REGION must be set in environment variables"
    )

pc = Pinecone(api_key=api_key)

index_name = "face-recognition"
dimension = 512

existing_indexes = pc.list_indexes().names()
if index_name not in existing_indexes:
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region=region),
    )

pinecone_index = pc.Index(index_name)


def get_pinecone_index():
    return pinecone_index
