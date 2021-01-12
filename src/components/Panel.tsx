// import { useContext } from 'react';
import { useContext } from 'react';
import { AppStorage } from "../App";


export const Panel = () => {
    const { targetDescription, score } = useContext(AppStorage);
        
    return (
        <>
        {console.log(`PANEL RENDERED`)}        
            <div className = "panel" data-name = 'panel'>
                <span>{targetDescription}</span><span>{score}</span>
            </div>        
        </>
    )
}

 
