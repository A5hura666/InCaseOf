export class LockerManager{
    constructor() {
        this.lockers = [];
    }

    addLocker(locker) {
        this.lockers.push(locker);
    }

    getLockers() {
        return this.lockers;
    }

    static findLockerById(id) {
        return this.lockers.find(locker => locker.id === id);
    }

    removeLocker(id) {
        this.lockers = this.lockers.filter(locker => locker.id !== id);
    }
}