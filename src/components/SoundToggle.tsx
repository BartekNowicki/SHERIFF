import { useContext } from 'react';
import { AppStorage } from "../App";
import { ReactComponent as SoundIconSvgComponent } from "../assets/sound.svg";

export const SoundToggle = () => {
    const { isSound, setIsSound } = useContext(AppStorage);
    return (
        <div className = {`${isSound ? "sound on" : "sound off"}`} onClick = {() => setIsSound(!isSound)}>
           <SoundIconSvgComponent/> 
        </div>
    )
}
