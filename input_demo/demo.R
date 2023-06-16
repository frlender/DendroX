library(pheatmap)
source('./get_json.R')

mat = read.table('mat.txt',header=T,sep='\t')
mat2 = mat[1:20,2:39]
labels = mat[1:20,1]

png('./images/R_image.png')
g = pheatmap(mat2,labels_row=labels)
graphics.off()

get_json(g,labels=labels,fname='nodes_row_R')

# for column dendrogram
col_labels = colnames(mat2)
get_json(g,labels=col_labels,fname='nodes_col_R')