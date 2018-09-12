import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
    padding: 15px 20px;
    border-bottom: solid 1px #ccc;
    font-size: 18px;
`;

export default function AppHeader() {
    return (
        <Header>
            Glass Tower
        </Header>
    );
}
