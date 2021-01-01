import React, { useState, useEffect } from 'react';
import './sheriff.scss';

export const Sheriff: React.FC<{status: number, wrapperWidth: number}> = ({status, wrapperWidth})  => {
    const [count, setcount] = useState<number>(status);
    const [deltaX, setDeltaX] = useState<number>(status);
    const [canMove, setcanMove] = useState<string>('canMoveOn');
    //canMoveOf will disable moving - not used yet, only set up in key press handler

    const getWidth = (selector: string) => {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error('ERROR READING ELEMENT!');
        }
        // console.log('HERE IS THE WIDTH: ', el.getBoundingClientRect().width);
        return el.getBoundingClientRect().width;     
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
            boardWidth = Math.round(getWidth('.board'));
            sheriffWidth = Math.round(boardWidth / 8);
            deltaIncrement = sheriffWidth;
            maxDeltaX = Math.round(boardWidth / 2 - sheriffWidth / 2);
        } else {
            console.warn('BOARD NOT DETECTED!');
        }
    }
    
    console.log('SHERIFF RENDERED');
    // console.log('CURRENT POSITION X: ', posX);
    // console.log('PROPS WRAPPER WIDTH: ', wrapperWidth);  
    
    let deltaIncrement = 0;
    let boardWidth = 0;
    let sheriffWidth = 0;
    let maxDeltaX = 0;
    performMeasurements();  
    
    // console.log('BOARD WIDTH WHEN SHERIFF (RE)RENDERED: ', boardWidth);
    // console.log('DELTA X: ', deltaX);
    // console.log('DELTA X abs: ', Math.abs(deltaX));
    // console.log('MAX DELTA X: ', maxDeltaX);  
        
    const moveLeft = (x: number) => setDeltaX(deltaX => Math.max(deltaX - x, -maxDeltaX));
    const moveRight = (x: number) => setDeltaX(deltaX => Math.min(deltaX + x, maxDeltaX));  
    
    const handleKeyPress = (e: KeyboardEvent) => {
        
        console.log('CLASSNAME INSIDE HANDLER: ', getClassNames('.sheriffDiv'));
        if (getClassNames('.sheriffDiv').includes('canMoveOff')) return

        const { key } = e;  //instead of e.key
        // console.log('key: ', key);        
            switch (key) {
                case 'ArrowLeft':
                    moveLeft(deltaIncrement); 
                break;
                case 'ArrowRight':
                    moveRight(deltaIncrement); 
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
    }, []);    

    useEffect(() => {
        performMeasurements();        
        console.log(`USEEFFECT ON KEY PRESS: ${canMove} dX: ${deltaX} mdX: ${maxDeltaX}`);        
    }, [handleKeyPress]);   

    // useEffect(() => {
    //     // console.log('USEEFFECT ON DELTAX CHANGE');        
    // }, [deltaX]);   

    const handleClick = () => {
        setcount(count => count + 1);
        console.log(`SHERIFF CLICKED, INCREASING CLICK COUNT TO: ${count}`);
    }   

    const sheriffStyle = {
        transform: `translateX(${deltaX}px)`,
        width: `${sheriffWidth}px`,
        height: `${sheriffWidth}px`,
        padding: `5px`
    };
    
    const sheriffClassNames = ['sheriffDiv', `${canMove}`];


    return (
        <div className={sheriffClassNames.join(' ')} style = {sheriffStyle} onClick = {() => handleClick()}>
          <p>{count} : {deltaX} : {deltaIncrement} : {canMove}</p>
        </div>
    )
}


