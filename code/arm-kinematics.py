import numpy as np
import matplotlib.pyplot as plt
import mpl_toolkits.mplot3d as plt3d
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import time

def A(a,d,alpha,theta): #Homogeneus Transformation 
    A = np.matrix([[np.cos(theta), -np.sin(theta)*np.cos(alpha), np.sin(theta)*np.sin(alpha), a*np.cos(theta)],
    [np.sin(theta), np.cos(theta)*np.cos(alpha) ,-np.cos(theta)*np.sin(alpha), a*np.sin(theta)],
    [0 , np.sin(alpha), np.cos(alpha), d], 
    [0 , 0, 0, 1]])
    # R = A[0:3,0:3]    
    # return A, R, o  #Homogeneus transformation, Rotation, New center
    return A

def plot_arm(T,plot):
    center = []
    ident = np.matrix([[1,0,0],[0,1,0],[0,0,1]])
    center.append(np.matrix([[0],[0],[0]]))
    plot.scatter(center[0][0,0],center[0][1,0],center[0][2,0], color  = 'black', marker = 's')
    for j in range(3):
        if j==0:
            col = 'blue' #x
            line = plt3d.art3d.Line3D((0,1),(0,0),(0,0), color = col)
        elif j==1:
            col = 'green' #y
            line = plt3d.art3d.Line3D((0,0),(0,1),(0,0), color = col)
        else:
            col = 'red' #z               
            line = plt3d.art3d.Line3D((0,0),(0,0),(0,1), color = col)
        plot.add_line(line)        

    for i in range(len(T)):
        center.append(T[i][0:3,3])
        plot.scatter(center[i+1][0,0],center[i+1][1,0],center[i+1][2,0], color  = 'black', marker = 's')
        line = plt3d.art3d.Line3D((center[i][0,0],center[i+1][0,0]),(center[i][1,0],center[i+1][1,0]),(center[i][2,0],center[i+1][2,0]), color = "orange")
        plot.add_line(line)
        for j in range(3):
            if j==0:
                col = 'blue' #x
            elif j==1:
                col = 'green' #y
            else:
                col = 'red' #z       
            distance = center[i+1]+T[i][0:3,j]            
            line = plt3d.art3d.Line3D((center[i+1][0,0],distance[0,0]),(center[i+1][1,0],distance[1,0]),(center[i+1][2,0],distance[2,0]), color = col)
            plot.add_line(line)        
    return plot

## DIRECT KINEMATICS 
a1 , a2, lb,  l1, l2, l3 ,l4, l5 = 18, -15, 46, 24, 52, 34, 60, 33
theta_1 , theta_2 , theta_3 , theta_4, theta_5 = 0, 0 , 0, 0, 0

a_1, d_1, alpha_1 = a1,l1+lb,np.pi/2
A_1 = A(a_1,d_1,alpha_1,theta_1)

a_2, d_2, alpha_2 = l2,a2,0
A_2 = A(a_2,d_2,alpha_2,theta_2)
T_2 = A_1*A_2

a_3, d_3, alpha_3 = l3,0,0
A_3 = A(a_3,d_3,alpha_3,theta_3)
T_3 = T_2*A_3

a_4, d_4, alpha_4 = l4,0,np.pi/2
A_4 = A(a_4,d_4,alpha_4,theta_4)
T_4 = T_3*A_4

a_5, d_5, alpha_5 = 0,l5,0
A_5 = A(a_5,d_5,alpha_5,theta_5)
T_5 = T_4*A_5  

x, y, z = T_5[0,3] , T_5[1,3], T_5[2,3]

print("X: %s , Y: %s , Z: %s" %(x,y,z))
## INVERSE KINEMATICS
phi = 0 ## theta_2 + theta_3 + theta_4

beta = np.arcsin(abs(a2)/(x**2+y**2)**0.5) #Max. elongation for the other orientation add PI to beta.
q_1 = np.arctan2(y,x) - beta #theta_1

z3 = z + l5*np.cos(phi) + l4*np.sin(phi) 
x3a = ((x**2 +y**2 - a2**2)**0.5 - l5*np.sin(phi) - l4*np.cos(phi))
q_3 = np.arccos( ((x3a -a1)**2 + (z3-l1-lb)**2 - l2**2 - l3**2)/(2*l2*l3) - 1e-10)
cosq_2 = ((l2+l3*np.cos(q_3))*(x3a -a1) + l3*np.sin(q_3)*(z3-l1-lb))/((x3a - a1)**2 + (z3 - l1 - lb)**2)
sinq_2 = ((l2+l3*np.cos(q_3))*(z3 - l1 - lb) + l3*np.sin(q_3)*(x3a - a1))/((x3a - a1)**2 + (z3 - l1 - lb)**2)
q_2 = np.arctan(sinq_2/cosq_2)
q_4 = phi - q_3 - q_2

print("Theta 1: %s , Theta 2: %s , Theta 3: %s , Theta 4: %s" %(q_1, q_2, q_3, q_3))

## PLOT ARM
# fig = plt.figure()
# ax = fig.add_subplot(111, projection = '3d', adjustable = 'box')
# ax.view_init(azim = 1000)
# ax = plot_arm([A_1,T_2,T_3,T_4,T_5],ax)   
# plt.show()