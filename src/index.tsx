import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { ETFOverlap } from './pages/ETFOverlap';
import Landing from './pages/Landing';
import { Memory } from './pages/Memory';
import { StroopEffect } from './pages/StroopEffect';
import WalletBalance from './pages/WalletBalance';
import { store } from './redux/store';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <HashRouter basename={process.env.PUBLIC_URL + '/'}>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/walletbalance' element={<WalletBalance />} />
                <Route path='/stroop' element={<StroopEffect />} />
                <Route path='/memory' element={<Memory />} />
                <Route path='/etfoverlap' element={<ETFOverlap />} />
            </Routes>
        </HashRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
