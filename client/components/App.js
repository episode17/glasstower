import React from 'react';
// import styled from 'styled-components';
import { rgb } from 'polished';

import 'minireset.css';
import '../styles/global.css';

import { toRgb } from '../utils';

import AppHeader from './AppHeader';
import AppMain from './AppMain';

import Tower from './Tower';
import TowerBlock from './TowerBlock';

const ReadyState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
};

const BLOCKS = [
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
    { color: '#000' },
];

class App extends React.Component {
    state = {
        socketReady: false,
        blocks: BLOCKS,
    };

    componentDidMount() {
        this.socket = new WebSocket(`ws://${location.host}`);

        this.socket.addEventListener('open', () => {
            console.log('WS: open');
            this.setState({ socketReady: true });
        });

        this.socket.addEventListener('close', () => {
            console.log('WS: close');
            this.setState({ socketReady: false });
        });

        this.socket.addEventListener('error', (e) => {
            console.log('WS: error', e);
        });

        this.socket.addEventListener('message', (e) => {
            console.log('WS: message', e.data);
        });
    }

    handleColorUpdate = (blockIndex, color) => {
        this.setState(state => {
            const { blocks } = state;
            const trueIndex = blocks.length - 1 - blockIndex;
            blocks[trueIndex] = {
                ...blocks[trueIndex],
                color,
            };
            return blocks;
        });

        if (this.socket.readyState === ReadyState.OPEN) {
            const data = [blockIndex, toRgb(color)];
            this.socket.send(JSON.stringify(data));
        }
    }

    handleRandomPaletteClick = () => {
        fetch('http://colormind.io/api/', {
            method: 'POST',
            body: JSON.stringify({
                model: 'default',
            }),
        })
            .then(res => res.json())
            .then(({ result }) => {
                result.forEach((color, i) => {
                    this.handleColorUpdate(i + 1, rgb(...color));
                    this.handleColorUpdate(i + 6, rgb(...color));
                })
            })
    }

    render() {
        return (
            <div>
                <AppHeader>
                    <button type="button" onClick={this.handleRandomPaletteClick}>Random palette</button>
                </AppHeader>
                <AppMain>
                    <Tower>
                        {this.state.blocks.map((block, i) => (
                            <TowerBlock
                                key={i}
                                index={this.state.blocks.length - 1 - i}
                                block={block}
                                onColorUpdate={this.handleColorUpdate}
                            />
                        ))}
                    </Tower>
                </AppMain>
            </div>
        );
    }
}

export default App;
