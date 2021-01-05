import gsap from 'gsap';
import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as PlaneSvgComponent } from "../assets/plane.svg";
import { Bullet } from './Bullet';

import './bullet.scss';

export const Sheriff: React.FC<{
    status: number, 
    wrapperWidth: number}> = ({status, wrapperWidth})  => {

    const [sheriffClickCount, setSheriffClickCount] = useState<number>(status);

    const data = useRef({boardWidth: 0, boardHeight: 0, sheriffWidth: 0, deltaIncrement: 0, deltaX: 0, maxDeltaX: 0, bulletCount: 0, inMotion: false});
    
    const [deltaX, setDeltaX] = useState<number>(0);

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

    const performMeasurements = () => {        
        if (document.querySelector('.board')) {
            const boardWidth = Math.round(getDimentions('.board').width);
            data.current.boardWidth = boardWidth;
            const boardHeight = Math.round(getDimentions('.board').height);
            data.current.boardHeight = boardHeight;
            const sheriffWidth = Math.round(boardWidth / 8);
            data.current.sheriffWidth = sheriffWidth;
            // const deltaIncrement = sheriffWidth;
            const deltaIncrement = 40;
            data.current.deltaIncrement = deltaIncrement;
            const maxDeltaX = Math.round(boardWidth / 2 - sheriffWidth / 2);
            data.current.maxDeltaX = maxDeltaX;
        } else {
            console.warn('BOARD NOT DETECTED!');
        }
        
    }
        
    const move = (direction: string, x: number) => {
        data.current.inMotion = true;

        if (direction === 'left' ){
            setDeltaX(deltaX => Math.max(deltaX - x, -data.current.maxDeltaX));
            data.current.deltaX = Math.max(data.current.deltaX - x, -data.current.maxDeltaX)
            // console.log('DELTAX INSIDE MOVELEFT: ', data.current.deltaX);
            data.current.inMotion = false;
        } else {
            setDeltaX(deltaX => Math.min(deltaX + x, data.current.maxDeltaX));
            data.current.deltaX = Math.min(data.current.deltaX + x, data.current.maxDeltaX);
            data.current.inMotion = false;
        }
    }

    const bulletTimeline = () =>  gsap.timeline();

    const animateBullet = (el: HTMLDivElement) => {
        // console.log(el.dataset.type);
        // el.style.border = '10px solid yellow';
       
        const tl = bulletTimeline();

        tl.set(el,  {transformOrigin: '50% 0%', x: data.current.deltaX});

        tl.to(el, {opacity: 1, duration: 0}).delay(0.5);

        tl.to(el, {bottom: '100%', duration: 2, onComplete: () => {
            bulletsRefs.current.shift();
            setBulletsArray([...bulletsRefs.current]);
         }}).delay(0);
        
        // console.log(window.getComputedStyle(el).getPropertyValue("bottom"));
        
    }

    const getDomNodeFromChild = (el: HTMLDivElement | null): void => {
        console.log('SHERRIF RECEIVED BULLET NODE: ', el);
        if (el) {
            if (el.dataset.type === 'bullet') {
                // console.log(el.dataset.type);
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
                    move('left', data.current.deltaIncrement); 
                break;
                case 'ArrowRight':
                    move('right', data.current.deltaIncrement); 
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
        transform: `translateX(${deltaX}px)`,
        width: `${data.current.sheriffWidth}px`,
        height: `${data.current.sheriffWidth}px`,
        padding: `1px`,
    };
    
    const sheriffClassNames = ['sheriffDiv', `${canMove}`];
    
    return (
        <>
        {console.log('SHERIFF RENDERED')}
        {bulletsArray}
        <div className={sheriffClassNames.join(' ')} style = {sheriffStyle} onClick = {() => handleClick()}> <PlaneSvgComponent className="planeSvg" />           
        </div>
        </>
    )
}



