import { RxColumns,  RxRows, RxEyeOpen, RxFileText, RxImage, RxReload, RxCross2,
    RxCross1,RxArrowDown,RxScissors,RxOpenInNewWindow, RxCrop, RxReset} from "react-icons/rx";
import { EditText } from 'react-edit-text'


export default function DendroHelp(){
    return <div className="help-container">
         <div className="help-row">Mouse over a non-leaf node in the dendrogram to highlight a cluster. Click on a non-leaf node to select a cluster. Click again to unselect it. Click on any white space to unfocus a selected non-leaf node. The app will automatically assign a color to a clicked cluster. If a cluster heatmap image is provided, drag your mouse over the heatmap area to select it and click the crop button to crop. The cropped heatmap should be aligned with the dendrogram.</div>

        <div className="help-row"><button><RxReload className='d-icon'/></button> :  The reset button. Remove any selection on the dendrogram and reset it to the initial state. </div>

        <div className="help-row"><button><RxOpenInNewWindow className='d-icon'/></button> : The Enichr button. Pass the labels of the leaf nodes as gene symbols to the <a target='_blank' rel='noreferrer' href='https://maayanlab.cloud/Enrichr/'>Enrichr app</a> for gene set enrichment analysis. DendroX will automatically detect if the labels are gene symbols. If they are not, this button will not show. <span className="row-head">Caution! : the Enrichr app may save your gene list in its server.</span> Enrichr requires a <a target='_blank' rel='noreferrer' href='https://maayanlab.cloud/Enrichr/help#terms'>license</a> for commercial uses. Users could copy the gene symbols from the text box opened by the view button and paste them into another functional annotation app they prefer. </div>

        <div className="help-row"><button>
                    <RxEyeOpen className='d-icon'></RxEyeOpen>
                </button> : The view button. View the the labels of the leaf nodes in a text box on the left. Click again to close the box. </div>

        <div className="help-row"><button>
                    <RxArrowDown className='d-icon'/>
                    <RxFileText className='d-icon'/>
                </button> :  The label download button. Download the labels as a newline character delimited text file. The file name will be the name of the root node. &quot;whole&quot; is the default name for the input dendrogram.</div>

        <div className="help-row"><button >
                    <RxArrowDown className='d-icon'/>
                    <RxImage className='d-icon'/>
                </button> : The SVG download button. Download the dendrogram as a SVG file edittable in Adobe Illustrator and Inkscape. The file name will be the name of the root node. &quot;whole&quot; is the default name for the input dendrogram. </div>

       

        <div className="help-row"> <button><RxRows className='d-icon'/>
                </button> / <button><RxColumns className='d-icon'/>
                </button> : The layout switch button. Switch the dendrogram between the row and the column layout.</div>
        

        
        <div className="help-row"> <input type='number' className='input-wh' value={300} min='50' step='50'/> 
                <input type='number' className='input-wh' value={500} min='50' step='50'/>  : Control the width and height of the dendrogram. 
        </div>

        <div className="help-row help-extra"> If the input includes an optional image file, the following elements will appear above the image: </div>

        <div className="help-row"><button><RxCrop className='d-icon'/></button> : The crop button. Click to crop after an area is selected in the image. </div>

        <div className="help-row"><input type='number' className='input-wh' value={550} min='50' step='50'/>  : Control the width or height of the image depending on whether the associated dendrogram is a row or column dendrogram. </div>

        <div className="help-row help-extra">After a non-leaf node is clicked, the following elements will appear:</div>

        <div className="help-row"><button><RxScissors className='d-icon'/></button> : The cut button. Create a new dendrogram for the selected cluster. It is disabled after creation of the new dendrogram.</div>

        <div className="help-row"><span className='ctrl-info'>###</span> : The name of the clicked non-leaf node. It is not edittable.</div>

        <div className="help-row"><input style={{height:'23px', width:'48px'}}  type='color' value={'#1f77b4'}/> : The color input box. Click to change the automatically assigned color of the selected cluster.</div>

        <div className="help-row help-extra">After the cut button is clicked and a new dendrogram is created, the following elements will appear above the child dendrogram:</div>

        <div className="help-row"><EditText  style={{width: '50px'}} defaultValue={'###'} inline></EditText> : The name of the child dendrogram. It is edittable. Defaults to the name of the root node. Any change to the name will be memorized in the parent dendrogram.</div>

        <div className="help-row"> <button><RxCross2 className='d-icon'/></button> : The close button. Close the child dendrogram. </div>
        
        <div className="help-row help-extra">After the image is cropped, the following button will appear:</div>

        <div className="help-row"><button><RxReset className='d-icon'/></button> : The undo button. Undo the crop action. </div>
    </div>
}