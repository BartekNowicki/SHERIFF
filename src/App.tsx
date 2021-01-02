import React from 'react';
import Measure from 'react-measure';
import './App.scss';
import { Sheriff } from './components/Sheriff';
import './components/sheriff.scss';

const App: React.FC = () => {

  console.log('APP RENDERED');

  let wrapperWidth = 0;

  const boardStyle = {
    width: '98%',
    maxWidth: '800px',
    height: '98%',    
  };
    
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
              <div className="board" style = {boardStyle}>
                <Sheriff status = {0} wrapperWidth = {wrapperWidth}/>    
              </div>    
            </div>
        )}
    </Measure>
   
  );
}

export default App;

//https://www.npmjs.com/package/react-measure