const keyMirrorify = keys => keys.reduce((result, key) => ({...result, [key]: key}), {});

export const actionTypes = keyMirrorify([
    "ADD_NODE",
    "SELECT_NODE",
    "DESELECT_ALL",
    "MOVE_NODE",
]);

export const addNode = (x, y) => ({ type: actionTypes.ADD_NODE, x, y });
export const selectNode = id => ({ type: actionTypes.SELECT_NODE, id });
export const deselectAll = () => ({ type: actionTypes.DESELECT_ALL });
export const moveNode = (id, x, y) => ({ type: actionTypes.MOVE_NODE, id, x, y });

const withoutNode = (nodes, id) => nodes.filter(node => (node.id !== id));

const getNode = (nodes, id) => nodes.find(node => (node.id === id));
const deselectedNode = node => {
    const { selected, ...result } = node;
    return result;
}

const nodes = (state = { nodes: [], nextId: 1 }, action) => {
    switch(action.type) {
        case actionTypes.ADD_NODE:
            return {
                ...state,
                nodes: [...state.nodes, { x: action.x, y: action.y, id: state.nextId } ],
                nextId: state.nextId + 1
            };
        case actionTypes.SELECT_NODE:
            return {
                ...state,
                nodes: [...withoutNode(state.nodes, action.id), {...getNode(state.nodes, action.id), selected: true}]
            }
        case actionTypes.DESELECT_ALL:
            return {
                ...state,
                nodes: state.nodes.map(node => (node.selected ? deselectedNode(node) : node))
            }
        case actionTypes.MOVE_NODE:
            console.log(action);
            return {
                ...state,
                nodes: [
                    ...withoutNode(state.nodes, action.id),
                    {...getNode(state.nodes, action.id), x: action.x, y: action.y}
                ],
            }
    }
    return state;
}

export default nodes;