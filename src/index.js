import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { createStore } from 'redux';
import nodes, { addNode, selectNode, deselectAll, moveNode } from './reducers/nodes';
import { Provider, connect } from 'react-redux';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Node from './components/Node';

const store = createStore(nodes);

const gridColor = `#bbb`;

const gridGradient = gridSize => (`
    transparent ${25 - (50/gridSize)}%,
    ${gridColor} 25%,
    ${gridColor} ${25 + (50/gridSize)}%,
    transparent ${25 + (100/gridSize)}%,
    transparent ${75 - (50/gridSize)}%,
    ${gridColor} 75%,
    ${gridColor} ${75 + (50/gridSize)}%,
    transparent ${75 + (100/gridSize)}%,
    transparent
`);

const GridLines = styled.div`
    position: relative;
    background-color: transparent;
    background-image:
        linear-gradient( 0deg, ${({ gridSize }) => gridGradient(gridSize)}),
        linear-gradient( 90deg, ${({ gridSize }) => gridGradient(gridSize)});
    height:100%;
    background-size:${({ gridSize }) => `${gridSize}px ${gridSize}px`};
`;

const Grid = connect(
    ({ nodes }) => ({
        anySelected: nodes.reduce((result, node) => (result || node.selected), false)
    }),
    dispatch => ({
        addNode: (x, y) => dispatch(addNode(x, y)),
        deselectAll: () => dispatch(deselectAll()),
    }),
    (stateProps, dispatchProps, ownProps) => ({
        ...stateProps, ...dispatchProps, ...ownProps,
        onClickField: e => {
            if (stateProps.anySelected) {
                dispatchProps.deselectAll();
            } else {
                dispatchProps.addNode(e.clientX, e.clientY);
            }
        }
    })
)(({ onClickField, children }) => (
    <GridLines
        gridSize={100}
        onClick={onClickField}
    >{children}</GridLines>
));

const Nodes = connect(
    ({ nodes }) => ({
        nodes
    }),
    dispatch => ({
        getSelectNodeHandler: id => e => {
            e.stopPropagation();
            dispatch(selectNode(id));
        },
        getMoveNodeHandler: id => (x, y) => {
            dispatch(moveNode(id, x, y));
        }
    })
)(({ nodes, getSelectNodeHandler, getMoveNodeHandler }) => nodes.map(({ x, y, id, selected = false }, index) => (
    <Node
        key={id}
        nodeId={id}
        x={x}
        y={y}
        selected={selected}
        onClick={getSelectNodeHandler(id)}
        onDrop={getMoveNodeHandler(id)}
    />
)));

const App = ({ store }) => (
    <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
            <Grid>
                <Nodes />
            </Grid>
        </DragDropContextProvider>
    </Provider>
);

ReactDOM.render(<App store={store} />, document.getElementById('app'));
