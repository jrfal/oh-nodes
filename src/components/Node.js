import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { nodeColor, primaryColor } from '../styles/colors';
import { darken, mix } from 'polished';
import { DragSource } from 'react-dnd';

const nodeSize = 40;
const makeHoverColor = color => darken(0.2, color);
const hoverNodeColor = makeHoverColor(nodeColor);
const activeNodeColor = mix(0.5, nodeColor, primaryColor);
const hoverActiveNodeColor = makeHoverColor(activeNodeColor);

const NodeStyle = styled.div`
    position: absolute;
    left: ${props => props.x - (nodeSize / 2)}px;
    top: ${props => props.y - (nodeSize / 2)}px;
    width: ${nodeSize}px;
    height: ${nodeSize}px;
    border-radius: 20px;
    background: ${props => (props.selected ? activeNodeColor : nodeColor)};
    cursor: pointer;

    &:hover {
        background: ${props => (props.selected ? hoverActiveNodeColor : hoverNodeColor)};
    }

    display: ${props => props.isDragging ? 'none' : 'block'}
`;

class Node extends React.Component {
    render() {
        const { connectDragSource, ...props } = this.props;
        return (<NodeStyle {...props} innerRef={el => connectDragSource(el)} />);
    }
}

// drag and drop stuff
const nodeSource = {
    beginDrag: (props) => {
        return {
            text: props.text
        };
    },
    endDrag: (props, monitor, component) => {
        const offset = monitor.getClientOffset();
        const startingOffset = monitor.getInitialClientOffset();
        props.onDrop(
            offset.x - startingOffset.x + props.x,
            offset.y - startingOffset.y + props.y
        );
    }
};

const collect = (connect, monitor) => {
    return ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    });
};

const DragNode = DragSource('node', nodeSource, collect)(Node);

export default DragNode;