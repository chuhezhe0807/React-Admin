import Stack from "./Stack";

interface ICommand {
    name: string;
};

const undoStack = new Stack<ICommand>();
const rollbackStack = new Stack<ICommand>();

export const addRecord = (command: ICommand) => {
    undoStack.push(command);
};

export const getUndoStack = () => {
    return undoStack;
};

export const undoRecord = () => {
    if(undoStack.isEmpty()) {
        return;
    }

    rollbackStack.push(undoStack.pop()!);
}

export const getRollbackStack = () => {
    return rollbackStack;
}

export const clearRecord = () => {
    undoStack.clear();
    rollbackStack.clear();
}

export const rollbackRecord = () => {
    if(rollbackStack.isEmpty()) {
        return;
    }

    undoStack.push(rollbackStack.pop()!);
}