def compute_cost(m: float, c: float, points: list) -> float:
    """Calculates the Mean Squared Error (MSE)."""
    total_error = 0
    N = float(len(points))
    for point in points:
        x = point.x
        y = point.y
        total_error += (y - (m * x + c)) ** 2
    return total_error / N

def gradient_descent_step(m_current: float, c_current: float, points: list, learning_rate: float):
    """Calculates the next step of gradient descent and returns the new slope and intercept."""
    m_gradient = 0
    c_gradient = 0
    N = float(len(points))
    
    for point in points:
        x = point.x
        y = point.y
        # Partial derivatives for m and c based on MSE function
        m_gradient += -(2/N) * x * (y - ((m_current * x) + c_current))
        c_gradient += -(2/N) * (y - ((m_current * x) + c_current))
        
    new_m = m_current - (learning_rate * m_gradient)
    new_c = c_current - (learning_rate * c_gradient)
    
    return new_m, new_c
