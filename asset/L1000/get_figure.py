import pandas as pd
import seaborn as sb
import scipy as sp
import matplotlib.pyplot as plt
from dendrox import get_json

mf = pd.read_csv('297_compound_cd_mat.txt',sep='\t',index_col=0)

row_linkage = sp.cluster.hierarchy.linkage(mf.values.T,method='average',metric='cosine')
col_linkage = sp.cluster.hierarchy.linkage(mf.values,method='average',metric='correlation')


lf = -np.log10(np.abs(mf))
lf[mf<0] = lf[mf<0]*-1

g = sb.clustermap(mf.transpose(),row_linkage=row_linkage,col_linkage=col_linkage,
                  z_score=1,cmap="vlag",yticklabels=False,xticklabels=False,vmin=-2,vmax=2)
plt.savefig('l1000.png')

get_json(g,fname='l1000')