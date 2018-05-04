import * as moment from 'moment';

export class Template{
  template:string; 
  constructor(){
    //not being used right now
  }
  populate(id:string, name:string, status:string){
    let idtime:number = parseInt(id)
    let timestamp = moment( idtime ).fromNow();
    let task:string =  `<li id="${id}" data-status="${status}">
                <div class="task-container">
                <div class="task-label">
                  <p class="task-name">${name}</p>
                  <p class="task-age">added ${timestamp}</p>
                </div>
                <div class="task-buttons">
                  <button type="button" data-function="status">&#x2714;</button>
                  <button type="button" data-function="delete">&times;</button>
                </div>
                </div>
            </li>`;
    return task;
  }
}