import React from 'react';
import styled from 'styled-components';

const Main = styled.main`
    padding: 15px 20px;
`;

export default function AppMain({ children }) {
    return (
        <Main>
            {children}
        </Main>
    );
}
