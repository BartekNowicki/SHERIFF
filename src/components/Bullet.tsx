import React from 'react';
import { ReactComponent as BulletSvgComponent } from "../assets/bullet.svg";

export const Bullet: React.FC<{nr: number, sheriffWidth: number, domNodeGetter(x: any): any}> = ({nr, sheriffWidth, domNodeGetter})  => {
    
    let bulletStyle = {
        width: `${sheriffWidth / 5}px`,
        bottom: `${sheriffWidth + 25}px`,
    };

    const sendNodeRefToParent = (element: HTMLDivElement | null) => domNodeGetter(element);
    
    return (
        <>
        {console.log(`BULLET ${nr} RENDERED`)} 
        
        <div ref={el => {sendNodeRefToParent(el)}} className="bulletDiv" style = {bulletStyle} data-type = 'bullet'>
            <BulletSvgComponent className="bulletSvg" />           
        </div>        
        </>
    )
}
