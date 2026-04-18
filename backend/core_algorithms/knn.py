import numpy as np

def compute_distances(points, target_point):
    """
    Computes Euclidean distances between a list of points and a target point.
    points: List of dicts with 'x', 'y', 'cluster_id' (or 'class_id')
    target_point: dict with 'x', 'y'
    Returns: List of points with an added 'distance' key.
    """
    pts = np.array([[p['x'], p['y']] for p in points])
    target = np.array([target_point['x'], target_point['y']])
    
    # Calculate Euclidean distance
    distances = np.linalg.norm(pts - target, axis=1)
    
    result = []
    for point, dist in zip(points, distances):
        new_point = point.copy()
        new_point['distance'] = float(dist)
        result.append(new_point)
        
    return result

def get_k_nearest(points_with_distances, k):
    """
    Sorts points by distance and returns the k nearest points.
    """
    sorted_points = sorted(points_with_distances, key=lambda p: p['distance'])
    return sorted_points[:k]

def assign_class(nearest_neighbors):
    """
    Assigns class based on majority vote of k nearest neighbors.
    Returns the predicted class and the counts.
    """
    class_counts = {}
    for neighbor in nearest_neighbors:
        c = neighbor.get('class_id', -1)
        class_counts[c] = class_counts.get(c, 0) + 1
    
    if not class_counts:
        return -1, {}
        
    predicted_class = max(class_counts, key=class_counts.get)
    return predicted_class, class_counts
