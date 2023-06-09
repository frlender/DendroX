
export default function InputHelp(){
    const th = ['OS','Version','Chrome','Firefox','Microsoft Edge','Safari'].map(x=><td key={x}>{x}</td>)
    const bd = [['Linux','Debian 11',' 108.0.5359.94','not work*','n/a','n/a'],
                ['MacOS','Monterey',' 108.0.5359.98','107.0.1','n/a','15.4'],
                ['Windows','10',' 108.0.5359.73','107.0.1','107.0.1418.62','n/a']]
                .map(x=><tr key={x.join('')}>{x.map((y,i)=><td key={y+i}>{y}</td>)}</tr>)

    return <div className='help-container'>
        <div className="help-row">DendroX provides interactive visualization of a dendrogram where users can divide the dendrogram at any level and in any number of clusters. The labels of the selected clusters can be passed for functional analysis.  </div>
        <div className="help-row"><span className="row-head">JSON file:</span> It accepts two kinds of JSON files: </div>

        <div className='help-sub-row'> <span className="row-head">1)</span> An input file that describes a dendrogram in JSON format. It should be output from the R or Python get_json function provided by us. The function accept return value from the Python <a target='_blank' rel='noreferrer' href='https://seaborn.pydata.org/generated/seaborn.clustermap.html'>seaborn.clustermap</a> or the R <a target='_blank' rel='noreferrer' href='https://www.rdocumentation.org/packages/pheatmap/versions/1.0.12/topics/pheatmap'>pheatmap</a> function as argument. Demos and example input files could be found  <a target='_blank' rel='noreferrer' href='https://github.com/frlender/DendroX/tree/main/input_demo'>here</a>. R and Python packages that wrap the get_json function can be found  <a target='_blank' rel='noreferrer' href='https://github.com/frlender/dendrox-util'>here</a>.</div>
        
        <div className='help-sub-row'> <span className="row-head">2)</span> A session file that describes an array of dendrograms in JSON format. The session file is generated by clicking on the download session button in the visualization view of DendroX.</div>

        <div className="help-row"><span className="row-head">Image file:</span> An optional .png or .jpg image file that contains the heatmap associated with the dendrogram(s).</div>
        
        <div className='help-sub-row'> <span className="row-head">1)</span> If the input JSON file is generated by the get_json function, it is the image plotted by the <a target='_blank' rel='noreferrer' href='https://seaborn.pydata.org/generated/seaborn.clustermap.html'>clustermap</a> or the <a target='_blank' rel='noreferrer' href='https://www.rdocumentation.org/packages/pheatmap/versions/1.0.12/topics/pheatmap'>pheatmap</a> function. </div>

        <div className='help-sub-row'> <span className="row-head">2)</span> If the input JSON file is a session file, it should be the session image downloaded along with the JSON file.</div>

        <div className="help-row mt-1"><span className="row-head">L1000 example:</span> Example of a dendrogram that cluster 297 bioactive LINCS L1000 compounds. (Link to input files: <a target='_blank' rel='noreferrer' href='https://github.com/frlender/DendroX/blob/main/public/L1000.json'>json</a>, <a target='_blank' rel='noreferrer' href='https://github.com/frlender/DendroX/blob/main/public/L1000.png'>png</a>.) </div>

        <div className="help-row mt-neg"><span className="row-head">Genes example:</span> Example of a dendrogram that cluster a gene expression matrix with 600 genes. (Link to input files: <a target='_blank' rel='noreferrer' href='https://github.com/frlender/dendrox-app/blob/main/genes.json'>json</a>, <a target='_blank' rel='noreferrer' href='https://github.com/frlender/dendrox-app/blob/main/600_gene_cropped.png'>png</a>.)</div>
        
        <div className="help-row mt-neg"><span className="row-head">2k example:</span> Example of a dendrogram with 2,000 leaf nodes demonstrating the scalability of DendroX. (Link to input files: <a target='_blank' rel='noreferrer' href='https://github.com/frlender/dendrox-app/blob/main/nodes_row_2k.json'>json</a>, <a target='_blank' rel='noreferrer' href='https://github.com/frlender/dendrox-app/blob/main/py_image_2k.png'>png</a>.) </div>


        <div className="help-row help-extra2">After a JSON file in case 1) is submitted:</div>
        <div className="help-row mt-neg"><span className="row-head">Visualize:</span> Visualize the dendrogram described in the JSON file.</div>
        <div className="help-row mt-neg"><span className="row-head">Horizontal:</span> Visualize it as a row dendrogram. Default.</div>
        <div className="help-row mt-neg"><span className="row-head">Vertical:</span> Visualize it as a column dendrogram.</div>

        <div className="help-row help-extra2">After a JSON file in case 2) is submitted:</div>
        <div className="help-row mt-neg"><span className="row-head">Load session:</span> Load the session stored in the downloaded JSON file.</div>

        <div className="help-row mt-1">A session could be also saved in the browser's local storage by clicking on the save session button in the visualization view. After a session is saved, it could be retrived in the this view by clicking on the session link. The session links are located below the JSON input element and in the format of: <span className="session-format">Session name  [year/month/day hour:minute]</span></div>
       
        <div className="help-row help-extra3">Browser Compatibility:</div>
        {/* <div className="help-subtitle">Please use chrome for best experience.</div> */}
        <div className="help-row">
            <table>
                <thead>
                    <tr>
                        {th}
                    </tr>
                </thead>
                <tbody>
                        {bd}
                </tbody>
            </table>
            {/* <div className="help-annot">*Use Chrome for best experience.</div> */}
            <div className="help-annot">*The app is functional. But because of some default CSS settings we can not change, the dendrogram and the heatmap do not align well with each other.</div>
        
         <div className="help-row help-extra2">DendroX keep users&apos; data local and private. The input files are not saved or viewable on the hosting server. </div>
         <div className="help-row help-extra2">	This website is free and open to all users and there is no login requirement. </div>
        </div>
    </div>
}