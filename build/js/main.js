var Task = /** @class */ (function () {
    function Task(name) {
        this.name = name;
        this.id = new Date().getTime(); //creates a new date object
        this.status = false;
        return this;
    }
    return Task;
}());
