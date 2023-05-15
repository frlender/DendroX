import ReactCrop from 'react-image-crop'
import { PixelCrop } from 'react-image-crop'
import { useState, useEffect, useRef} from 'react'
import 'react-image-crop/dist/ReactCrop.css'

import {imgPreview} from './ImgPreview'
import { CropProps } from './Interfaces'
import { RxCrop,RxReset} from "react-icons/rx";


export default function Crop(props:CropProps){
    
    
    const [crop, setCrop] = useState<PixelCrop>()
    const [srcUrl, setSrcUrl] = useState<string>(props.imgUrl)
    const imgRef = useRef<HTMLImageElement>(null)
    const urls = useRef<string[]>([]).current

    const formatNum = (num:number) => parseFloat(num.toFixed(2))
    // const lenInit = formatNum(props.horizontal?props.width:props.height)
    const lenInit = props.horizontal ? props.width: props.height
    const [len, setLen] = useState<number>(lenInit)
    let width, height;
    if(props.horizontal){
        width = len
        height = props.height
    }else{
        width = props.width
        height = len
    }

    const changeLen = (val:string) => {
        // e.target.value
        const val2 = formatNum(parseFloat(val))
        setLen(val2)
        props.addImgSize(val2)
    }


    // console.log(crop)
    function doCrop(){
        if(crop){
            imgPreview(imgRef.current!,crop,1,0).then(val=>{
                urls.push(srcUrl)
                setSrcUrl(val)
                props.addCurrentImgUrl(val)
                setCrop(undefined)
            })
        }
    }

    function undo(){
        const prevUrl = urls.pop()
        setSrcUrl(prevUrl!)
        props.addCurrentImgUrl(prevUrl!)
        setCrop(undefined)
    }

    const hv = props.horizontal ? 'h':'v'

    const ctrlPanel = <div className={`crop-ctrl-${hv}`}>
        <button onClick={e=>doCrop()} disabled={!crop}><RxCrop className='d-icon'/></button>
        <input type='number' className='input-wh' value={len} min='50' step='50'
        onChange={e=>{changeLen(e.target.value)}}/> 
        {urls.length > 0 && <button onClick={e => undo()}><RxReset className='d-icon'/></button>}
    </div>

    return <div className={`dendro-comp-${hv}`}>
            {props.horizontal && ctrlPanel}
            {/* style={props.horizontal? {}:{'display':'block'}} */}
            <ReactCrop crop={crop} onChange={c => setCrop(c)} >
                <img ref={imgRef}  src={srcUrl} 
                    style={{width:width, height:height}}/>
            </ReactCrop>
            {!props.horizontal && ctrlPanel}
        </div> 
}