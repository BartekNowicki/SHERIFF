import React from 'react';

import { targets } from '../assets/targets/_targetList';

export const TargetArea = () => {
    return (
        <div className = "targetArea">
            {targets.map(item => <div key = {item.id} className = "target"></div>)}            
        </div>
    )
}
