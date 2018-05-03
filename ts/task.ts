//export meeans we make this available to other modules
export class Task{
  id: string; 
  name: string; 
  status: boolean;
  constructor (taskname: string){
    this.id = new Date().getTime().toString();//creates a new date object
    this.name = taskname;
    this.status = false;//because the task hasn't been completed 
  }
}