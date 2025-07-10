import numpy as np
from scipy.optimize import minimize


# Load Covariance Matrix
# covariance_matrix = np.load('data/covariance_matrix.npy')

# Risk-Free Rate
risk_free_rate = 0.07


# Optimize the allocation to maximize the Sharpe ratio
def optimize_allocation(current_allocation, propensity_scores, expected_returns):
    """
    Optimize the allocation to maximize the Sharpe ratio.
    Asset orders: [Deposito, SB, RD]

    Parameters:
    current_allocation (array-like): Current allocation of assets.
    propensity_scores (array-like): Scores indicating preference for each asset.
    expected_returns (array-like): Expected returns for each asset.
    covariance_matrix (numpy.ndarray): Covariance matrix of asset returns.
    risk_free_rate (float): The risk-free rate of return.

    Returns:
    numpy.ndarray: Optimized allocation of assets.
    """
    adjusted_returns = adjust_expected_returns(propensity_scores, expected_returns)
    
    constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})  # Sum of weights = 1
    bounds = tuple((0, 1) for _ in range(len(current_allocation)))  # Weights between 0 and 1
    
    result = minimize(
        sharpe_ratio,
        current_allocation,
        args=(adjusted_returns, covariance_matrix, risk_free_rate),
        method='SLSQP',
        bounds=bounds,
        constraints=constraints
    )
    return result.x, adjusted_returns


# Adjust expected returns based on propensity scores
def adjust_expected_returns(propensity_scores, expected_returns, alpha=0.1):
    """
    Adjust expected returns based on propensity scores.

    Parameters:
    propensity_scores (array-like): Scores indicating preference for each asset.
    expected_returns (array-like): Original expected returns for each asset.
    alpha (float, optional): Adjustment factor, default is 0.1. Higher values
                             increase the impact of propensity scores.

    Returns:
    numpy.ndarray: Adjusted expected returns for each asset.
    """
    propensity_scores = np.array(propensity_scores)
    expected_returns = np.array(expected_returns)
    default_propensity = np.ones(len(propensity_scores))
    adjusted_expected_returns = (default_propensity + alpha * propensity_scores) * expected_returns

    return adjusted_expected_returns


# Function to maximize the Sharpe ratio for the portfolio
def sharpe_ratio(current_allocation, expected_returns, covariance_matrix, risk_free_rate):
    """
    Calculate the Sharpe ratio for a given portfolio.

    Parameters:
    current_allocation (numpy.ndarray): Array of portfolio current_allocation.
    expected_returns (numpy.ndarray): Array of expected returns for each asset.
    covariance_matrix (numpy.ndarray): Covariance matrix of asset returns.
    risk_free_rate (float): The risk-free rate of return.

    Returns:
    float: The negative Sharpe ratio (for minimization in optimization).
    """
    portfolio_return = np.dot(current_allocation, expected_returns)
    portfolio_risk = np.sqrt(np.dot(current_allocation.T, np.dot(covariance_matrix, current_allocation)))
    return -(portfolio_return - risk_free_rate) / portfolio_risk  # Negative for minimization