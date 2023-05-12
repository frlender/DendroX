

// interface BaseNode{
//     id: string    
//     name?: string
//     x: number
//     y: number
// }

// interface Leaf extends BaseNode{
//     leaf: true
// }

// interface Joint extends BaseNode{
//     leaf: false
//     link: string[]
//     joints: string[]
//     leaves: string[]
// }

// type NodeCustom = Joint | Leaf


interface NodeCustom{
    id: string
    leaf: boolean
    name: string
    x: number
    y: number
    // only non-leaf nodes have the following props
    link?: string[] 
    joints?: string[] // joints contains itself
    leaves?: string[]
}

interface MP{
    [key: string]: NodeCustom
}

interface NodeRender{
    initColorIndex?: number
    color?: string
    clicked?: boolean
    parentClicked?: boolean
}

interface RenderMP{
    [key: string]: NodeRender
}

interface DendroData{
    mp: MP
    id: string
    color?: string
    clusterWidth?: number
    clusterHeight?: number
    horizontal?: boolean
    imgUrl?: string
    // the following properties are for session save only.
    rp?: RenderMP
    currentImgUrl?:string
    imgSize?: number
}



interface DendroProps {
    data: DendroData
    gc: number
    addData: (a: DendroData) => void
    rmData: (a: string) => void
    hasDendro: (a: string) => boolean
    countData: () => number
    setGc: React.Dispatch<React.SetStateAction<number>>
}

interface CropProps{
    width: number
    height: number
    imgUrl: string
    horizontal: boolean
    addCurrentImgUrl: (a:string)=>void
    addImgSize: (a:number)=>void
}

// const node: NodeCustom = {'id':'a','name':'b','x':5,'y':6,'leaf':true,'joints':['a']}

export type {NodeCustom, MP, DendroProps, DendroData, RenderMP, CropProps}