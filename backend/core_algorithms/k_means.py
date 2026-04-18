import math
from models.schemas import KMeansPoint, Centroid
from typing import List

def assign_clusters(points: List[KMeansPoint], centroids: List[Centroid]):
    """Assigns each point to the nearest centroid. Returns points and a boolean indicating if any assignment changed."""
    has_changed = False
    for p in points:
        min_dist = float('inf')
        closest_id = -1
        for c in centroids:
            dist = math.hypot(p.x - c.x, p.y - c.y)
            if dist < min_dist:
                min_dist = dist
                closest_id = c.id
        
        if p.cluster_id != closest_id:
            has_changed = True
            p.cluster_id = closest_id
            
    return points, has_changed

def update_centroids(points: List[KMeansPoint], centroids: List[Centroid]):
    """Moves each centroid to the mean of its assigned points."""
    for c in centroids:
        assigned_points = [p for p in points if p.cluster_id == c.id]
        if len(assigned_points) > 0:
            c.x = sum(p.x for p in assigned_points) / len(assigned_points)
            c.y = sum(p.y for p in assigned_points) / len(assigned_points)
    return centroids
