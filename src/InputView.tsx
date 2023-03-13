import { useState, useEffect, ChangeEvent, useRef, FormEvent } from 'react'
import { RxColumns,  RxRows} from "react-icons/rx"

import InputHelp from './comps/InputHelp'
import { InputProps } from './comps/Interfaces2'
import { DendroData } from './comps/Interfaces'
import styles from './styles/Home.module.css'
// import './Home.module.css'
import {  useNavigate } from "react-router-dom";


export default function InputView(props:InputProps){
  const navigate = useNavigate();

  const [dendrosDataInit, setDendrosDataInit]= useState<DendroData[]>()
  
  const [horizontalInit, setHorizontalInit] = useState(true)
  const [imgUrl, setImgUrl] = useState<string>()

  const setLayout = (e:FormEvent<HTMLSpanElement>)=>{
    const target = e.target as HTMLInputElement;
    target.value === 'horizontal' ? setHorizontalInit(true) 
      : setHorizontalInit(false)
  }

  const readFile = function(e: ChangeEvent<HTMLInputElement>){
    const file = e.target.files![0]
    new Response(file).json().then(json => {
      setDendrosDataInit([{
        'id':'whole',
        'mp':json}])
      })
}

  const readFigFile = function(e: ChangeEvent<HTMLInputElement>){
    const file = e.target.files![0]
    new Response(file).blob().then(blob =>{
      const url = URL.createObjectURL(blob)
      setImgUrl(url)
    })
  }

  const visualize = ()=>{
    dendrosDataInit![0].horizontal = horizontalInit
    dendrosDataInit![0].imgUrl = imgUrl
    props.setDendrosData(dendrosDataInit!)
    navigate('/viz')
  }

  const readExample = function(example: 'row' | 'col' | '2k'){
    let nodesFile: string, width: number, 
        height: number, horizontal: boolean

    const config = {
      row: {file:'nodes_row.json', img: 'py_image_50.png'},
      col: {file:'nodes_col.json', img: 'py_image_50.png'},
      '2k': {file:'nodes_row_2k.json', img: 'py_image_2k.png'},
    }

    if(['row','2k'].includes(example)){
      width = 300
      height = 500
      horizontal = true
    }else{
      width = 500
      height = 100
      horizontal = false
    }

    fetch('/dendrox-app/'+config[example].file).then(res=>{
      return res.json()
      // setData(res.json() as MP)
    }).then(json => {
      props.setDendrosData([{
        'id':'whole',
        'mp':json,
        'imgUrl':'/dendrox-app/'+config[example].img,
        clusterWidth: width,
        clusterHeight: height,
        horizontal: horizontal
      }])
      navigate('/viz')
    })
  }

  return (
    <main className={styles.main}>
        <div className='header'>DendroX</div>
        <div>
          <div className='input-row'>
            <div className='input-col'>
              <div className='input-label'>JSON file (required):</div>
              <input className='input-file' onChange={readFile} 
                type='file' accept='.json'/>
            </div>
            <div className='input-col'>
              <div className='input-label'>Image file (optional):</div>
              <input className='input-file' onChange={readFigFile} 
                type='file' accept='.png,.jpg'/>
            </div>
            
            
            {dendrosDataInit && <span className='example'>
                <button className='button-big' onClick={e => visualize()}>Visualize</button>
                <span className='radios' onChange={setLayout}>
                  <input type='radio' className='radio' name='layout' defaultChecked value='horizontal'></input>
                  <label>Horizontal<RxRows className='input-icon'/></label>
                  <input type='radio' className='radio' name='layout' value='vertical'></input>
                  <label>Vertical<RxColumns className='input-icon'/></label>
                </span>
            </span>}
            {!dendrosDataInit && <span className='example'>
              <button className='button-big' onClick={e => readExample('row')}>Horizontal example</button>
              <button className='button-big' onClick={e => readExample('col')}>Vertical example</button>
              <button className='button-big' onClick={e => readExample('2k')}>2k example</button>
            </span>}
          </div>

          <InputHelp></InputHelp>
        </div>
    </main>
  )
}