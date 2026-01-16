import { useContext} from "react";
import {PlayerContext} from "../Context/PlayerContext"

export const usePlayer=()=>{
    return useContext(PlayerContext)
}