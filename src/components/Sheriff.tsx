import gsap from 'gsap';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppStorage } from "../App";
import { ReactComponent as PlaneSvgComponent } from "../assets/plane.svg";
import { Bullet } from './Bullet';
import './bullet.scss';

export const Sheriff: React.FC<{
    status: number, 
    wrapperWidth: number}> = ({status, wrapperWidth})  => {

    const [sheriffClickCount, setSheriffClickCount] = useState<number>(status);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { targetDescription, score, setScore, isSound } = useContext(AppStorage);
    // console.log('TARGET DESCRIPTION1: ', targetDescription);

    const data = useRef({
        boardWidth: 0, 
        boardHeight: 0, 
        sheriffWidth: 0, 
        deltaIncrement: 0,
        deltaX: 0, 
        maxDeltaX: 0, 
        bulletCount: 0, 
        inMotionLeft: false, 
        inMotionRight: false,
        isCorrectShot: false,
        targetDescriptionFromStore: '',
        score: 0,
        goodShotSoundPath: null,
        badShotSoundPath: null,
        isSoundFromStore: false,
        targetsDown : [0,0,0],
        touchInitialX: -1,
        touchFinalX: -1,
        swipeThrottled: false,
        });
    
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
    const hitTargetTimeline = (): gsap.core.Timeline => gsap.timeline({ paused: true, ease: "none" });

    const tlLeft = sherrifTimeline();
    const tlRight = sherrifTimeline();

    const setCssVariables = (value: number) => {
        document.documentElement.style.setProperty('--targetWidthFromJs', `${value / 4}px`);
        // console.log('targetWidthFromJs: ', getComputedStyle(document.documentElement).getPropertyValue('--targetWidthFromJs'));
    }

    const performMeasurements = () => {
        //QUERYSELECTOR IS NOT REALLY REQUIRED AS THE BOARD INLINE STYLE IS 98% OFWRAPPER :)      
        if (document.querySelector('.board')) {
            const boardWidth = Math.round(getDimentions('.board').width);
            data.current.boardWidth = boardWidth;
            const boardHeight = Math.round(getDimentions('.board').height);
            data.current.boardHeight = boardHeight;
            const sheriffWidth = Math.round(boardWidth / 4);
            data.current.sheriffWidth = sheriffWidth;
            const deltaIncrement = sheriffWidth / 8;
            data.current.deltaIncrement = deltaIncrement;
            const maxDeltaX = Math.round(boardWidth / 2 - sheriffWidth / 2);
            data.current.maxDeltaX = maxDeltaX;
            setCssVariables(boardWidth);
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

    const calculateBulletRange = () => {    
        const panel = document.querySelector("[data-name='panel']");
        const targetArea = document.querySelector("[data-name='targetArea']");
        if (panel && targetArea) {
            const panelHeight = parseInt(window.getComputedStyle(panel).height);
            const targetAreaHeight = parseInt(window.getComputedStyle(targetArea).height);
            const bulletFlightRange = data.current.boardHeight - panelHeight - targetAreaHeight;
            // console.log('BULLET RANGE: ', bulletFlightRange);
            return bulletFlightRange;
        } 
    }

    const animateGoodShot = (targetHit: HTMLDivElement) => {
        const tl = hitTargetTimeline();
        tl.to(targetHit, {scale: 0, duration: 0.5, onComplete: () => { }}).delay(0.5);
        tl.play();
    }

    const animateBadShot = (targetHit: HTMLDivElement, cycles = 21, counter = 0) => {
        //IF MODULO IS 4 THEN CYCLES MUST BE AN ODD NUMBER FOR THE TOGGLE TO LEAVE OFF AT REMOVE
        if (!!cycles) {
            window.requestAnimationFrame(() => animateBadShot(targetHit, --cycles, ++counter));
        }
        if (counter % 4 === 0) {
            targetHit.classList.toggle('hit');
            // console.log('tick');
        }
        // console.log(cycles, counter);
    }

    const playGoodSound = (path: any ) => {
        if (path) {
            if (path.default) {
                const audio = new Audio(path.default);
                audio.play();
            }
        }        
    };

    const playBadSound = (path: any ) => {
        if (path) {
            if (path.default) {
                const audio = new Audio(path.default);
                audio.play();
            }
        }        
    };

    const updateShotTargetsArray = (side: string) => {
        if (side === 'left') {
            data.current.targetsDown[0] = 1;
        } else if (side === 'right') {
            data.current.targetsDown[2] = 1;
        } else {
            data.current.targetsDown[1] = 1;
        }
    }

    const checkBulletHitAndAnimate = (side: string) => {
        if(side === 'left' && data.current.targetsDown[0]) return
        if(side === 'center' && data.current.targetsDown[1]) return
        if(side === 'right' && data.current.targetsDown[2]) return

        let targetHit: any;
        if (document.querySelector(`[data-position='${side}']`)) {
            targetHit = document.querySelector(`[data-position='${side}']`);            
            // console.log('TARGET CLASSLIST: ', targetHit.classList.toString());
            // console.log('TARGET DATASET: ', targetHit.dataset);
            // console.log('TARGET DATASET-NAME: ', targetHit.dataset.name.toString());
            const hitItemCharacteristics: string = targetHit.classList.toString() + ' ' + targetHit.dataset.name.toString();
            if (hitItemCharacteristics.includes(data.current.targetDescriptionFromStore)) {
                data.current.isSoundFromStore && playGoodSound(data.current.goodShotSoundPath);
                animateGoodShot(targetHit);
                data.current.score = data.current.score + 1;
                setScore(data.current.score);
                updateShotTargetsArray(side);
            } else {
                data.current.isSoundFromStore && playBadSound(data.current.badShotSoundPath);
                animateBadShot(targetHit);
                data.current.score = Math.max(0, data.current.score - 2);
                setScore(data.current.score);
            }          
        }        
    }    
    
    const animateBullet = (el: HTMLDivElement) => {
        const sixth = data.current.maxDeltaX / 3;
        let side: string;
        let leftSidePoint = -(data.current.maxDeltaX - sixth * 2);
        let rightSidePoint = (data.current.maxDeltaX - sixth * 2);
        // console.log(leftSidePoint, rightSidePoint, data.current.maxDeltaX);
        if (data.current.deltaX < leftSidePoint) {
            side = 'left';
        } else if (data.current.deltaX > rightSidePoint) {
            side = 'right';
        } else {
            side = 'center';
        }
            
        const tl = bulletTimeline();
        tl.set(el,  {transformOrigin: '50% 0%', x: data.current.deltaX});
        tl.to(el, {opacity: 1, duration: 0}).delay(0.3);
        tl.to(el, {bottom: calculateBulletRange(), duration: 0.3, onComplete: () => {
            checkBulletHitAndAnimate(side);
            bulletsRefs.current.shift();
            setBulletsArray([...bulletsRefs.current]);
         }}).delay(0);
    }

    const getDomNodeFromChild = (el: HTMLDivElement | null): void => {
        // console.log('SHERRIF RECEIVED BULLET NODE: ', el);
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

    const addSounds = () => {
        data.current.goodShotSoundPath = require('../assets/goodShot.mp3');
        data.current.badShotSoundPath = require('../assets/badShot.mp3');
        console.log('SOUND ADDED');
    }

    const startTouch = (e: TouchEvent) => {
        // e.preventDefault(); -- TO MUCH LOAD ON PERFORMANCE, USED THROTTLING INSTEAD
        data.current.touchInitialX = e.touches[0].clientX;
    }

    const moveTouch = (e: TouchEvent) => {
        if (data.current.swipeThrottled) return
        if (data.current.touchInitialX === -1) return
        data.current.touchFinalX = e.touches[0].clientX;
        
        if (data.current.touchFinalX - data.current.touchInitialX > 0) {
            data.current.swipeThrottled = true;
            if (tlRight.isActive() === false) {
                move('right', data.current.deltaIncrement);
            }
            setTimeout(()=> data.current.swipeThrottled = false, 500);
        } else if (data.current.touchFinalX - data.current.touchInitialX < -0) {
            data.current.swipeThrottled = true;
            if (tlLeft.isActive() === false) {
                move('left', data.current.deltaIncrement);
            }
            data.current.swipeThrottled = true;
            setTimeout(()=> data.current.swipeThrottled = false, 500);
        }
    };

    const addEventListeners = () => {
        document.addEventListener('touchstart', (e) => startTouch(e));
        document.addEventListener('touchmove', (e) => moveTouch(e));
        window.addEventListener('keyup', (e) => handleKeyPress(e));
    }

    useEffect(() => {        
        addEventListeners();        
        performMeasurements();
        addSounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    

    const handleClick = () => {
        setSheriffClickCount(sheriffClickCount => sheriffClickCount + 1);
        shoot();
        // console.log(`SHERIFF CLICKED, INCREASING CLICK COUNT TO: ${sheriffClickCount}`);

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
    
    useEffect(() => {        
        // console.log('SHERIFF SEES TARGET DESCRIPTION CHANGE!!!');
        data.current.targetDescriptionFromStore = targetDescription;
        data.current.targetsDown = [0, 0, 0];
    }, [targetDescription]);

    useEffect(() => {        
        // console.log('SHERIFF SEES SOUND TOGGLE!!!');
        data.current.isSoundFromStore = isSound;
    }, [isSound]);


    return (
        <>
        {console.log('SHERIFF RENDERED')}
        {bulletsArray}
        <div ref={element => {rememberMyRef(element)}} 
            className={sheriffClassNames.join(' ')} 
            style = {sheriffStyle} 
            onClick = {() => handleClick()}> 
        <PlaneSvgComponent className="planeSvg"/>
        </div>
        </>
    )
}


