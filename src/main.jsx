/*
 * @Descripttion:
 * @version:
 * @Author: pc
 * @Date: 2024-10-11 13:29:03
 * @LastEditors: your name
 * @LastEditTime: 2024-10-12 10:24:32
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import './style/global.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
