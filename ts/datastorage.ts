import { Task } from '../ts/task';

export class DataStorage{
  storage;
  constructor(){
    this.storage = window.localStorage;
  }
  store( array:Array <Task>, callback ){//store creates a json string from array
    //callback will happen when i finish storing
    let data = JSON.stringify( array );
    let storestatus = this.storage.setItem('taskdata', data );
    if ( storestatus ){
      callback(true);
    }
    else{
      callback( false);
    }
  }
  
  //in this section we need to return the data
  read( callback ){//doesnt take arguments but will return items from storage
    let data = this.storage.getItem('taskdata');
    let array = JSON.parse( data );
    callback( array );
    //return array;
  }
}