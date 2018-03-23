class Task{
  id: string; 
  name: string; 
  status: boolean;
  constructor ( name: string ){
    this.name = name;
    this.id = new Date().getTime();//creates a new date object
    this.status = false; 
    return this;

  }
}