import React from 'react';
import Measure from 'react-measure';
import './App.scss';
import { Sheriff } from './components/Sheriff';

const App: React.FC = () => {
    
  return (
   
    <Measure
        bounds
        onResize={contentRect => {
          console.log('RESIZE!!!', contentRect.bounds, typeof contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
           <div ref={measureRef} className="mainWrap">    
              <div className="board">
                <Sheriff status = {0}/>    
              </div>    
            </div>
        )}
    </Measure>
   
  );
}

export default App;

//https://www.npmjs.com/package/react-measure