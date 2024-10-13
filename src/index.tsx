import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SceneContainer from './containers/sceneContainer/SceneContainer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SceneContainer />
  </React.StrictMode>
);