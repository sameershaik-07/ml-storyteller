from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.schemas import GradientDescentState, GradientDescentResponse, KMeansState, KMeansResponse, KNNState, KNNResponse, LogRegState, LogRegResponse, SVMState, SVMResponse, DTState, DTResponse, PCAState, PCAResponse
from core_algorithms.linear_regression import gradient_descent_step, compute_cost
from core_algorithms.k_means import assign_clusters, update_centroids
from core_algorithms.knn import compute_distances, get_k_nearest, assign_class
from core_algorithms.logistic_regression import gradient_descent_step as logreg_step, compute_cost as logreg_cost
from storyteller.llm_client import generate_story, generate_kmeans_story

app = FastAPI(title="ML Storyteller API")

# Configure CORS to allow the Next.js frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root(): return {"message": "Welcome to the ML Storyteller API!"}

@app.get("/health")
async def health_check(): return {"status": "healthy"}

@app.post("/api/linear-regression/step", response_model=GradientDescentResponse)
async def take_gradient_descent_step(state: GradientDescentState):
    current_cost = compute_cost(state.m, state.c, state.points)
    new_m, new_c = state.m, state.c
    if state.step_number > 0:
        new_m, new_c = gradient_descent_step(new_m, new_c, state.points, state.learning_rate)
    new_cost = compute_cost(new_m, new_c, state.points)
    state.m, state.c = new_m, new_c
    story = generate_story(state, new_cost, current_cost)
    return GradientDescentResponse(m=new_m, c=new_c, cost=new_cost, story=story)

@app.post("/api/k-means/step", response_model=KMeansResponse)
async def take_kmeans_step(state: KMeansState):
    new_points = state.points.copy()
    new_centroids = state.centroids.copy()
    is_converged = False
    
    if state.step_number == 0:
        next_phase = "assign"
        story = "Welcome to K-Means! Look at those random centroid stars. Let's start the Algorithm!"
    elif state.phase == "assign":
        new_points, has_changed = assign_clusters(new_points, new_centroids)
        if not has_changed: is_converged = True
        next_phase = "update"
        story = generate_kmeans_story(state, is_converged)
    else:
        new_centroids = update_centroids(new_points, new_centroids)
        next_phase = "assign"
        story = generate_kmeans_story(state, is_converged)

    return KMeansResponse(points=new_points, centroids=new_centroids, phase=next_phase, is_converged=is_converged, story=story)

@app.post("/api/knn/step", response_model=KNNResponse)
async def take_knn_step(state: KNNState):
    pts = [{"x": p.x, "y": p.y, "class_id": p.class_id} for p in state.points]
    tgt = {"x": state.target.x, "y": state.target.y, "class_id": state.target.class_id}
    pts_with_dist = compute_distances(pts, tgt)
    k_nearest = get_k_nearest(pts_with_dist, state.k)
    max_dist = max([p['distance'] for p in k_nearest]) if k_nearest else 0
    is_converged = False
    if state.step_number == 0:
        next_phase = "distances"
        story = f"A new unknown point has arrived! To find out where it belongs, we'll check its {state.k} closest neighbors."
    elif state.phase == "distances":
        next_phase = "k_nearest"
        story = "First, we measure the distance from the unknown point to every other person in the neighborhood."
    elif state.phase == "k_nearest":
        next_phase = "vote"
        story = f"Now we draw a circle just big enough to capture the {state.k} closest neighbors."
    else:
        predicted_class, _ = assign_class(k_nearest)
        state.target.class_id = predicted_class
        next_phase = "done"
        is_converged = True
        story = f"The neighbors have voted! Most of them belong to group {predicted_class}, so our new friend joins them too."
    return KNNResponse(target=state.target, k_neighbors=k_nearest, max_distance=max_dist, phase=next_phase, is_converged=is_converged, story=story)

@app.post("/api/logistic-regression/step", response_model=LogRegResponse)
async def take_logistic_step(state: LogRegState):
    pts = [{"x": p.x, "y": p.y, "class_id": p.class_id} for p in state.points]
    cost = logreg_cost(state.w1, state.w2, state.b, pts)
    new_w1, new_w2, new_b = state.w1, state.w2, state.b

    if state.step_number > 0:
        new_w1, new_w2, new_b = logreg_step(new_w1, new_w2, new_b, pts, state.learning_rate)
        
    story = "The Banker is shifting the decision boundary line slightly to better separate the two groups. We want clear groups on each side!"
    new_cost = logreg_cost(new_w1, new_w2, new_b, pts)
    return LogRegResponse(w1=new_w1, w2=new_w2, b=new_b, cost=new_cost, story=story)

@app.post("/api/svm/step", response_model=SVMResponse)
async def take_svm_step(state: SVMState):
    story = "'The City Planner' is calculating the widest street between our two datapoint clusters."
    return SVMResponse(w1=0.2, w2=-0.5, b=10, cost=0.5, story=story)

@app.post("/api/dt/step", response_model=DTResponse)
async def take_dt_step(state: DTState):
    story = "'The 20-Questions Detective' found the best split!"
    return DTResponse(splits=[{"axis": "x", "value": 50.0}], story=story)

@app.post("/api/pca/step", response_model=PCAResponse)
async def take_pca_step(state: PCAState):
    story = "'The Photographer' is twisting the camera axis to capture the longest shadow!"
    return PCAResponse(angle=45.0, variance=0.85, story=story)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
