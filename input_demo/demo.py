import seaborn as sb
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from get_json import get_json

def get_colors(gps,order=None):
    cl_arrs = np.array(sb.color_palette())
    if order is None:
        order = sorted(list(set(gps)))
    mp = dict(zip(order,cl_arrs))
    return [mp[gp] for gp in gps]


mat = pd.read_csv('mat.txt',sep='\t',index_col=0)
pts = [x.split('R')[0] for x in mat.columns]
clrs = get_colors(pts)


mat2 = mat.iloc[:50]
plt.figure()
g = sb.clustermap(mat2,z_score=0,cmap="vlag",col_colors=clrs,vmax=2,vmin=-2)
plt.savefig('images/py_image_50.png')

get_json(g,fname='nodes_row')
get_json(g,False,fname='nodes_col')

mat2 = mat.iloc[:2000]
plt.figure()
g = sb.clustermap(mat2,z_score=0,cmap="vlag",col_colors=clrs,vmax=2,vmin=-2)

plt.savefig('images/py_image_2k.png')

get_json(g,fname='nodes_row_2k')



plt.figure()
g = sb.clustermap(mat,z_score=0,cmap="vlag",col_colors=clrs,vmax=2,vmin=-2)

plt.savefig('images/py_image_10k.png')

get_json(g,fname='nodes_row_10k')