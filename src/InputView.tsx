import { useState, useEffect, ChangeEvent, useRef, FormEvent } from 'react'
import { RxColumns,  RxRows} from "react-icons/rx"

import InputHelp from './comps/InputHelp'
import { InputProps } from './comps/Interfaces2'
import { MP,DendroData } from './comps/Interfaces'
import styles from './styles/Home.module.css'
// import './Home.module.css'
import {  useNavigate } from "react-router-dom";
import * as _ from 'lodash'
import {openDB} from 'idb'

import {SessionItem} from './comps/Interfaces'


function get_date_string(d: Date){
  // keep only minutes
  return d.toLocaleString().split(':').slice(0,2).join(':')
}

export default function InputView(props:InputProps){
  const navigate = useNavigate();

  const [dendrosDataInit, setDendrosDataInit]= useState<DendroData[]>()
  
  const [horizontalInit, setHorizontalInit] = useState(true)
  const [imgUrl, setImgUrl] = useState<string>()
  const [sessItems,setSessItems] = useState<SessionItem[]>([])

  // openDB('dendrox',1,{
  //   upgrade(db){
  //       db.createObjectStore('sessions')
  //   }
  // }).then(db=>{
  //   db.getAllKeys('sessions').then(keys=>{

  //   })
  // })
  
  // const [isSession]

  const setLayout = (e:FormEvent<HTMLSpanElement>)=>{
    const target = e.target as HTMLInputElement;
    target.value === 'horizontal' ? setHorizontalInit(true) 
      : setHorizontalInit(false)
  }

  const setMp = function(dendrosData:DendroData[]){
        // Use the root mp for all DendroData
        const root = dendrosData[0]
        dendrosData.forEach((x,i)=>{
          if(i>0){
            const mp2:MP = {}
            const node = root.mp[x.id]
            node.joints!.concat(node.leaves!).forEach(d=>{
              mp2[d] = root.mp[d]
            })
            x.mp = mp2
          }
        })
  }

  const readFile = function(e: ChangeEvent<HTMLInputElement>){
    const file = e.target.files![0]
    new Response(file).json().then(json => {
      if(_.isArray(json)){
        json[0].imgUrl = undefined;
        setMp(json as DendroData[])
        setDendrosDataInit(json)
      }else
      setDendrosDataInit([{
        'id':'whole',
        'level': 0,
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
    if(_.isUndefined(dendrosDataInit![0].rp))
      dendrosDataInit![0].horizontal = horizontalInit
    dendrosDataInit![0].imgUrl = imgUrl
    props.setDendrosData(dendrosDataInit!)
    navigate('/viz')
  }

  const readExample = function(example: 'L1000' | 'gene' | '2k'){
    let nodesFile: string, width: number, 
        height: number, horizontal: boolean

    const config = {
      L1000:{file:'L1000.json',img:'L1000.png'},
      gene: {file:'genes.json', img: '600_gene_cropped.png'},
      col: {file:'nodes_col.json', img: 'py_image_50.png'},
      '2k': {file:'nodes_row_2k.json', img: 'py_image_2k.png'},
    }

    if(['L1000','gene','2k'].includes(example)){
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
      let dendrosData:DendroData[];

      if(['L1000','gene'].includes(example)){
        json[0].imgUrl = '/dendrox-app/'+config[example].img
        setMp(json as DendroData[])
        dendrosData = json
      }
      else
      dendrosData = [{
        'id':'whole',
        'mp':json,
        'level': 0,
        'imgUrl':'/dendrox-app/'+config[example].img,
        clusterWidth: width,
        clusterHeight: height,
        horizontal: horizontal
      }]

      props.setDendrosData(dendrosData)
      navigate('/viz')
    })
  }
  async function checkSessions(){
    const db = await openDB('dendrox',1,{
      upgrade(db){
          db.createObjectStore('sessions')
      }
    })
    // const tx = db.transaction('sessions')
    // // const arr = []
    // for await (const cursor of tx.store){
    //   console.log(cursor)
    // }
    // db.clear('sessions')
    const keys = await db.getAllKeys('sessions')
    async function get_formatted(k:IDBValidKey){
      const val = await db.get('sessions',k)
      return {'name': val.name as string,
        'time': get_date_string(val.time),
        '_time': val.time,
      'key': k}
    }
    const items = await Promise.all(keys.map(get_formatted))
    const items_sort = _.sortBy(items,x=>-x._time)
    // console.log(items_sort)
    setSessItems(items_sort)
  }

  async function removeSession(k:IDBValidKey){
    const db = await openDB('dendrox',1,{
      upgrade(db){
          db.createObjectStore('sessions')
      }
    })
    db.delete('sessions',k).then(x=>checkSessions())
  }

  useEffect(()=>{
    checkSessions()
    // console.log
  },[])

  async function enterSession(k:IDBValidKey){
    const db = await openDB('dendrox',1,{
      upgrade(db){
          db.createObjectStore('sessions')
      }
    })
    const val = await db.get('sessions',k)
    val.dendros[0].imgUrl = URL.createObjectURL(val.img)
    val.dendros[0].sessionName = val.name
    props.setDendrosData(val.dendros)
    navigate('/viz')
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
            
             {/* if .rp exists on dendrosDataInit, then the input is a session file */}
            {dendrosDataInit && dendrosDataInit[0].rp && <span className='example'>
              <button className='button-big' onClick={e => visualize()}>Load session</button>
            </span>}
            {dendrosDataInit && !dendrosDataInit[0].rp && <span className='example'>
                <button className='button-big' onClick={e => visualize()}>Visualize</button>
                <span className='radios' onChange={setLayout}>
                  <input type='radio' className='radio' name='layout' defaultChecked value='horizontal'></input>
                  <label>Horizontal<RxRows className='input-icon'/></label>
                  <input type='radio' className='radio' name='layout' value='vertical'></input>
                  <label>Vertical<RxColumns className='input-icon'/></label>
                </span>
            </span>}
            {!dendrosDataInit && <span className='example'>
              <button className='button-big' onClick={e => readExample('L1000')}>L1000 example</button>
              <button className='button-big' onClick={e => readExample('gene')}>Genes example</button>
              <button className='button-big' onClick={e => readExample('2k')}>2k example</button>
            </span>}
          </div>
         
          {sessItems.length > 0 && <div className='input-sessions'>
            {sessItems.map(x=>
              <div key={x.key as string}>
                <a onClick={e=>enterSession(x.key)}>{x.name} &nbsp;[{x.time}]</a>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick={e=>removeSession(x.key)}>remove</a>
                </div>)}
          </div>}
          <InputHelp></InputHelp>
        </div>
    </main>
  )
}