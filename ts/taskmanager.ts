import { Task } from '../ts/task';

export class TaskManager{
  tasks : Array<Task>;
  constructor( array : Array<Task>){
    this.tasks = array;
  }
  add( task : Task ){
    this.tasks.push(task);
    this.sort( this.tasks );
    console.log( this.tasks );
  }
  //change status of a task/ 'changeStatus' is a toggle
  //callback gets a call after the task has been performed. re-rend the listview. function that we pass when we call the changeStatus
  //it will iterate through the array
  //to see if the task has been clicked and change the status
  changeStatus( id:string, callback ):void{
    this.tasks.forEach( (task:Task) => {
      if( task.id == id ){
        if( task.status == false ){
          task.status = true;
        }
        else{
          task.status = false;
        }
      }
    });
    this.sort( this.tasks );
    callback();
  }
  delete( id:string, callback ){
    let index_to_remove:number = undefined;
    this.tasks.forEach( (item:Task, index:number) =>{
      if( item.id == id ){
        index_to_remove = index;
      }
    });//it will delete the index when array is finish
    //after the loop is finish we then
    //delete the item with specified index
    if( index_to_remove !== undefined ){
      this.tasks.splice( index_to_remove, 1 );
    }
    this.sort( this.tasks);
    callback();
  }
  sort( tasks:Array<Task>){
    tasks.sort( (task1, task2) =>{
      if( task1.status == true && task2.status == false ){
        return 1;
      }
      if ( task1.status == false && task2.status == true ){
        return -1;
      }
      if( task1.status == task2.status ){
        return 0;
      }
    } );
  }
}