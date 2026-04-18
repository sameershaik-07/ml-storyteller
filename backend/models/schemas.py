from pydantic import BaseModel
from typing import List

class Point(BaseModel):
    x: float
    y: float

class GradientDescentState(BaseModel):
    points: List[Point]
    m: float            # Current slope
    c: float            # Current intercept
    learning_rate: float
    step_number: int

class GradientDescentResponse(BaseModel):
    m: float
    c: float
    cost: float
    story: str          # The AI explanation of what just happened

# ---------- K-Means Clustering Models ----------

class KMeansPoint(BaseModel):
    x: float
    y: float
    cluster_id: int = -1  # -1 means unassigned

class Centroid(BaseModel):
    id: int
    x: float
    y: float

class KMeansState(BaseModel):
    points: List[KMeansPoint]
    centroids: List[Centroid]
    step_number: int
    phase: str          # "assign" or "update"

class KMeansResponse(BaseModel):
    points: List[KMeansPoint]
    centroids: List[Centroid]
    phase: str
    is_converged: bool
    story: str


# ---------- K-Nearest Neighbors (KNN) Models ----------

class KNNPoint(BaseModel):
    x: float
    y: float
    class_id: int

class KNNTarget(BaseModel):
    x: float
    y: float
    class_id: int = -1

class KNNState(BaseModel):
    points: List[KNNPoint]
    target: KNNTarget
    k: int
    step_number: int
    phase: str          # "add", "distances", "vote", "classify"

class KNNResponse(BaseModel):
    target: KNNTarget
    k_neighbors: List[dict]
    max_distance: float
    phase: str
    is_converged: bool
    story: str

# ---------- Logistic Regression Models ----------
class LogRegPoint(BaseModel):
    x: float
    y: float
    class_id: int

class LogRegState(BaseModel):
    points: List[LogRegPoint]
    w1: float
    w2: float
    b: float
    learning_rate: float
    step_number: int

class LogRegResponse(BaseModel):
    w1: float
    w2: float
    b: float
    cost: float
    story: str

# ---------- SVM Models ----------
class SVMState(BaseModel):
    points: List[LogRegPoint]
    w1: float
    w2: float
    b: float
    learning_rate: float
    step_number: int

class SVMResponse(BaseModel):
    w1: float
    w2: float
    b: float
    cost: float
    story: str

# ---------- Decision Tree Models ----------
class DTState(BaseModel):
    points: List[LogRegPoint]
    step_number: int
    depth: int

class DTResponse(BaseModel):
    splits: List[dict] # {axis: 'x'|'y', value: float}
    story: str

# ---------- PCA Models ----------
class PCAState(BaseModel):
    points: List[Point]
    angle: float
    step_number: int

class PCAResponse(BaseModel):
    angle: float
    variance: float
    story: str
