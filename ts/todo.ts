import { Task } from '../ts/task';
import { TaskManager } from '../ts/taskmanager';
import { ListView } from '../ts/listview';
import { DataStorage } from '../ts/datastorage';

//initialize
var taskarray:Array<any> = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager( taskarray );
var listview = new ListView('task-list');

window.addEventListener('load', () => {
  let taskdata = taskstorage.read( ( data ) => {
    if ( data.length > 0){
      data.forEach( (item) => {
        taskarray.push(item);
      });
      listview.clear();
      listview.render( taskarray );
    }
  });
  //console.log(taskdata);
  //taskdata.forEach( (item) => { taskarray.push( item); });
  //taskarray = taskdata; //we should store the data everytime we call the array
  //listview.render( taskarray );
});

//reference to form 
const taskform = (<HTMLFormElement> document.getElementById('task-form'));
taskform.addEventListener('submit', ( event: Event) => {
    event.preventDefault();//since we wanna get what has been submitted
    let input = document.getElementById('task-input');
    let taskname:string = (<HTMLInputElement>input).value;
    taskform.reset();
    //console.log(taskname);
  if( taskname.length > 0 ){
    let task = new Task( taskname );
    taskmanager.add( task );
      listview.clear();
      taskstorage.store( taskarray, ( result ) => {
      if( result ){
        taskform.reset();
        listview.clear();
        listview.render( taskarray );
  }
      else{
        //error to do with storage. e.g error handle or call a different storage
      }
    });
    listview.render( taskarray );
  }
});

//node is part of dom
function getParentId( elm:Node ){
  while( elm.parentNode ){
    elm = elm.parentNode;
    let id:string = (<HTMLElement> elm).getAttribute('id');
    if ( id ){
      return id;//the button wil pass as an element. if it finds it, it will be returned
    }
  }
  return null;
}

//callback means ->  cn you chop the onions? she chops it and when she finishes she will let you know.
//this works to listen for when a person click when is done or not yet(event listener) this is going to the <ul> instead of the <li> for efficiency.Parents is always there, instead of addying it to the <li>Task</li>
//when the task is clicked we get the id
const listelement:HTMLElement = document.getElementById('task-list');
listelement.addEventListener('click', ( event:Event) => {
  //we want to receive the target
  let target:HTMLElement = <HTMLElement> event.target;//it receives what's been clicked. 
  let id = getParentId( <Node> event.target );
  
  if( target.getAttribute('data-function') == 'status'){
    if( id ){
      taskmanager.changeStatus( id, () => {
        taskstorage.store( taskarray, () => {
          listview.clear();
          listview.render( taskarray );
        });
        //listview.clear();
        //listview.render( taskarray );
      } );
    }
  }
  if ( target.getAttribute('data-function') == 'delete'){
    if ( id ){
      taskmanager.delete( id, () => {
        taskstorage.store( taskarray, () => {
          listview.clear();
          listview.render( taskarray );
        });
        //listview.clear();
        //listview.render( taskarray );
      });
    }
  }
});