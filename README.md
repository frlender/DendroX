# DendroX


Multi-level multi-cluster selections in a dendrogram

https://frlender.github.io/dendrox-app/

## Introduction

 Cluster heatmaps are widely used in bioinformatics and other fields to uncover clustering patterns in data matrices. Most cluster heatmap packages provide utility functions to divide the dendrograms at a certain level to obtain clusters, but it is often difficult to identify the most appropriate cut in the dendrogram to obtain the clusters seen in the heatmap. Multiple cuts are required if clusters locate at different levels in the dendrogram. To address this issue, we developed DendroX, a web app that provides interactive visualization of a dendrogram where users can divide the dendrogram at any level and in any number of clusters and pass the labels of the divided clusters for functional analysis.



![image](https://github.com/frlender/dendrox/blob/main/asset/Figure_2.jpg)

## Citation

[Feiling Feng, Qiaonan Duan, Xiaoqing Jiang, Xiaoming Kao & Dadong Zhang. DendroX: multi-level multi-cluster selection in dendrograms. *BMC Genomics 25, 134 (2024)*.](https://bmcgenomics.biomedcentral.com/articles/10.1186/s12864-024-10048-0
)


## Resource

R and Python packages that wrap the get_json function to generate input files:

https://github.com/frlender/dendrox-util

A graphic user interface to generate input files:

https://github.com/frlender/dendrox-cluster

The data sets and code that replicate the results in this article are available on Github at the following URLs:

https://github.com/frlender/DendroX/tree/main/public

https://github.com/frlender/DendroX/tree/main/input_demo

https://github.com/frlender/DendroX/tree/main/asset.
## License

The source code for the site is licensed under the MIT license.
