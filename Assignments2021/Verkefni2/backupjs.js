
let allBoards = new Array;


// function new_div(){

//     if (div_counter < 5){
//         let div = document.createElement("div");

//         div.setAttribute("class", "dragDiv");
//         div.id = 'div' + div_counter;
//         document.getElementById("master_div").appendChild(div);

        
//         let button = document.createElement("button");
//         button.setAttribute("class", "addTask");
//         button.innerHTML = "Add Task";
//         document.getElementById(div.id).appendChild(button);
        
//         // button.addEventListener("click", add_task());
        
//         div_counter++;
        
//     }


// }


function new_board(id, name, descr){


    let div = document.createElement("div");

    div.setAttribute("class", "boardDiv");
    div.id = "board"+id;
    allBoards.push(id);

    
    
    div.innerHTML = "<h1>" +name+ "</h1>";
    document.getElementById("master_div").appendChild(div);
    let input = document.createElement("input");
    input.type = "text";
    input.setAttribute("class", "taskNameInput")
    input.setAttribute("placeholder", "Create new task")
    input.setAttribute("id","input" + id)
    input.addEventListener("keypress", function onEvent(event){ 
        if (event.key === "Enter"){ 
            createNewTask(id, input.value); 
            input.value = ""}
        })
    document.getElementById(div.id).appendChild(input)
    
    
    // let button = document.createElement("button");
    // button.setAttribute("class", "addTask");
    // button.innerHTML = "Add Task";
    // document.getElementById(div.id).appendChild(button);
    
    // button.addEventListener("click", add_task());
    

    


}



function getAllBoards() {
    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards';

    //Perform a GET request to the url
    axios.get(url)
        .then(function (response) {
            //When successful, print the received data
            console.log("Success: ", response.data);

            //response.data is an array if the request was successful, so you could iterate through it using a for loop.
            for (var i=0;i<response.data.length;i++) {
                new_board(response.data[i].id, response.data[i].name);
                
                
            }

            getAllTasks(allBoards)

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log(error);
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}

function getAllTasks(boardIDs){
    //The URL to which we will send the request
    // var url = 'https://veff-boards-h4.herokuapp.com/api/v1/boards/0/tasks';
    
    for (var i=0;i<allBoards.length;i++) {
        var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/' + boardIDs[i] + '/tasks';



    //Perform a GET request to the url
    axios.get(url)
        .then(function (response) {
            //When successful, print the received data
            console.log("Success: tasks", response.data);
            
                for (var j=0; j< response.data.length;j++){
                    if (response.data.length > 0){
                        addTaskToBoard(response.data[j].boardId, response.data[j].id, response.data[j].taskName);
                }
                //response.data is an array if the request was successful, so you could iterate through it using a for loop.

                }
            }
        )
        .catch(function (error) {
            //When unsuccessful, print the error.
            // console.log(error);
        })
    }
}


// function addTaskToBoard(boardID, taskID, name){
//     let new_task = document.createElement('div');
//     let task_name = document.createTextNode(name)
//     new_task.setAttribute("class", "taskDiv")
    
//     let task_id = "task" + taskID
//     new_task.setAttribute("id", task_id)

//     new_task.appendChild(task_name)
    
//     document.getElementById("board" + boardID).appendChild(new_task)

// }


function addTaskToBoard(boardID, taskID, name){
    let new_task = document.createElement('div');

    new_task.setAttribute("class", "taskDiv");
    let task_div = document.createElement('div');
    task_div.setAttribute("class", "taskTextDiv")

    let task_name = document.createTextNode(name);
    task_div.appendChild(task_name)
    let task_id = "task" + taskID;
    new_task.setAttribute("id", task_id);

    let div_button = document.createElement('div');
    div_button.setAttribute("class","close_div");
    
    let close_button = document.createElement("button");
    close_button.textContent = "X";
    close_button.addEventListener("click", function(){deleteTask(boardID, taskID)});

    div_button.appendChild(close_button);


    new_task.appendChild(task_div);
    new_task.appendChild(div_button);
    document.getElementById("board" + boardID).appendChild(new_task);

}






function createNewTask(boardID, taskText) {
    //Prepare the taskName parameter
    let myTaskName = taskText;

    //The URL to which we will send the request
    let url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/' + boardID + '/tasks';

    //Perform a POST request to the url, and set the param 'taskName' in the request body to "testApplicationTask"
    axios.post(url, { taskName: myTaskName })
        .then(function (response) {

            addTaskToBoard(response.data.boardId, response.data.id, response.data.taskName)

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}



function deleteTask(boardID, taskID) {


    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/' + boardID + '/tasks/' + taskID;

    //Perform a POST request to the url, and set the param 'taskName' in the request body to "testApplicationTask"
    axios.delete(url, {  })
        .then(function (response) {
            //When successful, print the received data
            console.log("Success: ", response.data);

            //Look at this in the JS console of your browser!
            console.log("Successfully deleted task with name " + response.data.taskName + " at time " + response.data.dateCreated);
            let task_to_delete = document.getElementById("task" + taskID).remove();

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}


getAllBoards()

