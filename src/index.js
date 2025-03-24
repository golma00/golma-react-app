import React from 'react';
import App from './App';
import axios from 'axios';
import { render } from "react-dom"
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import "react-splitter-layout/lib/index.css";
import "antd/dist/antd.css";
import 'assets/css/index.css';
import 'assets/css/ag-grid.css';
import "assets/css/splitter.css";
import "assets/css/global.css";
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