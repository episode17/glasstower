import React from 'react';

import 'minireset.css';
import '../styles/global.css';

import AppHeader from './AppHeader';
import AppMain from './AppMain';

export default function App() {
    return (
        <div>
            <AppHeader />
            <AppMain />
        </div>
    );
}
