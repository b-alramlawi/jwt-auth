import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './styles/index.css';
import {I18nextProvider} from 'react-i18next';
import i18n from './locales/i18n';

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>,
    </I18nextProvider>,
    document.getElementById('root')
);
