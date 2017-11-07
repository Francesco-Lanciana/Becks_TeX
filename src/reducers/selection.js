export const selectionReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_SELECTED_FILE':
            return [
                ...state,
                action.selectedFile
            ];
        default:
            return state;
    }
}