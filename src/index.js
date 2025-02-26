import React from 'react';
import App from './App';
import axios from 'axios';
import { render } from "react-dom"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'css/index.css';
import 'css/ag-grid.css';
const dependsModules = AllCommunityModule.dependsOn.filter(module => module.moduleName !== 'Validation');
AllCommunityModule.dependsOn = dependsModules;

ModuleRegistry.registerModules([AllCommunityModule])
axios.defaults.baseURL = 'http://221.149.20.211:8090';

const root = document.getElementById('root');
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>, root
);