import React, { useState, useEffect } from 'react';
import './sheriff.scss';

export const Sheriff: React.FC<{status: number}> = ({status})  => {
    const [count, setcount] = useState<number>(status);
    const [posX, setposX] = useState<number>(status);
    // console.log('SHERIFF RENDER NR: ', count);
    // console.log('CURRENT POSITION X: ', posX);
    
    // const boardDiv = document.querySelector('.board');
    // console.log(boardDiv);
    // const boardWidth = boardDiv.getBoundingClientRect().width;
    // const boardWidth = 111;
    // console.log('BOARD WIDTH WHEN SHERIFF RENDERED: ', boardWidth);  
    
    const moveLeft = (x: number) =>  setposX(posX => posX - x);
    const moveRight = (x: number) => setposX(posX => posX + x);
    
    function handleKeyPress(e: any) {

        const { key } = e;  //instead of e.key
        const increment = 50;
        console.log('key: ', key);        
            switch (key) {
                case 'ArrowLeft':
                    moveLeft(increment); 
                break;
                case 'ArrowRight':
                    moveRight(increment); 
                break;
                      
                default:
                  console.log(`PRESS A FUNCTION KEY INSTEAD OF: ${key}...`);
              }      
    };

    useEffect(() => {        
        window.addEventListener('keyup', handleKeyPress);  
        console.log('CONTROLSLISTENER ASSIGNED');
        //cleanup to remove listener before re-rendering not necessary if empty dependency []
        //cleanup would look like so:
        //return window.removeEventListener('keyup', handleKeyPress);    
    }, []);    

    // useEffect(() => {
    //     console.log('CURRENT POS X: ', posX);        
    // }, []);   
    

    const handleClick = () => {
        setcount(count => count + 1);
        console.log('SHERIFF CLICKED, RE-RENDER REQUESTED ');
    }   

    const sheriffStyle = {
        transform: `translateX(${posX}px)`
    };



    return (
        <div className="sheriffDiv" style = {sheriffStyle} onClick = {() => handleClick()}>
          <p>{count} : {posX}</p>
        </div>
    )
}


