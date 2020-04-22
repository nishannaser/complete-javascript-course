import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        // Find the index of the item to delete
        // ES6 findIndex() method in action
        const index = this.items.findIndex(el => el.id === id);

        // Use splice to remove the item
        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // ES6 find() method in action
        this.items.find(el => el.id === id).count = newCount;
    }
}