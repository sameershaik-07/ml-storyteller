import numpy as np

def sigmoid(z):
    # Clip to avoid overflow
    z = np.clip(z, -250, 250)
    return 1.0 / (1.0 + np.exp(-z))

def compute_cost(w1, w2, b, points):
    if not points: return 0.0
    X1 = np.array([p['x'] for p in points])
    X2 = np.array([p['y'] for p in points])
    Y = np.array([p['class_id'] for p in points])
    
    Z = w1 * X1 + w2 * X2 + b
    A = sigmoid(Z)
    
    # Binary Cross Entropy
    epsilon = 1e-15
    cost = -np.mean(Y * np.log(A + epsilon) + (1 - Y) * np.log(1 - A + epsilon))
    return float(cost)

def gradient_descent_step(w1, w2, b, points, learning_rate):
    if not points: return w1, w2, b
    X1 = np.array([p['x'] for p in points])
    X2 = np.array([p['y'] for p in points])
    Y = np.array([p['class_id'] for p in points])
    m_len = len(points)
    
    Z = w1 * X1 + w2 * X2 + b
    A = sigmoid(Z)
    dz = A - Y
    
    dw1 = np.sum(dz * X1) / m_len
    dw2 = np.sum(dz * X2) / m_len
    db = np.sum(dz) / m_len
    
    new_w1 = w1 - learning_rate * dw1
    new_w2 = w2 - learning_rate * dw2
    new_b = b - learning_rate * db
    
    return float(new_w1), float(new_w2), float(new_b)
