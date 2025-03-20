import React from 'react';
import App from './App';
import axios from 'axios';
import { render } from "react-dom"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import "react-splitter-layout/lib/index.css";
import "antd/dist/antd.css";
import 'css/index.css';
import 'css/ag-grid.css';
import "css/splitter.css";
import "locales/i18n";

const dependsModules = AllCommunityModule.dependsOn.filter(module => module.moduleName !== 'Validation');
AllCommunityModule.dependsOn = dependsModules;

ModuleRegistry.registerModules([AllCommunityModule])
axios.defaults.baseURL = 'http://localhost:8090';

library.add(fas);

const root = document.getElementById('root');
render(
  <React.Fragment>
    <App />
  </React.Fragment>, root
);