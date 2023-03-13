import { DendroData } from "./Interfaces";
import { Dispatch, SetStateAction } from "react";

interface InputProps{
    setDendrosData: Dispatch<SetStateAction<DendroData[]>>,
}

interface VizProps{
    DendrosData: DendroData[],
    // gc: number,
    // setGc: Dispatch<SetStateAction<number>>
}

export type {InputProps,VizProps}