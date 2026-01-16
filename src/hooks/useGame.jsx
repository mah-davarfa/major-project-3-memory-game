import { useContext} from "react";
import { GameContext } from "../Context/GameContext";

export const useGame=()=>{
    return useContext(GameContext)
}