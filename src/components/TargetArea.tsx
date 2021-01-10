import { useContext, useEffect } from 'react';
import { AppStorage } from "../App";

import { targets } from '../assets/targets/_targetList';
import { ReactComponent as AppleSvgComponent } from "../assets/targets/apple.svg";
import { ReactComponent as BananaSvgComponent } from "../assets/targets/banana.svg";
import { ReactComponent as BeanSvgComponent } from "../assets/targets/bean.svg";
import { ReactComponent as BeetSvgComponent } from "../assets/targets/beet.svg";
import { ReactComponent as BlueberrySvgComponent } from "../assets/targets/blueberry.svg";
import { ReactComponent as BroccoliSvgComponent } from "../assets/targets/broccoli.svg";
import { ReactComponent as CabbageSvgComponent } from "../assets/targets/cabbage.svg";
import { ReactComponent as CarrotSvgComponent } from "../assets/targets/carrot.svg";
import { ReactComponent as CherrySvgComponent } from "../assets/targets/cherry.svg";
import { ReactComponent as CoconutSvgComponent } from "../assets/targets/coconut.svg";
import { ReactComponent as CornSvgComponent } from "../assets/targets/corn.svg";
import { ReactComponent as CucumberSvgComponent } from "../assets/targets/cucumber.svg";
import { ReactComponent as EggplantSvgComponent } from "../assets/targets/eggplant.svg";
import { ReactComponent as GarlicSvgComponent } from "../assets/targets/garlic.svg";
import { ReactComponent as GrapesSvgComponent } from "../assets/targets/grapes.svg";
import { ReactComponent as LemonSvgComponent } from "../assets/targets/lemon.svg";
import { ReactComponent as MangoSvgComponent } from "../assets/targets/mango.svg";
import { ReactComponent as MelonSvgComponent } from "../assets/targets/melon.svg";
import { ReactComponent as OnionSvgComponent } from "../assets/targets/onion.svg";
import { ReactComponent as OrangeSvgComponent } from "../assets/targets/orange.svg";
import { ReactComponent as PearSvgComponent } from "../assets/targets/pear.svg";
import { ReactComponent as PeasSvgComponent } from "../assets/targets/peas.svg";
import { ReactComponent as PepperSvgComponent } from "../assets/targets/pepper.svg";
import { ReactComponent as PineappleSvgComponent } from "../assets/targets/pineapple.svg";
import { ReactComponent as PumpkinSvgComponent } from "../assets/targets/pumpkin.svg";
import { ReactComponent as RadishSvgComponent } from "../assets/targets/radish.svg";
import { ReactComponent as RaspberrySvgComponent } from "../assets/targets/raspberry.svg";
import { ReactComponent as StrawberrySvgComponent } from "../assets/targets/strawberry.svg";
import { ReactComponent as TomatoSvgComponent } from "../assets/targets/tomato.svg";
import { ReactComponent as WatermelonSvgComponent } from "../assets/targets/watermelon.svg";


export const TargetArea = () => {
    const { targetDescription, setTargetDescription } = useContext(AppStorage); 
    const itemClassName = "targetSvg";

    const itemComponents = [
    <AppleSvgComponent className={itemClassName}/>,
    <BananaSvgComponent className={itemClassName}/>,
    <BeanSvgComponent className={itemClassName}/>,
    <BeetSvgComponent className={itemClassName}/>,
    <BlueberrySvgComponent className={itemClassName}/>,
    <BroccoliSvgComponent className={itemClassName}/>,
    <CabbageSvgComponent className={itemClassName}/>,
    <CarrotSvgComponent className={itemClassName}/>,
    <CherrySvgComponent className={itemClassName}/>,
    <CoconutSvgComponent className={itemClassName}/>,
    <CornSvgComponent className={itemClassName}/>,
    <CucumberSvgComponent className={itemClassName}/>,
    <EggplantSvgComponent className={itemClassName}/>,
    <GarlicSvgComponent className={itemClassName}/>,
    <GrapesSvgComponent className={itemClassName}/>,
    <LemonSvgComponent className={itemClassName}/>,
    <MangoSvgComponent className={itemClassName}/>,
    <MelonSvgComponent className={itemClassName}/>,
    <OnionSvgComponent className={itemClassName}/>,
    <OrangeSvgComponent className={itemClassName}/>,
    <PearSvgComponent className={itemClassName}/>,
    <PeasSvgComponent className={itemClassName}/>,
    <PepperSvgComponent className={itemClassName}/>,
    <PineappleSvgComponent className={itemClassName}/>,
    <PumpkinSvgComponent className={itemClassName}/>,
    <RadishSvgComponent className={itemClassName}/>,
    <RaspberrySvgComponent className={itemClassName}/>,
    <StrawberrySvgComponent className={itemClassName}/>,
    <TomatoSvgComponent className={itemClassName}/>,
    <WatermelonSvgComponent className={itemClassName}/>,
    ];

    const targetClassNames = () => {
        const colorOptions = ["green", "blue", "red", "yellow", "brown", "white", "gray"];
        const baseClass = ["target"];
        return `${baseClass[0]} ${colorOptions[Math.floor(Math.random() * colorOptions.length)]}`;
    }
    
    const pickTargetDescription = (candidates: JSX.Element[]) => {
        const randomNumber = Math.floor(Math.random() * candidates.length);
        const propsObj = candidates[randomNumber].props;
        // console.log(propsObj);   
        //STRUCTURE OF PROPSOBJ: className: "target blue", data-name: "watermelon"
        const color = String(Object.values(propsObj)[0]).slice(7);
        const type = Object.values(propsObj)[1];
        // console.log(color, type);
        if (Math.random() >= 0.5) return type
        return color
    }
    
    const pickThreeItemComponents = () => { 
        let randomNumbers = [];
        let pickedItemComponents: JSX.Element[] = [];
        const i = Math.floor(Math.random() * itemComponents.length);
        const j = Math.floor(Math.random() * itemComponents.length);
        const k = Math.floor(Math.random() * itemComponents.length);
        if (i !== j && j !==k) {
            randomNumbers = [i, j, k];
        } else randomNumbers = [1, 2, 3];    
    
        for (let x = 0; x<3; x++) {
            let randomNumber = randomNumbers[x];
            pickedItemComponents.push(
                <div ref={element => {showIt(element)}}
                key = {targets[randomNumber].id}
                className = {targetClassNames()}
                data-name = {targets[randomNumber].name}>
                {itemComponents[randomNumber]}
                </div>
            );
        }
        return pickedItemComponents;
    }
    
    const showIt = (el:any) => {
        if(!el) return
        // console.log(el.dataset.name);
    };

    let pickedItems: JSX.Element[] = [];
    let pickedTargetFeatureForDisplay: any = '';

    useEffect(() => {        
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pickedTargetFeatureForDisplay = pickTargetDescription(pickedItems);
        setTargetDescription(pickedTargetFeatureForDisplay);        
    }, []);

    pickedItems = pickThreeItemComponents(); 

    return (
    <section className = "targetArea" data-name = 'targetArea'>
        {pickedItems}
    </section>
    )
}
