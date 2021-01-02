import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as BulletSvgComponent } from "../assets/bullet.svg";

export const Bullet: React.FC<{nr: number, boardHeight: number, sheriffWidth: number, sheriffDeltaX: number}> = ({nr, boardHeight, sheriffWidth, sheriffDeltaX})  => {
    // const data = useRef({boardHeight: boardHeight, bulletWidth: 0, posY: 0});
    console.log(`BULLET ${nr} RENDERED ON BOARD ${boardHeight} HIGH`);

    const bulletStyle = {
        width: `${sheriffWidth / 5}px`,
        transform: `translateX(${sheriffDeltaX}px)`,
        bottom: `${sheriffWidth}px`,
    };
    
    return (
        <div className="bulletDiv" style = {bulletStyle}>
            <BulletSvgComponent className="bulletSvg" />           
        </div>
    )
}



