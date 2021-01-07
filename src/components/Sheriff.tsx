import gsap from 'gsap';
import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as PlaneSvgComponent } from "../assets/plane.svg";
import { Bullet } from './Bullet';

import './bullet.scss';

export const Sheriff: React.FC<{
    status: number, 
    wrapperWidth: number}> = ({status, wrapperWidth})  => {

    const [sheriffClickCount, setSheriffClickCount] = useState<number>(status);

    const data = useRef({boardWidth: 0, boardHeight: 0, sheriffWidth: 0, deltaIncrement: 0, deltaX: 0, maxDeltaX: 0, bulletCount: 0, inMotionLeft: false, inMotionRight: false});
    
    // UNUSED const [deltaX, setDeltaX] = useState<number>(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [canMove, setcanMove] = useState<string>('canMoveOn');
    //canMoveOf will disable moving - not used yet, only set up in key press handler

    const [bulletsArray, setBulletsArray] = useState<Array<JSX.Element>>([]);
    const bulletsRefs = useRef<Array<JSX.Element>>(bulletsArray);
    
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

    const bulletTimeline = (): gsap.core.Timeline => gsap.timeline({ paused: false, ease: "none" });
    const sherrifTimeline = (): gsap.core.Timeline => gsap.timeline({ paused: true, ease: "none" });
    const tlLeft = sherrifTimeline();
    const tlRight = sherrifTimeline();

    const performMeasurements = () => {        
        if (document.querySelector('.board')) {
            const boardWidth = Math.round(getDimentions('.board').width);
            data.current.boardWidth = boardWidth;
            const boardHeight = Math.round(getDimentions('.board').height);
            data.current.boardHeight = boardHeight;
            const sheriffWidth = Math.round(boardWidth / 8);
            data.current.sheriffWidth = sheriffWidth;
            // const deltaIncrement = sheriffWidth;
            const deltaIncrement = 20;
            data.current.deltaIncrement = deltaIncrement;
            const maxDeltaX = Math.round(boardWidth / 2 - sheriffWidth / 2);
            data.current.maxDeltaX = maxDeltaX;
        } else {
            console.warn('BOARD NOT DETECTED!');
        }        
    }

    const clearSheriffMotion = () => {
        data.current.inMotionLeft = false;
        data.current.inMotionRight = false;
    }
    
    const move = (direction: string, increment: number) => {
     
        clearSheriffMotion();    
        direction === 'left'
        ? data.current.inMotionLeft = true
        : data.current.inMotionRight = true;
        // console.log('LEFT: ', data.current.inMotionLeft, 'RIGHT', data.current.inMotionRight);
        // console.log('MOVING: ', sherriffRef);
        
        const el = sherriffRef;
        
        if (el) {
            if(data.current.inMotionLeft) {
                
                tlLeft.play();
                // console.log('DELTA X: ', data.current.deltaX);
                const newDeltaX = Math.max(data.current.deltaX - data.current.deltaIncrement, -data.current.maxDeltaX);
                tlLeft.fromTo(el, {x: data.current.deltaX}, {x: newDeltaX, duration: 0.1, onComplete: () => { 
                // console.log('DONE MOVING LEFT');                
                data.current.deltaX = newDeltaX;
                // console.log('NEW DELTA X: ', data.current.deltaX, data.current.maxDeltaX);
                    //MOVE LEFT AGAIN
                    if (data.current.inMotionLeft && Math.abs(data.current.deltaX) < Math.abs(data.current.maxDeltaX)) {
                        move('left', data.current.deltaIncrement);
                    }

                }}).delay(0);
            } else if(data.current.inMotionRight) {
                tlRight.play();
                // console.log('DELTA X: ', data.current.deltaX);
                const newDeltaX = Math.min(data.current.deltaX + data.current.deltaIncrement, data.current.maxDeltaX);
                tlRight.fromTo(el, {x: data.current.deltaX}, {x: newDeltaX, duration: 0.1, onComplete: () => { 
                // console.log('DONE MOVING RIGHT');                
                data.current.deltaX = newDeltaX;
                // console.log('NEW DELTA X: ', data.current.deltaX);
                    //MOVE RIGHT AGAIN
                    if (data.current.inMotionRight && Math.abs(data.current.deltaX) < Math.abs(data.current.maxDeltaX)) {
                        move('right', data.current.deltaIncrement);
                    }
                }}).delay(0);
            }
        }
    }
    
    const animateBullet = (el: HTMLDivElement) => {
        const tl = bulletTimeline();
        tl.set(el,  {transformOrigin: '50% 0%', x: data.current.deltaX});
        tl.to(el, {opacity: 1, duration: 0}).delay(0.5);
        tl.to(el, {bottom: '100%', duration: 2, onComplete: () => {
            bulletsRefs.current.shift();
            setBulletsArray([...bulletsRefs.current]);
         }}).delay(0);
    }

    const getDomNodeFromChild = (el: HTMLDivElement | null): void => {
        console.log('SHERRIF RECEIVED BULLET NODE: ', el);
        if (el) {
            if (el.dataset.type === 'bullet') {
                animateBullet(el);
            }
        }
    }

    const shoot = () => {        
        data.current.bulletCount = data.current.bulletCount + 1;        
        const newBullet = <Bullet key = {data.current.bulletCount} nr = {data.current.bulletCount} sheriffWidth = {data.current.sheriffWidth} domNodeGetter = {getDomNodeFromChild}/>
                
        bulletsRefs.current.push(newBullet);
        // console.log('BULLETSREF: ', bulletsRefs.current);
        
        console.log('BULLETS ARRAY BEFORE NEW BULLET: ', bulletsArray);
        // THIS WILL NOT WORK, IT WILL MAKE ANOTHER BULLET WITH THE SAME KEY:
        // setBulletsArray([...bulletsArray, newBullet]);
        setBulletsArray([...bulletsRefs.current]);

        // console.log('BULLETS ARRAY AFTER NEW BULLET: ', bulletsArray);
        // console.log('BULLET COUNT: ', data.current.bulletCount);
    }
    
    const handleKeyPress = (e: KeyboardEvent) => {
        
        // console.log('CLASSNAME INSIDE HANDLER: ', getClassNames('.sheriffDiv'));
        if (getClassNames('.sheriffDiv').includes('canMoveOff')) return

        const { key } = e;  //instead of e.key
        // console.log('key: ', key);        
            switch (key) {
                case 'ArrowLeft':
                    if (tlLeft.isActive() === false) {
                        move('left', data.current.deltaIncrement);
                    }
                break;
                case 'ArrowRight':
                    if (tlRight.isActive() === false) {
                        move('right', data.current.deltaIncrement);
                    }
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
    // console.log(`USEEFFECT ON KEY PRESS: ${canMove} dX: ${deltaX}`);        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [handleKeyPress]);   
}, []);

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
        // transform: `translateX(${deltaX}px)`,
        width: `${data.current.sheriffWidth}px`,
        height: `${data.current.sheriffWidth}px`,
        padding: `1px`,
    };
    
    const sheriffClassNames = ['sheriffDiv', `${canMove}`];

    let sherriffRef: HTMLDivElement | null;
    const rememberMyRef = (myRef: HTMLDivElement | null) => {
        if (myRef) {
            sherriffRef = myRef;
            // console.log('MY REF IS: ', sherriffRef);
        } 
    }
    
    return (
        <>
        {console.log('SHERIFF RENDERED')}
        {bulletsArray}
        <div ref={element => {rememberMyRef(element)}} className={sheriffClassNames.join(' ')} style = {sheriffStyle} onClick = {() => handleClick()}> <PlaneSvgComponent className="planeSvg" />           
        </div>
        </>
    )
}
