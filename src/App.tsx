import React from 'react';
import Measure from 'react-measure';
import './App.scss';
import { Sheriff } from './components/Sheriff';

const App: React.FC = () => {
  let wrapperWidth = 0;
    
  return (   
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
              <div className="board">
                <Sheriff status = {0} wrapperWidth = {wrapperWidth}/>    
              </div>    
            </div>
        )}
    </Measure>
   
  );
}

export default App;

//https://www.npmjs.com/package/react-measure