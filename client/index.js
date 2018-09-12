import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

if (process.env.NODE_ENV === 'development') {
    require('webpack-serve-overlay');
}

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
