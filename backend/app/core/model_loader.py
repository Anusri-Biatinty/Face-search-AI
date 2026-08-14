"""Lazy, shared loader for the InsightFace face-analysis model."""

from functools import lru_cache

from insightface.app import FaceAnalysis


@lru_cache(maxsize=1)
def get_face_model() -> FaceAnalysis:
    """Return the process-wide face-analysis model running on the CPU."""
    model = FaceAnalysis()
    model.prepare(ctx_id=-1)
    return model
