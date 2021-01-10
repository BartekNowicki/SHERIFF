import React, { useState } from 'react';
import Measure from 'react-measure';
import './App.scss';
import { Panel } from './components/Panel';
import './components/panel.scss';
import { TargetArea } from './components/TargetArea';
import './components/targetArea.scss';
import { Sheriff } from './components/Sheriff';
import './components/sheriff.scss';

interface GameData {
  targetDescription: string;
  setTargetDescription: Function; 
}

export const AppStorage: React.Context<GameData> = React.createContext<any>('');

const App: React.FC = () => {

  const [targetDescription, setTargetDescription] = useState<string>('');

  let wrapperWidth = 0;
  const boardStyle = {
    width: '98%',
    maxWidth: '800px',
    height: '98%',    
  };  
  
    
  return (   
    <>
    {console.log('APP RENDERED')}
    <Measure
        bounds
        onResize={contentRect => {
          // console.log('RESIZE!!!', contentRect.bounds, typeof contentRect.bounds);
          //MEASURE IS FIRED ON EVERY RESIZE SENDING THE UPDATED PROP DOWN TO THE SHERIFF
          //USING AN IFFE HERE
          contentRect.bounds && (() => {
            // console.log(Object.keys(contentRect.bounds));
            for (const item in contentRect.bounds) {
              if (item === 'width') {
                wrapperWidth = contentRect.bounds[item];
                // console.log('WRAPPER WIDTH: ', wrapperWidth);
              }
            }
          })();
        }}

      >
        {({ measureRef }) => (
           <div ref={measureRef} className="mainWrap">    
              <div className="board" style = {boardStyle}>
                <AppStorage.Provider value = {{targetDescription, setTargetDescription}}>
                  <Panel/>
                  <TargetArea/>
                  <Sheriff status = {0} wrapperWidth = {wrapperWidth}/>    
                </AppStorage.Provider>
              </div>    
            </div>
        )}
    </Measure>
    </>
  );
}

export default App;

//https://www.npmjs.com/package/react-measure