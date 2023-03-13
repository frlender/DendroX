import { useState, useEffect, ChangeEvent, useRef, FormEvent } from 'react'

import Dendro from './comps/Dendro'
import DendroHelp from './comps/DendroHelp'

import { VizProps } from './comps/Interfaces2'
import { DendroData } from './comps/Interfaces'

import styles from './styles/Home.module.css'
import {  useNavigate } from "react-router-dom";

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
        <div className='dendros-div'>
            {dendros}
        </div>
        <DendroHelp></DendroHelp>
    </main>
}