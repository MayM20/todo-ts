var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString(); //creates a new date object
        this.name = taskname;
        this.status = false; //because the task hasn't been completed 
    }
    return Task;
}());
//this task will manages the tasks
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        console.log(this.tasks);
    };
    return TaskManager;
}());
var ListView = /** @class */ (function () {
    function ListView(listid) {
        this.list = document.getElementById(listid);
    }
    ListView.prototype.render = function (items) {
        var _this = this;
        items.forEach(function (task) {
            var id = task.id;
            var name = task.name;
            var status = task.status;
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                      <div class=\"task-container\">\n                      <div class=\"task-name\">" + name + "</div>\n                      <div class=\"task-buttons\">\n                        <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                        <button type=\"button\" data-function=\"delete\">&times;</button>\n                      </div>\n                    </div>\n                    </li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = ''; //clears list before rending the array
    };
    return ListView;
}());
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array) {
        var data = JSON.stringify(array);
        this.storage.setItem('taskdata', data);
    };
    DataStorage.prototype.read = function () {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        return array;
    };
    return DataStorage;
}());
//initialize
var taskarray = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read();
    //console.log(taskdata);
    taskdata.forEach(function (item) { taskarray.push(item); });
    //taskarray = taskdata; //we should store the data everytime we call the array
    listview.render(taskarray);
});
//reference to form 
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault(); //since we wanna get what has been submitted
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    //console.log(taskname);
    var task = new Task(taskname);
    taskmanager.add(task);
    listview.clear();
    taskstorage.store(taskarray);
    listview.render(taskarray);
});
