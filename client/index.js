import React from 'react';
import { render } from 'react-dom';

import 'minireset.css';
import './styles/global.css';

import App from './components/App';

function renderApp() {
    const app = (
        <App />
    );

    render(app, document.getElementById('root'));
}

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./components/App', () => {
        renderApp();
    });
}

renderApp();
