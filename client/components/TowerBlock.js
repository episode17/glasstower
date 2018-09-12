import React from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { readableColor, getLuminance } from 'polished';
import ClickOutHandler from 'react-onclickout';

const Wrapper = styled.div`
    position: relative;

    &:not(:first-child) {
        margin-top: 10px;
    }
`;

const Box = styled.div`
    width: 40px;
    height: 40px;
    border: solid 1px ${props => props.showBorder ? '#ccc' : 'transparent'};
    cursor: pointer;
    &:hover {
        opacity: 0.75;
    }

    transition: border-color 0.2s ease;
`;

const Label = styled.div`
    position: relative;
    top: 5px;
    left: 5px;
    opacity: 0.5;

    transition: color 0.2s ease;
`;

const Picker = styled.div`
    position: absolute;
    top: 0px;
    left: 50px;
`;

class TowerBlock extends React.Component {
    state = {
        showPicker: false,
    };

    handleBoxClick = () => {
        this.setState(state => ({ showPicker: !state.showPicker }));
    };

    handleClickOut = () => {
        this.setState({ showPicker: false });
    };

    handleColorChange = (color) => {
        this.props.onColorUpdate(this.props.index, color.hex);
    }

    render() {
        const { index, block } = this.props;
        return (
            <Wrapper>
                <Box
                    onClick={this.handleBoxClick}
                    style={{ backgroundColor: block.color }}
                    showBorder={getLuminance(block.color) > 0.9}
                >
                    <Label
                        style={{ color: readableColor(block.color)}}
                    >
                        {index}
                    </Label>
                </Box>
                <Picker>
                    {this.state.showPicker && (
                        <ClickOutHandler onClickOut={this.handleClickOut}>
                            <SketchPicker
                                color={block.color}
                                disableAlpha
                                presetColors={[]}
                                onChange={this.handleColorChange}
                            />
                        </ClickOutHandler>
                    )}
                </Picker>
            </Wrapper>
        );
    }
}

export default TowerBlock;
