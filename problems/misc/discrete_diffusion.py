from math import sin, e
import numpy as np

# for testing purposes
def source(x,t):
    return np.sin(x)*np.exp(-t)

# for testing purposes
def initial(x):
    return np.exp(-np.power(x,2))

def diffusion(a, b, M, tau, N, f=source, g=initial):
    # step size
    h = (b-a)/M
    
    # compute constants c and d from the above calculations
    c = tau / h**2
    d = 1 - 2*tau / h**2
    
    # start with some initial
    x = np.linspace(a,b,M)
    result_vecs = [initial(x)]
    
    for n in range(N):
        # Compute the next timestep's vector using matrix multiplication
        # and vector addition as described above
        t = tau*n
        
        # Constrcut offset diagonal matrices
        main_diag = np.diag(np.full(M,d), 0)
        off_diag_1 = np.diag(np.full(M-1,c), -1)
        off_diag_2 = np.diag(np.full(M-1,c), 1)
        
        # Construct main matrix as the sum of offset diagonal matrices
        matrix = main_diag + off_diag_1 + off_diag_2

        # Construct the vector of source terms
        source_vec = source(x, t)

        # Finally, bring it all together
        result_vecs.append(np.dot(matrix, result_vecs[-1]) + source_vec)

    return result_vecs