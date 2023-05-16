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

    if(_.isUndefined(props.DendrosData[0]._id))
        props.DendrosData[0]._id = uuidv4()

    function saveSession(){
        // const fname = 'DendroX_session'
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
        const res = await db.put('sessions',{
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

    const addData = (parent_id:string, dendroData: DendroData) => {
        const ids = dendrosData.map(x => x.id)
        console.log(ids)
        if(!ids.includes(dendroData.id)){
        // place the child dendrogram right after its parent and siblings.
          let idx = ids.indexOf(parent_id)+1
          console.log('aaa',idx,dendroData.level)
          while(idx < dendrosData.length && 
            dendrosData[idx].level >= dendroData.level){
                idx ++;
            }
          console.log(idx)
          dendrosData.splice(idx,0,dendroData)
          setDendrosData([...dendrosData])
        }
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

    return <main className={styles.main2}>
        <div className='header'>DendroX</div>
        <div className='session'>
            <button onClick={e=>saveSession()}>Download</button>
            <button onClick={e=>saveIndexedDB()}>Save</button>
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