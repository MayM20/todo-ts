(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array, callback) {
        //callback will happen when i finish storing
        var data = JSON.stringify(array);
        var storestatus = this.storage.setItem('taskdata', data);
        if (storestatus) {
            callback(true);
        }
        else {
            callback(false);
        }
    };
    //in this section we need to return the data
    DataStorage.prototype.read = function (callback) {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        callback(array);
        //return array;
    };
    return DataStorage;
}());
exports.DataStorage = DataStorage;

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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
exports.ListView = ListView;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
//export meeans we make this available to other modules
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString(); //creates a new date object
        this.name = taskname;
        this.status = false; //because the task hasn't been completed 
    }
    return Task;
}());
exports.Task = Task;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
        console.log(this.tasks);
    };
    //change status of a task/ 'changeStatus' is a toggle
    //callback gets a call after the task has been performed. re-rend the listview. function that we pass when we call the changeStatus
    //it will iterate through the array
    //to see if the task has been clicked and change the status
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
                if (task.status == false) {
                    task.status = true;
                }
                else {
                    task.status = false;
                }
            }
        });
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype["delete"] = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        }); //it will delete the index when array is finish
        //after the loop is finish we then
        //delete the item with specified index
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            if (task1.status == true && task2.status == false) {
                return 1;
            }
            if (task1.status == false && task2.status == true) {
                return -1;
            }
            if (task1.status == task2.status) {
                return 0;
            }
        });
    };
    return TaskManager;
}());
exports.TaskManager = TaskManager;

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var task_1 = require("../ts/task");
var taskmanager_1 = require("../ts/taskmanager");
var listview_1 = require("../ts/listview");
var datastorage_1 = require("../ts/datastorage");
//initialize
var taskarray = [];
var taskstorage = new datastorage_1.DataStorage();
var taskmanager = new taskmanager_1.TaskManager(taskarray);
var listview = new listview_1.ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
    //console.log(taskdata);
    //taskdata.forEach( (item) => { taskarray.push( item); });
    //taskarray = taskdata; //we should store the data everytime we call the array
    //listview.render( taskarray );
});
//reference to form 
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault(); //since we wanna get what has been submitted
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    //console.log(taskname);
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        listview.clear();
        taskstorage.store(taskarray, function (result) {
            if (result) {
                taskform.reset();
                listview.clear();
                listview.render(taskarray);
            }
            else {
                //error to do with storage. e.g error handle or call a different storage
            }
        });
        listview.render(taskarray);
    }
});
//node is part of dom
function getParentId(elm) {
    while (elm.parentNode) {
        elm = elm.parentNode;
        var id = elm.getAttribute('id');
        if (id) {
            return id; //the button wil pass as an element. if it finds it, it will be returned
        }
    }
    return null;
}
//callback means ->  cn you chop the onions? she chops it and when she finishes she will let you know.
//this works to listen for when a person click when is done or not yet(event listener) this is going to the <ul> instead of the <li> for efficiency.Parents is always there, instead of addying it to the <li>Task</li>
//when the task is clicked we get the id
var listelement = document.getElementById('task-list');
listelement.addEventListener('click', function (event) {
    //we want to receive the target
    var target = event.target; //it receives what's been clicked. 
    var id = getParentId(event.target);
    if (target.getAttribute('data-function') == 'status') {
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
                //listview.clear();
                //listview.render( taskarray );
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager["delete"](id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
                //listview.clear();
                //listview.render( taskarray );
            });
        }
    }
});

},{"../ts/datastorage":1,"../ts/listview":2,"../ts/task":3,"../ts/taskmanager":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvdGFzay50cyIsInRzL3Rhc2ttYW5hZ2VyLnRzIiwidHMvdG9kby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDRUE7SUFFRTtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUNyQyxDQUFDO0lBQ0QsMkJBQUssR0FBTCxVQUFPLEtBQWtCLEVBQUUsUUFBUTtRQUNqQyw0Q0FBNEM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUUsQ0FBQztRQUNuQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFFLENBQUM7UUFDMUQsRUFBRSxDQUFDLENBQUUsV0FBWSxDQUFDLENBQUEsQ0FBQztZQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUNELElBQUksQ0FBQSxDQUFDO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDSCxDQUFDO0lBQ0QsNENBQTRDO0lBQzVDLDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7UUFDbEIsZUFBZTtJQUNqQixDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQXZCQSxBQXVCQyxJQUFBO0FBdkJZLGtDQUFXOzs7OztBQ0F4QjtJQUVFLGtCQUFhLE1BQWE7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMs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ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xuXG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XG4gIHN0b3JhZ2U7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgfVxuICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApey8vc3RvcmUgY3JlYXRlcyBhIGpzb24gc3RyaW5nIGZyb20gYXJyYXlcbiAgICAvL2NhbGxiYWNrIHdpbGwgaGFwcGVuIHdoZW4gaSBmaW5pc2ggc3RvcmluZ1xuICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5ICk7XG4gICAgbGV0IHN0b3Jlc3RhdHVzID0gdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Rhc2tkYXRhJywgZGF0YSApO1xuICAgIGlmICggc3RvcmVzdGF0dXMgKXtcbiAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgY2FsbGJhY2soIGZhbHNlKTtcbiAgICB9XG4gIH1cbiAgLy9pbiB0aGlzIHNlY3Rpb24gd2UgbmVlZCB0byByZXR1cm4gdGhlIGRhdGFcbiAgcmVhZCggY2FsbGJhY2sgKXsvL2RvZXNudCB0YWtlIGFyZ3VtZW50cyBidXQgd2lsbCByZXR1cm4gaXRlbXMgZnJvbSBzdG9yYWdlXG4gICAgbGV0IGRhdGEgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSgndGFza2RhdGEnKTtcbiAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgY2FsbGJhY2soIGFycmF5ICk7XG4gICAgLy9yZXR1cm4gYXJyYXk7XG4gIH1cbn0iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XG5cbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcbiAgbGlzdDpIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcbiAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XG4gIH1cbiAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xuICAgIGl0ZW1zLmZvckVhY2goICh0YXNrKSA9PiB7XG4gICAgICBsZXQgaWQgPSB0YXNrLmlkO1xuICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XG4gICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXM7IFxuICAgICAgbGV0IHRlbXBsYXRlID0gYDxsaSBpZD1cIiR7aWR9XCIgZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+YDtcbiAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xuICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKCBmcmFnbWVudCApO1xuICAgIH0gKTtcbiAgfVxuICBjbGVhcigpe1xuICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPSAnJzsvL2NsZWFycyBsaXN0IGJlZm9yZSByZW5kaW5nIHRoZSBhcnJheVxuICB9XG59IiwiLy9leHBvcnQgbWVlYW5zIHdlIG1ha2UgdGhpcyBhdmFpbGFibGUgdG8gb3RoZXIgbW9kdWxlc1xuZXhwb3J0IGNsYXNzIFRhc2t7XG4gIGlkOiBzdHJpbmc7IFxuICBuYW1lOiBzdHJpbmc7IFxuICBzdGF0dXM6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yICh0YXNrbmFtZTogc3RyaW5nKXtcbiAgICB0aGlzLmlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTsvL2NyZWF0ZXMgYSBuZXcgZGF0ZSBvYmplY3RcbiAgICB0aGlzLm5hbWUgPSB0YXNrbmFtZTtcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlOy8vYmVjYXVzZSB0aGUgdGFzayBoYXNuJ3QgYmVlbiBjb21wbGV0ZWQgXG4gIH1cbn0iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XG5cbmV4cG9ydCBjbGFzcyBUYXNrTWFuYWdlcntcbiAgdGFza3MgOiBBcnJheTxUYXNrPjtcbiAgY29uc3RydWN0b3IoIGFycmF5IDogQXJyYXk8VGFzaz4pe1xuICAgIHRoaXMudGFza3MgPSBhcnJheTtcbiAgfVxuICBhZGQoIHRhc2sgOiBUYXNrICl7XG4gICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xuICAgIGNvbnNvbGUubG9nKCB0aGlzLnRhc2tzICk7XG4gIH1cbiAgLy9jaGFuZ2Ugc3RhdHVzIG9mIGEgdGFzay8gJ2NoYW5nZVN0YXR1cycgaXMgYSB0b2dnbGVcbiAgLy9jYWxsYmFjayBnZXRzIGEgY2FsbCBhZnRlciB0aGUgdGFzayBoYXMgYmVlbiBwZXJmb3JtZWQuIHJlLXJlbmQgdGhlIGxpc3R2aWV3LiBmdW5jdGlvbiB0aGF0IHdlIHBhc3Mgd2hlbiB3ZSBjYWxsIHRoZSBjaGFuZ2VTdGF0dXNcbiAgLy9pdCB3aWxsIGl0ZXJhdGUgdGhyb3VnaCB0aGUgYXJyYXlcbiAgLy90byBzZWUgaWYgdGhlIHRhc2sgaGFzIGJlZW4gY2xpY2tlZCBhbmQgY2hhbmdlIHRoZSBzdGF0dXNcbiAgY2hhbmdlU3RhdHVzKCBpZDpzdHJpbmcsIGNhbGxiYWNrICk6dm9pZHtcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goICh0YXNrOlRhc2spID0+IHtcbiAgICAgIGlmKCB0YXNrLmlkID09IGlkICl7XG4gICAgICAgIGlmKCB0YXNrLnN0YXR1cyA9PSBmYWxzZSApe1xuICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHRhc2suc3RhdHVzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnNvcnQoIHRoaXMudGFza3MgKTtcbiAgICBjYWxsYmFjaygpO1xuICB9XG4gIGRlbGV0ZSggaWQ6c3RyaW5nLCBjYWxsYmFjayApe1xuICAgIGxldCBpbmRleF90b19yZW1vdmU6bnVtYmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGFza3MuZm9yRWFjaCggKGl0ZW06VGFzaywgaW5kZXg6bnVtYmVyKSA9PntcbiAgICAgIGlmKCBpdGVtLmlkID09IGlkICl7XG4gICAgICAgIGluZGV4X3RvX3JlbW92ZSA9IGluZGV4O1xuICAgICAgfVxuICAgIH0pOy8vaXQgd2lsbCBkZWxldGUgdGhlIGluZGV4IHdoZW4gYXJyYXkgaXMgZmluaXNoXG4gICAgLy9hZnRlciB0aGUgbG9vcCBpcyBmaW5pc2ggd2UgdGhlblxuICAgIC8vZGVsZXRlIHRoZSBpdGVtIHdpdGggc3BlY2lmaWVkIGluZGV4XG4gICAgaWYoIGluZGV4X3RvX3JlbW92ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICB0aGlzLnRhc2tzLnNwbGljZSggaW5kZXhfdG9fcmVtb3ZlLCAxICk7XG4gICAgfVxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyk7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxuICBzb3J0KCB0YXNrczpBcnJheTxUYXNrPil7XG4gICAgdGFza3Muc29ydCggKHRhc2sxLCB0YXNrMikgPT57XG4gICAgICBpZiggdGFzazEuc3RhdHVzID09IHRydWUgJiYgdGFzazIuc3RhdHVzID09IGZhbHNlICl7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gZmFsc2UgJiYgdGFzazIuc3RhdHVzID09IHRydWUgKXtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYoIHRhc2sxLnN0YXR1cyA9PSB0YXNrMi5zdGF0dXMgKXtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfSApO1xuICB9XG59IiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xuaW1wb3J0IHsgVGFza01hbmFnZXIgfSBmcm9tICcuLi90cy90YXNrbWFuYWdlcic7XG5pbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gJy4uL3RzL2xpc3R2aWV3JztcbmltcG9ydCB7IERhdGFTdG9yYWdlIH0gZnJvbSAnLi4vdHMvZGF0YXN0b3JhZ2UnO1xuXG4vL2luaXRpYWxpemVcbnZhciB0YXNrYXJyYXk6QXJyYXk8YW55PiA9IFtdO1xudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIoIHRhc2thcnJheSApO1xudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gIGxldCB0YXNrZGF0YSA9IHRhc2tzdG9yYWdlLnJlYWQoICggZGF0YSApID0+IHtcbiAgICBpZiAoIGRhdGEubGVuZ3RoID4gMCl7XG4gICAgICBkYXRhLmZvckVhY2goIChpdGVtKSA9PiB7XG4gICAgICAgIHRhc2thcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgfSk7XG4gICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcbiAgICB9XG4gIH0pO1xuICAvL2NvbnNvbGUubG9nKHRhc2tkYXRhKTtcbiAgLy90YXNrZGF0YS5mb3JFYWNoKCAoaXRlbSkgPT4geyB0YXNrYXJyYXkucHVzaCggaXRlbSk7IH0pO1xuICAvL3Rhc2thcnJheSA9IHRhc2tkYXRhOyAvL3dlIHNob3VsZCBzdG9yZSB0aGUgZGF0YSBldmVyeXRpbWUgd2UgY2FsbCB0aGUgYXJyYXlcbiAgLy9saXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xufSk7XG5cbi8vcmVmZXJlbmNlIHRvIGZvcm0gXG5jb25zdCB0YXNrZm9ybSA9ICg8SFRNTEZvcm1FbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1mb3JtJykpO1xudGFza2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKCBldmVudDogRXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOy8vc2luY2Ugd2Ugd2FubmEgZ2V0IHdoYXQgaGFzIGJlZW4gc3VibWl0dGVkXG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcbiAgICBsZXQgdGFza25hbWU6c3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcbiAgICB0YXNrZm9ybS5yZXNldCgpO1xuICAgIC8vY29uc29sZS5sb2codGFza25hbWUpO1xuICBpZiggdGFza25hbWUubGVuZ3RoID4gMCApe1xuICAgIGxldCB0YXNrID0gbmV3IFRhc2soIHRhc2tuYW1lICk7XG4gICAgdGFza21hbmFnZXIuYWRkKCB0YXNrICk7XG4gICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUoIHRhc2thcnJheSwgKCByZXN1bHQgKSA9PiB7XG4gICAgICBpZiggcmVzdWx0ICl7XG4gICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XG4gICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIC8vZXJyb3IgdG8gZG8gd2l0aCBzdG9yYWdlLiBlLmcgZXJyb3IgaGFuZGxlIG9yIGNhbGwgYSBkaWZmZXJlbnQgc3RvcmFnZVxuICAgICAgfVxuICAgIH0pO1xuICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gIH1cbn0pO1xuXG4vL25vZGUgaXMgcGFydCBvZiBkb21cbmZ1bmN0aW9uIGdldFBhcmVudElkKCBlbG06Tm9kZSApe1xuICB3aGlsZSggZWxtLnBhcmVudE5vZGUgKXtcbiAgICBlbG0gPSBlbG0ucGFyZW50Tm9kZTtcbiAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgaWYgKCBpZCApe1xuICAgICAgcmV0dXJuIGlkOy8vdGhlIGJ1dHRvbiB3aWwgcGFzcyBhcyBhbiBlbGVtZW50LiBpZiBpdCBmaW5kcyBpdCwgaXQgd2lsbCBiZSByZXR1cm5lZFxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLy9jYWxsYmFjayBtZWFucyAtPiAgY24geW91IGNob3AgdGhlIG9uaW9ucz8gc2hlIGNob3BzIGl0IGFuZCB3aGVuIHNoZSBmaW5pc2hlcyBzaGUgd2lsbCBsZXQgeW91IGtub3cuXG4vL3RoaXMgd29ya3MgdG8gbGlzdGVuIGZvciB3aGVuIGEgcGVyc29uIGNsaWNrIHdoZW4gaXMgZG9uZSBvciBub3QgeWV0KGV2ZW50IGxpc3RlbmVyKSB0aGlzIGlzIGdvaW5nIHRvIHRoZSA8dWw+IGluc3RlYWQgb2YgdGhlIDxsaT4gZm9yIGVmZmljaWVuY3kuUGFyZW50cyBpcyBhbHdheXMgdGhlcmUsIGluc3RlYWQgb2YgYWRkeWluZyBpdCB0byB0aGUgPGxpPlRhc2s8L2xpPlxuLy93aGVuIHRoZSB0YXNrIGlzIGNsaWNrZWQgd2UgZ2V0IHRoZSBpZFxuY29uc3QgbGlzdGVsZW1lbnQ6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICggZXZlbnQ6RXZlbnQpID0+IHtcbiAgLy93ZSB3YW50IHRvIHJlY2VpdmUgdGhlIHRhcmdldFxuICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7Ly9pdCByZWNlaXZlcyB3aGF0J3MgYmVlbiBjbGlja2VkLiBcbiAgbGV0IGlkID0gZ2V0UGFyZW50SWQoIDxOb2RlPiBldmVudC50YXJnZXQgKTtcbiAgXG4gIGlmKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ3N0YXR1cycpe1xuICAgIGlmKCBpZCApe1xuICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKCBpZCwgKCkgPT4ge1xuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICBsaXN0dmlldy5yZW5kZXIoIHRhc2thcnJheSApO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9saXN0dmlldy5jbGVhcigpO1xuICAgICAgICAvL2xpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gICAgICB9ICk7XG4gICAgfVxuICB9XG4gIGlmICggdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdkZWxldGUnKXtcbiAgICBpZiAoIGlkICl7XG4gICAgICB0YXNrbWFuYWdlci5kZWxldGUoIGlkLCAoKSA9PiB7XG4gICAgICAgIHRhc2tzdG9yYWdlLnN0b3JlKCB0YXNrYXJyYXksICgpID0+IHtcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XG4gICAgICAgIH0pO1xuICAgICAgICAvL2xpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgIC8vbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7Il19
