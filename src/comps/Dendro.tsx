import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ScaleLinear } from 'd3'
import { NodeCustom, MP, DendroProps, DendroData, RenderMP} from './Interfaces'
import { useColorStack, selectFactory, isGeneList } from './Lib'
import Crop from './Crop'
import { EditText, EditTextProps, onSaveProps } from 'react-edit-text'
import 'react-edit-text/dist/index.css';
import { RxColumns,  RxRows, RxEyeOpen, RxFileText, RxImage, RxReload, RxCross2,
    RxCross1,RxArrowDown,RxScissors,RxOpenInNewWindow} from "react-icons/rx";


export default function Dendro(props:DendroProps){
    const data = props.data
    const mp = data.mp
    const colorBase = 'black'
    const backgroundClr = 'white'
    const colorDefaultInit = data.color ? data.color : colorBase
    const [colorDefault, setColorDefault] = useState(colorDefaultInit)

    const horizontalInit = data.horizontal !== undefined ? data.horizontal : true
    // console.log(horizontalInit, data.horizontal)
    const [horizontal, setHorizontal] = useState<boolean>(horizontalInit!)

    const [resetFlag, setResetFlag] = useState<boolean>(false)
    const [showLabel, setShowLabel] = useState<boolean>(false)

    const [enrichrOpen,setEnrichrOpen] = useState<boolean>(false)

    const rpInit: RenderMP = {}
    const names = Object.values(mp).filter(x=>x.leaf).sort((a,b)=>a.x-b.x).map(x=>x.name)
    const keys = Object.keys(mp)
    let leaf_count = 0
    keys.forEach(key =>{
            rpInit[key] = {}
            if(mp[key].leaf) leaf_count+=1
        })
    const rp = useRef<RenderMP>(rpInit).current
    // // should not do the following to initialize rp!!!
    // // this will set rp[key] to undefined after every render
    // // Always create initial values before useRef or useState
    // Object.keys(mp).forEach(key =>{
    //     rp[key] = {}
    // })
    const widthInit = horizontalInit ? 300 : 500
    const heightInit = horizontalInit ? 500 : 100
    const [clusterWidth, setClusterWidth] = useState(
        data.clusterWidth ? data.clusterWidth : widthInit
    )
    const [clusterHeight, setClusterHeight] = useState(
        data.clusterHeight ? data.clusterHeight : heightInit
    )
    
    let unit:number, paddingh:number, paddingw:number, width:number, height: number
    if(horizontal){
        unit = clusterHeight/(leaf_count-1)
        paddingh = unit/2
        paddingw = unit
        width = clusterWidth + unit
        height = clusterHeight + unit
    }else{
        unit = clusterWidth/(leaf_count-1)
        paddingw = unit/2
        paddingh = unit
        width = clusterWidth + unit
        height = clusterHeight + unit
    }
    
    const pathsRef = useRef<d3.Selection<SVGPathElement, string, SVGGElement, unknown>>()
    const circlesRef = useRef<d3.Selection<SVGCircleElement, string, SVGGElement, unknown>>()
    const clickedCircleRef = useRef<d3.Selection<SVGCircleElement, string, SVGGElement, unknown>>()
    const mouseoverRef  = useRef<d3.Selection<SVGPathElement, string, SVGGElement, unknown>>()
    const posRef = useRef<(a:NodeCustom) => number>()

    const [clickedNode, setClickedNode] = useState<string>()
    

    const maxKey = d3.max(keys.map(d => parseInt(d)))!.toString()

    const [getInitColor, returnInitColor] = useColorStack(colorDefault)

    const [subCl,setSubCl] = useState<string>()
    // const returnSubCl

    const changeLayout = ()=>{
        setHorizontal(!horizontal)
        setClusterHeight(clusterWidth)
        setClusterWidth(clusterHeight)        
    }

    const subset = () => {
        const mp2: MP = {}
        const node = mp[clickedNode!]

        // joints and leaves properties are guaranteed as circles are 
        // only draw for non-leaf nodes
        node.joints!.concat(node.leaves!).forEach(d=>{
            mp2[d] = mp[d]
        })

        let ch:number, cw:number
        if(horizontal){
            ch =  node.leaves!.length/
                mp[maxKey].leaves!.length*clusterHeight
            cw = node.y/mp[maxKey].y*clusterWidth
        }else{
            ch = node.y/mp[maxKey].y*clusterHeight
            cw = node.leaves!.length/
            mp[maxKey].leaves!.length*clusterWidth
        }
        
        const dendroData: DendroData = {
            'id': clickedNode!,
            'mp': mp2,
            'clusterHeight': parseFloat(ch.toFixed(2)),
            'clusterWidth': parseFloat(cw.toFixed(2)),
            'horizontal': horizontal,
            'color': rp[clickedNode!].color
        }
        // console.log(dendroData)
        props.addData(dendroData)
    }

    function download(){
        const fname = data.id === 'whole' ? data.id : mp[data.id].name
        const leaves = Object.values(mp)
            .filter(val => val.leaf)
        // sort leaves as they show in the dendro
        leaves.sort((a,b)=>posRef.current!(a)-posRef.current!(b))
        const strx = leaves.map(val=>{
                return `${val.name}`
            }).join('\n')
        const blob = new Blob([strx]);
        const element = document.createElement("a");
        element.download = `${fname}.tsv`;
        element.href = window.URL.createObjectURL(blob);
        element.click();
        element.remove();
    }

    function downloadSVG(){
        const fname = data.id === 'whole' ? data.id : mp[data.id].name
        const svg = document.querySelector(`[name="${data.id}"]`)
        svg!.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        const svg_html = svg!.outerHTML;

        const blob = new Blob([svg_html.toString()]);
        const element = document.createElement("a");
        element.download = `${fname}.svg`;
        element.href = window.URL.createObjectURL(blob);
        element.click();
        element.remove();
    }

    const toggleEnrichr = ()=>{
        setEnrichrOpen(!enrichrOpen)
    }

    useEffect(()=>{
       
        const svg_container = d3.select(`[name="${data.id}"]`)
                .attr('width',width)
                .attr('height',height)
                .style('background',backgroundClr)

        svg_container.on('click',(e,d)=>{
            console.log('background click')

            setClickedNode(undefined)
            if(clickedCircleRef.current) 
            clickedCircleRef.current.attr('opacity',0)
            clickedCircleRef.current = undefined
        })

        const svg = svg_container
                    .append('g')
                    .attr('transform',`translate(${paddingw},${paddingh})`)
        

        
        const xs: number[] = []
        const ys: number[] = []
        keys.forEach(key => {
            const node = mp[key]
            xs.push(node.x)
            ys.push(node.y)
        })
        const [xmin, xmax] = [d3.min(xs), d3.max(xs)]
        const [ymin, ymax] = [d3.min(ys), d3.max(ys)]

        let xscale: ScaleLinear<number, number>, 
            yscale: ScaleLinear<number, number>, 
            x: (a: NodeCustom) => number, 
            y: (a: NodeCustom) => number;
        if(horizontal){
            xscale = d3.scaleLinear([clusterWidth,0])
                        .domain([ymin!,ymax!])
            yscale = d3.scaleLinear([0,clusterHeight])
                        .domain([xmin!,xmax!])
            x = (node: NodeCustom) => xscale(node.y)
            y = (node: NodeCustom) => yscale(node.x)
            posRef.current = y
        }else{
            xscale = d3.scaleLinear([0,clusterWidth])
                        .domain([xmin!,xmax!])
            yscale = d3.scaleLinear([clusterHeight,0])
                        .domain([ymin!,ymax!])
            x = (node: NodeCustom) => xscale(node.x)
            y = (node: NodeCustom) => yscale(node.y)
            posRef.current = x
        }
        
        
        const linkGenCustom = (d: string) => {
            // a non-leaf node
            const node = mp[d]
            // leaf nodes were filtered beforehand
            const node_left = mp[node.link![0]]
            const node_right = mp[node.link![1]]
            if(horizontal){
            return `M ${x(node_left)} ${y(node_left)}
                    H ${x(node)}
                    V ${y(node_right)}
                    H ${x(node_right)}`
            }else{
            return `M ${x(node_left)} ${y(node_left)}
                    V ${y(node)}
                    H ${x(node_right)}
                    V ${y(node_right)}`
            }
        }
        
        const sscale = d3.scaleLinear([0.5,2]).domain([1000,5])
                        .clamp(true)
        const strokeWidth = sscale(keys.length)
        const paths = svg.selectAll('path')
                    .data(keys.filter(key => !mp[key].leaf))
                    .enter()
                    .append('path')
                    .attr('d', d => linkGenCustom(d))
                    .style('fill', 'none')
                    .style('stroke', d => rp[d].color ? rp[d].color! : colorDefault)
                    .style('stroke-width',strokeWidth)
            // .each(d => {
            //   mp[d]['selection'] = d3.select(this as any) as any
            // })
        pathsRef.current = paths

        const circles = svg.selectAll("circle")
            .data(keys.filter(key => !mp[key].leaf))
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(mp[d])})
            .attr("cy", function(d) { return y(mp[d])})
            .attr("r", 4)
            .attr('fill',colorBase)
            .attr('opacity',function(d) { 
                if(rp[d].clicked && d === clickedNode){
                    return 1
                }else{
                    return 0
                }
            })
        
        circles.append("title")
               .text(function(d) { 
                    const text = mp[d].id === mp[d].name ? 
                        mp[d].id : `${mp[d].id} ${mp[d].name}`
                    return text})
        
        circlesRef.current = circles
        // circlesRef.current.attr('opacity',1)
        return ()=>{svg.remove()}
    },[clusterWidth,clusterHeight,horizontal]) // run only once for initialization

    // // handle click on blank area
    // useEffect(()=>{
        
    // },[clickedNode,clusterWidth,clusterHeight,horizontal])

    // handle click selection
    useEffect(()=>{
        // run for each update to get the most
        // recent value of clickedNode
        console.log('effect2')
        if(circlesRef.current){
            //  circlesRef,
            const [select, unselect, reselect] = 
                selectFactory(colorDefault, mp, rp,
               pathsRef,setClickedNode,setSubCl,
                clickedCircleRef,getInitColor,returnInitColor)

            circlesRef.current
            .on('mouseover',(e,d) =>{
                mouseoverRef.current = pathsRef.current!
                    .filter(d2=> mp[d]['joints']!.includes(d2 as string))
                    .style('stroke','red');
                    // cannot use this keyword in arrow function
                d3.select(e.currentTarget).attr('opacity',1)
            })
            .on('mouseout',(e,d) =>{
                // console.log(colorDefault)
                mouseoverRef.current!.style('stroke', d2 => rp[d2].color ? rp[d2].color! : colorDefault)
                if(d !== clickedNode) d3.select(e.currentTarget).attr('opacity',0)
            })
            .on('click',(e,d)=>{
                if(rp[d].parentClicked) return
                e.stopPropagation()

                switch(true){
                    case !rp[d].clicked:
                        select(e,d)
                        break
                    case d === clickedNode:
                        unselect(e,d)
                        break
                    default:
                        reselect(e,d)
                        break
                } // switch
            }) // .on('click')
        } // if(circlesRef.current)
    },[clickedNode,resetFlag,clusterWidth,clusterHeight,horizontal]) // end effect
    

    // customize the color of current selection
    useEffect(()=>{
        if(clickedNode && subCl !== rp[clickedNode].color){
            rp[clickedNode].color = subCl
            pathsRef.current!
                .filter(d2=> mp[clickedNode]['joints']!.includes(d2 as string))
                .style('stroke',subCl!)
                .each(d2 => {
                    const key = d2 as string
                    rp[key].color = subCl
                });
        }
    },[subCl])

    // reset
    useEffect(()=>{
        if(resetFlag){
            pathsRef.current && pathsRef.current.style('stroke',colorBase)
            setClickedNode(undefined)
            keys.forEach(key=>{
                if(rp[key].clicked) returnInitColor(rp[key].initColorIndex!)
                rp[key] = {}
            })
            if(clickedCircleRef.current) clickedCircleRef.current.attr('opacity',0)
            clickedCircleRef.current = undefined
            setColorDefault(colorBase)
            setResetFlag(false)
        }
    },[resetFlag])

    useEffect(()=>{
        if(circlesRef.current)
        circlesRef.current.selectChild().text(function(d) { 
                const text = mp[d].id === mp[d].name ? 
                    mp[d].id : `${mp[d].id} ${mp[d].name}`
                return text})
    },[props.gc])

    const onSave = (o:onSaveProps)=>{
        mp[data.id].name=o.value
        props.setGc(props.gc+1)
    }

    // const hdlSave = (o:onSaveProps)=>{
    //     mp[clickedNode!].name=o.value
    //     props.setGc(props.gc+1)
    // }

    const hv = horizontal ? 'h':'v'
    const mo = props.countData() === 1 ? '':'m'

    const enrichr = (enrichrType:'Enrichr'|'DrugEnrichr')=>{
        // copied from https://github.com/frlender/L1000CDS2/blob/0638df8b0e1fe5732e100e191266b733bd849eb5/public/scripts/services/services.js

        // var defaultOptions = {
    	// 	description: "",
    	// 	popup: false
  		// };

  		// if (typeof options.description == 'undefined')
    	// 	options.description = defaultOptions.description;
  		// if (typeof options.popup == 'undefined')
    	// 	options.popup = defaultOptions.popup;
  		// if (typeof options.list == 'undefined')
    	// 	alert('No genes defined.');

  		var form = document.createElement('form');
  		form.setAttribute('method', 'post');
  		form.setAttribute('action', `http://amp.pharm.mssm.edu/${enrichrType}/enrich`);
    	form.setAttribute('target', '_blank');
  		form.setAttribute('enctype', 'multipart/form-data');

  		var listField = document.createElement('input');
  		listField.setAttribute('type', 'hidden');
  		listField.setAttribute('name', 'list');
  		listField.setAttribute('value', names.join('\n'));
  		form.appendChild(listField);

  		var descField = document.createElement('input');
  		descField.setAttribute('type', 'hidden');
  		descField.setAttribute('name', 'description');
  		descField.setAttribute('value',data.id);
  		form.appendChild(descField);

  		document.body.appendChild(form);
  		form.submit();
  		document.body.removeChild(form);
    }

    return <div className={`dendro-div-${hv}${mo}`}>
        <div className={`dendro-comp-${hv}`}>
            <div className={`dendro-ctrl-${hv}`}>
                {data.id !== 'whole' && 
                    <span>
                        <EditText  style={{width: '50px'}} defaultValue={mp[data.id].name} 
                        inline onSave={onSave}></EditText>
                        <button onClick={(e)=>props.rmData(data.id)}><RxCross2 className='d-icon'/></button>
                    </span>}
                <button onClick={(e)=>setResetFlag(true)}> <RxReload className='d-icon'/> </button>
                {enrichrOpen && <div className='enrichr-panel'>
                    <div><button className='enrichr-panel-btn' onClick={e=>enrichr('Enrichr')}>Gene Symbol Enrich</button></div>
                    <div><button className='enrichr-panel-btn' onClick={e=>enrichr('DrugEnrichr')}>Drug Name Enrich</button></div>
                    <div><button className='enrichr-panel-btn' onClick={e=>toggleEnrichr()}>Close</button></div>
                </div>}
                <button onClick={(e)=>toggleEnrichr()} 
                    style={enrichrOpen?{'background': '#ffe3a9'}:{}}><RxOpenInNewWindow className='d-icon'/></button>
                <button onClick={(e)=>setShowLabel(!showLabel)}
                    style={showLabel?{'background': '#ffe3a9'}:{}}>
                    <RxEyeOpen className='d-icon'></RxEyeOpen>
                </button>
                <button onClick={(e)=>download()}>
                    <RxArrowDown className='d-icon'/>
                    <RxFileText className='d-icon'/>
                </button>
                <button onClick={(e)=>downloadSVG()}>
                    <RxArrowDown className='d-icon'/>
                    <RxImage className='d-icon'/>
                </button>
                <button onClick={e => changeLayout()}>
                    {horizontal ? <RxRows className='d-icon' /> : <RxColumns className='d-icon'/>}
                </button>
                <input type='number' className='input-wh' value={clusterWidth} min='50' step='50'
                onChange={e=>{setClusterWidth(parseFloat(e.target.value))}}/> 
                <input type='number' className='input-wh' value={clusterHeight} min='50' step='50'
                onChange={e=>{setClusterHeight(parseFloat(e.target.value))}}/> 
                {clickedNode && <span>
                    <button onClick={e=>subset()} disabled={props.hasDendro(clickedNode)}><RxScissors className='d-icon'/></button>
                    {/* <EditText  style={{width: '50px'}} defaultValue={mp[clickedNode].name}  
                        inline onSave={hdlSave}></EditText> */}
                    <span className='ctrl-info'>{mp[clickedNode].name}</span>
                    <input style={{height:'23px', width:'48px'}}  type='color' onChange={(e)=>setSubCl(e.target.value)} 
                    value={subCl}/>
                </span>}
            </div>
            <div className={`dendro-svg-div-${hv}`}>
                {showLabel && <textarea style={{height:`${height}px`}} readOnly={true} value={names.join('\n')}></textarea>}
                <svg name={data.id} className={`dendro-svg-${hv}`}></svg>
            </div>
        </div>
        {data.imgUrl && <Crop horizontal={horizontal} width={width} height={height} imgUrl={data.imgUrl}/>}
    </div> 
       
}