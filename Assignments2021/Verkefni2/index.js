
let allBoards = new Array;


function new_board(id, name, descr){


    let div = document.createElement("div");
    
    div.setAttribute("class", "dragDropContainer boardDiv");
    div.addEventListener("dragover", allowDrop);
    div.addEventListener("drop", drop);

    div.id = "board"+id;
    div.setAttribute("boardID", id)
    allBoards.push(id);


    let close_button = document.createElement("button");
    close_button.setAttribute("class", "deleteBoardButton")
    close_button.textContent = "X";
    close_button.addEventListener("click", function(){ deleteBoard(id)});
    div.appendChild(close_button);


    let para = document.createElement("h1");
    para.setAttribute("class", "boardHeader")
    let text = document.createTextNode(name);
    para.appendChild(text);
    div.appendChild(para);
    

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
    

}



function getAllBoards() {
    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards';

    //Perform a GET request to the url
    axios.get(url)
        .then(function (response) {
            //When successful, print the received data
            // console.log("Success: ", response.data);

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

function createBoard(boardName) {
    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/';

    //Perform a POST request to the url, and set the param 'taskName' in the request body to "testApplicationTask"
    axios.post(url, { name: boardName, description: "" })
        .then(function (response) {
            //When successful, print the received data
            // console.log("Success: ", response.data);

            //Look at this in the JS console of your browser!
            // console.log("Successfully created board with name " + response.data.taskName + " at time " + response.data.dateCreated);

            new_board(response.data.id, response.data.name)

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}


function deleteBoard(boardID) {
    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/' + boardID;

    //Perform a POST request to the url, and set the param 'taskName' in the request body to "testApplicationTask"
    axios.delete(url, {  })
        .then(function (response) {
            //When successful, print the received data
            // console.log("Success: ", response.data);

            //Look at this in the JS console of your browser!
            // console.log("Successfully deleted board with name " + response.data.taskName + " at time " + response.data.dateCreated);
            document.getElementById("board" + boardID).remove();

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
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
            // console.log("Success: tasks", response.data);
            
                for (var j=0; j< response.data.length;j++){
                    if (response.data.length > 0){
                        if (response.data[j].archived === false){
                            addTaskToBoard(response.data[j].boardId, response.data[j].id, response.data[j].taskName);
                    }
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



function addTaskToBoard(boardID, taskID, name){
    let new_task = document.createElement('div');
    new_task.setAttribute("class", "draggable");
    new_task.addEventListener("dragstart", drag);
    new_task.draggable = true;

    new_task.setAttribute("class", "taskDiv");
    let task_div = document.createElement('div');
    task_div.setAttribute("class", "taskTextDiv")
    new_task.setAttribute("boardID", boardID)
    let task_name = document.createTextNode(name);
    task_div.appendChild(task_name)
    let task_id = "task" + taskID;
    new_task.setAttribute("id", task_id);
    new_task.setAttribute("taskID", taskID)
    let div_button = document.createElement('div');
    div_button.setAttribute("class","close_div");
    
    let close_button = document.createElement("button");
    close_button.textContent = "X";
    // close_button.addEventListener("click", function(){deleteTask(boardID, taskID)});
    close_button.addEventListener("click", function(){archiveTask(boardID, taskID)});

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
            // console.log("Success: ", response.data);

            //Look at this in the JS console of your browser!
            // console.log("Successfully deleted task with name " + response.data.taskName + " at time " + response.data.dateCreated);
            document.getElementById("task" + taskID).remove();

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}

function archiveTask(boardID, taskID) {


    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/' + boardID + '/tasks/' + taskID;

    //Perform a POST request to the url, and set the param 'taskName' in the request body to "testApplicationTask"
    axios.patch(url, { archived: true })
        .then(function (response) {
            //When successful, print the received data
            // console.log("Success: ", response.data);

            //Look at this in the JS console of your browser!
            // console.log("Successfully archived task with name " + response.data.taskName);
            document.getElementById("task" + taskID).remove();

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
        })
        .then(function () {
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}



function moveTask(boardID, taskID, newBoardID) {
    
    //The URL to which we will send the request
    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/' + boardID + '/tasks/' + taskID;
    // var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/0/tasks/2';
    //Perform a POST request to the url, and set the param 'taskName' in the request body to "testApplicationTask"
    if (boardID === newBoardID) return;

    axios.patch(url, { boardId: String(newBoardID) })
        .then(function (response) {
            //When successful, print the received data
            // console.log("Success: ", response.data);

            //Look at this in the JS console of your browser!
            // console.log("Successfully moved task with name " + response.data.taskName + " at time " + response.data.dateCreated);
            document.getElementById("task" + taskID).remove();
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




function allowDrop(ev) {
    ev.preventDefault();
}



function drag(event) {
    let dragItem = event.target;
    dragItem.setAttribute("class", "taskDiv dragging")
    // console.log("DRAGGING")
    event.dataTransfer.setData("text", dragItem.id)
}


function drop(event) {
    
    try{
        let dragItem_ele = event.target;
        let source_ele = document.getElementsByClassName("taskDiv dragging");
        let dragItem = document.getElementById(dragItem_ele.id);

        // console.log(dragItem.getAttribute("class"))

        if (dragItem.getAttribute("class") !== "dragDropContainer boardDiv")return; 

        // console.log("Event target class = " + event.target.id)

        let source = document.getElementById(source_ele[0].id);
        // console.log("DROPPED");
        // console.log(source.getAttribute("boardID"));
        event.preventDefault();

        // let dragItem = document.getElementById(dragItem_ele.id)
        // console.log(dragItem)

        // console.log(dragItem.id[5]);
        // console.log(dragItem.getAttribute("taskid"));
        let taskIDstr = source.id
        moveTask(source.getAttribute("boardID"), taskIDstr.substring(4, taskIDstr.length) , dragItem.getAttribute("boardID"));
    }
    

    catch(err){
        return;
    }
}



function boardCreateInput(){
    let input2 = document.getElementById("boardNameInput")
    
    input2.addEventListener("keypress", function onEvent(event){ 
        if (event.key === "Enter"){ 
            createBoard(input2.value); 
            input2.value = ""}
    })
}

boardCreateInput()

getAllBoards()

