import { useState, useEffect, ChangeEvent, useRef, FormEvent } from 'react'

import Dendro from './comps/Dendro'
import DendroHelp from './comps/DendroHelp'

import { VizProps } from './comps/Interfaces2'
import { DendroData } from './comps/Interfaces'

import styles from './styles/Home.module.css'
import {  useNavigate } from "react-router-dom";
import { EditText, EditTextProps, onSaveProps } from 'react-edit-text'

import * as _ from 'lodash'

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
    const [sessName,setSessName] = useState<string>('session')

    function saveSession(){
        // const fname = 'DendroX_session'
        const strx = JSON.stringify(dendrosData)
        const blob = new Blob([strx]);
        let element = document.createElement("a");
        element.download = `${sessName}.json`;
        element.href = window.URL.createObjectURL(blob);
        element.click();
        element.remove();

        element = document.createElement("a");
        element.download = `${sessName}.png`;
        element.href = dendrosData[0].currentImgUrl!;
        element.click();
        element.remove();
    }

    const addData = (dendroData: DendroData) => {
        const ids = dendrosData.map(x => x.id)
        if(!ids.includes(dendroData.id)){
          dendrosData.push(dendroData)
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
            <button onClick={e=>saveSession()}>Save</button>
            <EditText  style={{width: '80px'}} defaultValue={'session'} 
                        inline onSave={e=>setSessName(e.value)}></EditText>
        </div>
        <div className='dendros-div'>
            {dendros}
        </div>
        <DendroHelp></DendroHelp>
    </main>
}