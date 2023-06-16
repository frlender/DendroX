library(reticulate)
# after install reticulate package, please run
# install_miniconda() to install the necssary
# environment to run the following function.

get_json <- function(g,row=T,labels=NA, fname='nodes'){
# g: output object from pheatmap function
# row: whether to get json data of the row dendrogram or the column dendrogram
# labels: text labels in the order as in the input data to pheatmap
# fname: the file name of the output json file
  tree = g$tree_row
  if(!row){
    tree = g$tree_col
  }

  if(length(labels)==1 && is.na(labels)){
    labels = tree$labels
  }
  
  merge = tree$merge
  ct = dim(merge)[1]+1
  linkage = apply(merge,1,function(row){
    sapply(row,function(x){
      if(x<0){-x-1}
      else{x+ct-1}
    })
  })
  linkage = t(linkage)
  linkage = cbind(linkage,tree$height)
  reordered_labels = labels[tree$order]
  
  source_python("./get_json.py")
  get_json_raw(linkage,tree$order-1,reordered_labels,fname)
}
