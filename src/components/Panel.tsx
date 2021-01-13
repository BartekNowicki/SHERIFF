import { useContext } from 'react';
import { AppStorage } from "../App";
import { SoundToggle } from './SoundToggle';


export const Panel = () => {
    const { targetDescription, score } = useContext(AppStorage);
        
    return (
        <>
        {console.log(`PANEL RENDERED`)}        
            <div className = "panel" data-name = 'panel'>
                <SoundToggle />
                <span>{targetDescription}</span><span>{score}</span>
            </div>        
        </>
    )
}

 
