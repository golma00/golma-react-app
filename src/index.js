import React from 'react';
import App from './App';
import axios from 'axios';
import { render } from "react-dom"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import 'css/index.css';
import 'css/ag-grid.css';
import "css/splitter.css";
import "locales/i18n";
import "antd/dist/antd.css";
import "react-splitter-layout/lib/index.css";

const dependsModules = AllCommunityModule.dependsOn.filter(module => module.moduleName !== 'Validation');
AllCommunityModule.dependsOn = dependsModules;

ModuleRegistry.registerModules([AllCommunityModule])
axios.defaults.baseURL = 'http://221.149.20.211:8090';

library.add(fas);

const root = document.getElementById('root');
render(
  <React.Fragment>
    <App />
  </React.Fragment>, root
);