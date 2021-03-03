const host = "https://veff-boards-hmv.herokuapp.com/api/v1/boards/";


function getAllBoards() {

    var url = 'https://veff-boards-hmv.herokuapp.com/api/v1/boards/';

    //Perform a GET request to the url
    axios.get(url)
        .then(function (response) {

            for (var i = 0; i < response.data.length; i++) {
                new_board(response.data[i].id, response.data[i].name);
                getAllTasks(response.data[i].id);
            }
        })
        .catch(function (error) {
        })
}


function new_board(id, name) {
    // This function takes in two parameters, id and name and uses that information to add the board to our HTML.

    // Board container div
    let div = document.createElement("div");

    div.setAttribute("class", "dragDropContainer boardDiv");
    div.addEventListener("dragover", allowDrop);
    div.addEventListener("drop", drop);
    div.id = "board" + id;
    div.setAttribute("boardID", id);
    div.setAttribute("ondragover", "allowDrop(event)");

    // Board delete button
    let b_delete_button = document.createElement("button");
    b_delete_button.setAttribute("class", "deleteBoardButton");
    b_delete_button.textContent = "✕";
    b_delete_button.addEventListener("click", function () { deleteBoard(id) });
    div.appendChild(b_delete_button);

    // Board name element
    let para = document.createElement("h1");
    para.setAttribute("class", "boardHeader");
    let text = document.createTextNode(name);
    para.appendChild(text);
    div.appendChild(para);

    // Task creation input field
    let input = document.createElement("input");
    input.type = "text";
    input.setAttribute("class", "taskNameInput");
    input.setAttribute("placeholder", "Create new task");
    input.setAttribute("id", "input" + id);
    input.addEventListener("keypress", function onEvent(event) {
        if (event.key === "Enter") {
            createNewTask(id, input.value);
            input.value = ""
        }
    })

    document.getElementById("master_div").appendChild(div);
    document.getElementById(div.id).appendChild(input);
}


function createBoard(boardName) {
    // This function only takes in one parameter - the board name and uses that information to contact the back-end. 
    // If successful it sends the data to the new_board function which adds it to our site

    var url = host;

    axios.post(url, { name: boardName, description: "" })
        .then(function (response) {

            new_board(response.data.id, response.data.name);
        })
        .catch(function (error) {
        })
}


function deleteBoard(boardID) {
    // This function takes in a board id which it uses to contact the back-end and sends a delete request to that URL.
    // If successful it deletes the board, if not nothing happens

    var url = host + boardID;

    axios.delete(url, {})
        .then(function (response) {

            document.getElementById("board" + boardID).remove();

        })
        .catch(function (error) {

        })
}


function getAllTasks(boardIDs) {

    var url = host + boardIDs + '/tasks';

    //Perform a GET request to the url
    axios.get(url)
        .then(function (response) {
            //When successful, send all tasks one by one to the addTaskToBoard function

            for (var j = 0; j < response.data.length; j++) {
                if (response.data.length > 0) {
                    if (response.data[j].archived === false) {
                        addTaskToBoard(response.data[j].boardId, response.data[j].id, response.data[j].taskName);
                    }
                }
            }
        }
        )
        .catch(function (error) {
        })
}


function createNewTask(boardID, taskText) {

    let url = host + boardID + '/tasks';

    //Perform a POST request to the url, and set the param 'taskName' in the request body to 
    axios.post(url, { taskName: taskText })
        .then(function (response) {
            // If successful it adds the task to the correct board in our HTML
            addTaskToBoard(response.data.boardId, response.data.id, response.data.taskName);

        })
        .catch(function (error) {

            console.log("Error: ", error);
        })
}


function addTaskToBoard(boardID, taskID, name) {

    // Task container div
    let new_task = document.createElement('div');
    new_task.setAttribute("class", "draggable");
    new_task.addEventListener("dragstart", drag);
    new_task.draggable = true;

    new_task.setAttribute("class", "taskDiv");

    // Task name container div
    let task_div = document.createElement('div');
    task_div.setAttribute("class", "taskTextDiv");
    new_task.setAttribute("boardID", boardID);
    let task_name = document.createTextNode(name);
    task_div.appendChild(task_name);

    let task_id = "task" + taskID;
    new_task.setAttribute("id", task_id);
    new_task.setAttribute("taskID", taskID);

    // Task delete button container div
    let div_button = document.createElement('div');
    div_button.setAttribute("class", "close_div");

    // Task delete button
    let t_delete_button = document.createElement("button");
    t_delete_button.textContent = "✕";
    t_delete_button.addEventListener("click", function () { archiveTask(boardID, taskID) });

    div_button.appendChild(t_delete_button);

    new_task.appendChild(task_div);
    new_task.appendChild(div_button);
    document.getElementById("board" + boardID).appendChild(new_task);
}


function deleteTask(boardID, taskID) {
    // Not currently in use.
    //The URL to which we will send the request
    var url = host + boardID + '/tasks/' + taskID;

    axios.delete(url, {})
        .then(function (response) {
            
            document.getElementById("task" + taskID).remove();

        })
        .catch(function (error) {
            //When unsuccessful, print the error.
            console.log("Error: ", error);
        })
}


function archiveTask(boardID, taskID) {
    // This function sends a patch request to the host and attempt to archive the selected task
    // if successful it removes the task from our board

    var url = host + boardID + '/tasks/' + taskID;

    // This axios request attempts to archive the selected task

    axios.patch(url, { archived: true })
        .then(function (response) {
            // If successful it will remove the task from our HTML
            document.getElementById("task" + taskID).remove();

        })
        .catch(function (error) {
            console.log("Error: ", error);
        })
}


function moveTask(boardID, taskID, newBoardID) {
    // This function takes in three parameters which it uses to move task from one board to another.
    // If successful it removes the original task and adds it again from the response at the new location

    //The URL to which we will send the request
    var url = host + boardID + '/tasks/' + taskID;
    if (boardID === newBoardID) return;

    axios.patch(url, { boardId: String(newBoardID) })
        .then(function (response) {

            document.getElementById("task" + taskID).remove();
            addTaskToBoard(response.data.boardId, response.data.id, response.data.taskName);

        })
        .catch(function (error) {
        })
}


function allowDrop(ev) {
    ev.preventDefault();
}


function drag(event) {

    let dragItem = event.target;
    dragItem.setAttribute("class", "taskDiv dragging");
    event.dataTransfer.setData("text", dragItem.id);
}


function drop(event) {

    event.preventDefault();

    let dragItem = event.target;

    let source_ele = document.getElementsByClassName("taskDiv dragging");
    let source = document.getElementById(source_ele[0].id);
    let taskIDstr = source.id;

    // checking if we dropped in a div / element that does not have a boardID, if so we find the nearest .dragDropContainer div
    if (dragItem.getAttribute("boardID") === null) {
        dragItem = event.target.closest(".dragDropContainer");
    }

    moveTask(source.getAttribute("boardID"), taskIDstr.substring(4, taskIDstr.length), dragItem.getAttribute("boardID"));
}


function boardCreateInput() {
    // This is the function to add an event listener to the Board input field text box
    let input2 = document.getElementById("boardNameInput")

    input2.addEventListener("keypress", function onEvent(event) {
        if (event.key === "Enter") {
            createBoard(input2.value);
            input2.value = "";
        }
    })
}

// Inital function calls that are needed to render the page at load.
boardCreateInput()
getAllBoards()
