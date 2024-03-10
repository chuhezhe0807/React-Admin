export default class Stack<T> {
    private list: T[];

    constructor() {
        this.list = [];
    }

    push(value: T) {
        this.list.push(value);
    }

    size() {
        return this.list.length;
    }

    peek() {
        return this.list.at(-1);
    }

    pop() {
        return this.list.pop();
    }

    map<U>(callback: (val: T, index: number) => U) {
        return this.list.map(callback);
    }

    isEmpty() {
        return this.size() == 0;
    }

    clear() {
        this.list = [];
    }
}