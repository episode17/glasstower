import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
    padding: 15px 20px;
    border-bottom: solid 1px #ccc;
    font-size: 16px;
    position: sticky;
    display: flex;
    align-items:center;
`;

const Tray = styled.div`
    margin-left: 20px;

    button {
        cursor: pointer;
        background: none;
        border: solid 1px #ccc;
        padding: 5px 10px;
        outline: none;

        &:hover {
            border-color: #000;
        }
    }
`;

export default function AppHeader({ children }) {
    return (
        <Header>
            Glass Tower
            <Tray>
                {children}
            </Tray>
        </Header>
    );
}
