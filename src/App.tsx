
import React from 'react';
import './App.scss';
import { Sheriff } from './components/Sheriff';

const App: React.FC = () => {
  return (
    <div className="mainWrap">    
      <div className="board">
        <Sheriff status = {0}/>    
      </div>    
    </div>
  );
}

export default App;


// ORIG

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
