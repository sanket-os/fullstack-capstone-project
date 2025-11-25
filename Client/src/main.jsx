import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppLayout from './App.jsx';
import store from "./redux/store.js";
import { Provider } from 'react-redux';
import { App as AntdApp } from "antd";
import "antd/dist/reset.css";


createRoot(document.getElementById('root')).render(

    <Provider store={store}>
        <AntdApp>
            <AppLayout/>
        </AntdApp>
    </Provider>
    
 
)
