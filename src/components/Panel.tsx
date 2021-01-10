// import { useContext } from 'react';
import { useContext } from 'react';
import { AppStorage } from "../App";


export const Panel = () => {
    const { targetDescription } = useContext(AppStorage);
        
    return (
        <>
        {console.log(`PANEL RENDERED`)}        
            <div className = "panel" data-name = 'panel'>
                <p>{targetDescription}</p>
            </div>        
        </>
    )
}

 
