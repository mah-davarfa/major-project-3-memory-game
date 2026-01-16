import {useState, useEffect} from 'react'

export default function useLocalStorage(key,initialValue){

     const [storedValue,setStoredValue]=useState(()=>{
        try{
            const rowData= localStorage.getItem(key)
            return rowData? JSON.parse(rowData):initialValue

        }catch(err){
           console.error("Error reading localStorage:", err); 
           return initialValue;
            }
        })
        useEffect(()=>{
            try{
                localStorage.setItem(key, JSON.stringify(storedValue))
            }catch(err){
                console.error("Error saving to localStorage:", err);
            }
            
        },[key,storedValue])
      
      return [storedValue, setStoredValue];
}