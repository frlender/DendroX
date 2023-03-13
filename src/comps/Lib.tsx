import { useState, useEffect } from 'react'
import * as d3 from 'd3';
import { NodeCustom, MP, DendroProps, DendroData, RenderMP} from './Interfaces'


const isLetter = function(x:string){
    return x.length === 1 && ( (x >= 'a' && x <= 'z') || 
        (x >= 'A' && x <= 'Z'))
}

const isNumChar = function(x:string){
    return x.length === 1 && (x >= '0' && x <= '9') 
}

const isGeneSymbol  = function(str:string){
    let i = 0
    let numCount = 0
    let letterCount = 0
    let charSet = new Set()
    if(str.length > 12) return false

    for(let c of str){
        switch(true){
            case isLetter(c):
                charSet.add(c)
                letterCount += 1
                break
            case isNumChar(c):
                numCount+=1
                break 
            default:
                return false
        }

        if(numCount > 3) return false
        i+=1
    }
    if(charSet.size/letterCount < .5) return false
    
    return true
}

const isGeneList = function(lst:string[]){
    let count = 0
    lst.forEach(e=>{
        if(isGeneSymbol(e)) count += 1
    })
    return count/lst.length > .9
}


function useColorStack(colorDefault: string = '', repeat: number = 5)
    :[()=>[number,string],(a: number)=>void]{
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#e377c2', '#9467bd', 
                '#8c564b', '#d62728', '#cab2d6', '#bcbd22', '#17becf',
                '#a6cee3', '#b2df8a'].filter(cl => cl!==colorDefault)
    const [indices, setIndices] = useState<number[]>(d3.range(colors.length*repeat))
    const getInitColor = (): [number,string] =>{
        // initial color for selections
        if(indices.length < 1){
            throw `colors exhausted! Support at most ${colors.length*repeat} selections`
        }
        const index = indices.shift() as number
        const color = colors[index % colors.length]
        setIndices([...indices])
        return [index,color]
    }
    const returnInitColor = (index: number) =>{
        indices.unshift(index)
        // indices.sort()
        setIndices([...indices])
    }
    return [getInitColor, returnInitColor]
}

function selectFactory(
    colorDefault: string,
    mp: MP,
    rp: RenderMP,
    // circlesRef: React.MutableRefObject<d3.Selection<SVGCircleElement, string, SVGGElement, unknown> | undefined>,
    pathsRef: React.MutableRefObject<d3.Selection<SVGPathElement, string, SVGGElement, unknown> | undefined>,
    setClickedNode: React.Dispatch<React.SetStateAction<string | undefined>>,
    setSubCl: React.Dispatch<React.SetStateAction<string | undefined>>,
    clickedCircleRef: React.MutableRefObject<d3.Selection<SVGCircleElement, string, SVGGElement, unknown> | undefined>,
    getInitColor: ()=>[number,string],
    returnInitColor: (a: number)=>void ){
    
    function select(e:any,d:string){
        rp[d].clicked = true
        const [initColorIndex, initColor] = getInitColor()
        rp[d].initColorIndex = initColorIndex
        setClickedNode(d)
        setSubCl(initColor)
        if(clickedCircleRef.current) clickedCircleRef.current.attr('opacity',0)
        clickedCircleRef.current = d3.select(e.currentTarget) as any
        pathsRef.current!
            .filter(d2 => mp[d]['joints']!.includes(d2 as string))
            .style('stroke',initColor)
            .each(d2 => {
                const key = d2 as string
                rp[key].color = initColor
                if(d2 !== d){
                    rp[key].parentClicked = true
                    if(rp[key].clicked){
                        returnInitColor(rp[key].initColorIndex!)
                    }
                    rp[key].clicked = false
                }
            });
    }
    function unselect(e:any,d:string){
        setClickedNode(undefined)
        rp[d].clicked = false
        returnInitColor(rp[d].initColorIndex!)
        rp[d].initColorIndex = undefined

        pathsRef.current!
            .filter(d2=> mp[d]['joints']!.includes(d2 as string))
            .style('stroke',colorDefault)
            .each(d2 => {
                rp[d2 as string].color = colorDefault
                rp[d2 as string].parentClicked = false
            });
        clickedCircleRef.current = undefined
    }
    function reselect(e:any,d:string){
        setClickedNode(d)
        setSubCl(rp[d].color!)
        if(clickedCircleRef.current) clickedCircleRef.current.attr('opacity',0)
        clickedCircleRef.current = d3.select(e.currentTarget) as any
    }
    return [select, unselect, reselect]
}

export {isGeneList, useColorStack, selectFactory}