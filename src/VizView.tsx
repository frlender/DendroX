import { useState, useEffect, ChangeEvent, useRef, FormEvent } from 'react'

import Dendro from './comps/Dendro'
import DendroHelp from './comps/DendroHelp'

import { VizProps } from './comps/Interfaces2'
import { DendroData } from './comps/Interfaces'

import styles from './styles/Home.module.css'
import {  useNavigate } from "react-router-dom";
import { EditText, EditTextProps, onSaveProps } from 'react-edit-text'

import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import {openDB} from 'idb'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

export default function VizHolder(props:VizProps){
    const navigate = useNavigate()

    const noData = !_.has(props,'DendrosData') || _.isNull(props.DendrosData) 
        || props.DendrosData.length === 0

    useEffect(()=>{
        if(noData){
            navigate('/')
        }
    })
    
    return <div>
        {!noData && <VizView DendrosData={props.DendrosData}></VizView>}
    </div>
}


function VizView(props:VizProps){
    const [dendrosData, setDendrosData] = useState(props.DendrosData)
    // global update count
    const [gc, setGc] = useState<number>(0)
    const [sessName,setSessName] = useState<string>(
        props.DendrosData[0].sessionName?
        props.DendrosData[0].sessionName:'session')
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()
    
    if(_.isUndefined(props.DendrosData[0]._id))
        props.DendrosData[0]._id = uuidv4()

    console.log('vizView',dendrosData)
    function saveSession(){
        // const fname = 'DendroX_session'
        dendrosData[0].sessionName = sessName
        //TODO: mp is shared between all dendroData, consider only save one copy.
        // The code below, however, does not work.
        // dendrosData.forEach((e,i)=>{
        //     if(i>0)
        //     delete e['mp']
        // })
        const strx = JSON.stringify(dendrosData)
        const blob = new Blob([strx]);
        let element = document.createElement("a");
        element.download = `${sessName}.json`;
        element.href = window.URL.createObjectURL(blob);
        element.click();
        element.remove();

        if(dendrosData[0].currentImgUrl){
            element = document.createElement("a");
            element.download = `${sessName}.png`;
            element.href = dendrosData[0].currentImgUrl!;
            element.click();
            element.remove();
        }
    }

    async function saveIndexedDB(){
        const db = await openDB('dendrox',1,{
            upgrade(db){
                db.createObjectStore('sessions')
            }
        })
        // const keys = await db.getAllKeys('sessions')
        const id = props.DendrosData[0]._id as string
        const imgBlob = await fetch(dendrosData[0].currentImgUrl!).then(r=>r.blob())
        await db.put('sessions',{
            'dendros':dendrosData,
            'img':imgBlob,
            'time': new Date(),
            'name':sessName
        },id)
        // const res = await db.get('sessions',id)
        // console.log('saved',id)
        setSaved(true)
        setTimeout(()=>{
            setSaved(false)
        },2000)
    }

    function addData(parent_id:string, dendroData: DendroData){
        console.log(dendrosData)
        const ids = dendrosData.map(x => x.id)
        // console.log(ids)
        if(!ids.includes(dendroData.id)){
        // place the child dendrogram right after its parent and siblings.
          let idx = ids.indexOf(parent_id)+1
          console.log('aaa',idx,dendroData.level)
          while(idx < dendrosData.length && 
            dendrosData[idx].level >= dendroData.level){
                idx ++;
            }
        //   console.log(idx)
          dendrosData.splice(idx,0,dendroData)
          setDendrosData([...dendrosData])
        }
        console.log(dendrosData)
    }

    const rmData = (id:string) => {
        const dendrosDataNew = dendrosData.filter(x => x.id!==id)
        setDendrosData(dendrosDataNew)
    }

    const hasDendro = (id: string) => {
        return dendrosData.map(x => x.id).includes(id)
      }
    
    const countData = ()=>{
    return dendrosData.length
    }

    const createDendroEl = (data: DendroData) =>{
       
        return <Dendro key={data.id} data={data} 
        addData={addData} rmData={rmData} hasDendro={hasDendro}
        countData={countData} gc={gc} setGc={setGc}/>
    }

    const dendros = dendrosData.map( createDendroEl )
    const downloadSessionStr = dendrosData[0].imgUrl ? 'a JSON and a PNG files.' : 'a JSON file.'

    return <main className={styles.main2}>
        <div className='header' onClick={()=>navigate('/')}>DendroX</div>
        <div className='session'>
            <button data-tooltip-id='save-session' data-tooltip-html={`Download the current session as ${downloadSessionStr}`} onClick={e=>saveSession()}>Download</button>
            <button data-tooltip-id='save-session' data-tooltip-html="Save the current session in the browser's local storage." onClick={e=>saveIndexedDB()}>Save</button>
            <Tooltip id='save-session'></Tooltip>
            <EditText  style={{width: '80px'}} defaultValue={sessName} 
                        inline onSave={e=>setSessName(e.value)}></EditText>
             <div className='save-status'>
             { saved && <span>Saved !</span>}
            </div>
            {/* <div className='save-status'>Saved !</div> */}
        </div>
        <div className='dendros-div'>
            {dendros}
        </div>
        <DendroHelp></DendroHelp>
    </main>
}