import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as PlaneSvgComponent } from "../assets/plane.svg";
import { Bullet } from './Bullet';

import './bullet.scss';

export const Sheriff: React.FC<{status: number, wrapperWidth: number}> = ({status, wrapperWidth})  => {
    const [sheriffClickCount, setSheriffClickCount] = useState<number>(status);
    const data = useRef({boardWidth: 0, boardHeight: 0, sheriffWidth: 0, deltaIncrement: 0, maxDeltaX: 0, bulletCount: 0});
    const [deltaX, setDeltaX] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [canMove, setcanMove] = useState<string>('canMoveOn');
    //canMoveOf will disable moving - not used yet, only set up in key press handler

    const [bulletsArray, setBulletsArray] = useState<Array<JSX.Element>>([]);
    
    // const [bulletsArray, setBulletsArray] = useState<Array<JSX.Element>>([<Bullet key = {data.current.bulletCount} nr = {data.current.bulletCount} boardHeight = {data.current.boardHeight} sheriffWidth = {data.current.sheriffWidth} sheriffDeltaX = {deltaX}/>]);
    
    const getDimentions = (selector: string) => {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error('ERROR READING ELEMENT!');
        }
        // console.log('HERE IS THE WIDTH: ', el.getBoundingClientRect().width);
        return {width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height};     
    }
    
    const getClassNames = (selector: string) => {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error('ERROR READING ELEMENT!');
        }
        return el.className;   
    }

    const performMeasurements = () => {        
        if (document.querySelector('.board')) {
            const boardWidth = Math.round(getDimentions('.board').width);
            data.current.boardWidth = boardWidth;
            const boardHeight = Math.round(getDimentions('.board').height);
            data.current.boardHeight = boardHeight;
            const sheriffWidth = Math.round(boardWidth / 8);
            data.current.sheriffWidth = sheriffWidth;
            const deltaIncrement = sheriffWidth;
            data.current.deltaIncrement = deltaIncrement;
            const maxDeltaX = Math.round(boardWidth / 2 - sheriffWidth / 2);
            data.current.maxDeltaX = maxDeltaX;
        } else {
            console.warn('BOARD NOT DETECTED!');
        }
        
    }
    
    console.log('SHERIFF RENDERED');
        
    const moveLeft = (x: number) => setDeltaX(deltaX => Math.max(deltaX - x, -data.current.maxDeltaX));
    const moveRight = (x: number) => setDeltaX(deltaX => Math.min(deltaX + x, data.current.maxDeltaX));  

    const shoot = () => {
        const newBullet = <Bullet key = {data.current.bulletCount} nr = {data.current.bulletCount} boardHeight = {data.current.boardHeight} sheriffWidth = {data.current.sheriffWidth} sheriffDeltaX = {deltaX}/>

        // const [bulletsArray, setBulletsArray] = useState<Array<JSX.Element>>([<Bullet key = {data.current.bulletCount} nr = {data.current.bulletCount} boardHeight = {data.current.boardHeight} sheriffWidth = {data.current.sheriffWidth} sheriffDeltaX = {deltaX}/>]);
        
        setBulletsArray([...bulletsArray, newBullet]);
        console.log('BULLETS ARRAY: ', bulletsArray);
        data.current.bulletCount = data.current.bulletCount +1;
        console.log('BULLET COUNT: ', data.current.bulletCount);
    }
    
    const handleKeyPress = (e: KeyboardEvent) => {
        
        // console.log('CLASSNAME INSIDE HANDLER: ', getClassNames('.sheriffDiv'));
        if (getClassNames('.sheriffDiv').includes('canMoveOff')) return

        const { key } = e;  //instead of e.key
        // console.log('key: ', key);        
            switch (key) {
                case 'ArrowLeft':
                    moveLeft(data.current.deltaIncrement); 
                break;
                case 'ArrowRight':
                    moveRight(data.current.deltaIncrement); 
                break;
                case ' ': //SPACE BAR
                    shoot(); 
                break;
                      
                default:
                  console.log(`PRESS A FUNCTION KEY INSTEAD OF: ${key}...`);
              }      
    };

    useEffect(() => {        
        window.addEventListener('keyup', (e) => handleKeyPress(e));  
        // console.log('CONTROLSLISTENER ASSIGNED');
        //cleanup to remove listener before re-rendering not necessary if empty dependency []
        //cleanup would look like so:
        //return window.removeEventListener('keyup', handleKeyPress);
        performMeasurements();       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    

    useEffect(() => {        
        console.log(`USEEFFECT ON KEY PRESS: ${canMove} dX: ${deltaX}`);        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleKeyPress]);   

    // useEffect(() => {
    //     // console.log('USEEFFECT ON DELTAX CHANGE');        
    // }, [deltaX]); 

    useEffect(() => {
        console.log('USEEFFECT ON BULLETSARRAY CHANGE');        
    }, [bulletsArray]); 
    
    

    const handleClick = () => {
        setSheriffClickCount(sheriffClickCount => sheriffClickCount + 1);
        console.log(`SHERIFF CLICKED, INCREASING CLICK COUNT TO: ${sheriffClickCount}`);
    }   

    const sheriffStyle = {
        transform: `translateX(${deltaX}px)`,
        width: `${data.current.sheriffWidth}px`,
        height: `${data.current.sheriffWidth}px`,
        padding: `1px`,
    };
    
    const sheriffClassNames = ['sheriffDiv', `${canMove}`];
    
    return (
        <>
        {bulletsArray}
        <div className={sheriffClassNames.join(' ')} style = {sheriffStyle} onClick = {() => handleClick()}> <PlaneSvgComponent className="planeSvg" />           
        </div>
        </>
    )
}



