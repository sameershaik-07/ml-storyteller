import os

backend_schema = """
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
"""

schemas_file = "/home/sameer/Desktop/project/backend/models/schemas.py"
with open(schemas_file, "r") as f:
    content = f.read()
if "LogRegState" not in content:
    with open(schemas_file, "a") as f:
        f.write(backend_schema)

print("Schemas added")
