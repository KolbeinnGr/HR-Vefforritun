//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');

const app = express();

//Port environment variable already set up to run on Heroku
var port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());

//The following is an example of an array of three boards. 
let board_counter = 3;

let task_counter = 4;

var boards = [
    { id: '0', name: "Planned", description: "Everything that's on the todo list.", tasks: ["0", "1", "2"] },
    { id: '1', name: "Ongoing", description: "Currently in progress.", tasks: [] },
    { id: '2', name: "Done", description: "Completed tasks.", tasks: ["3"] }
];

var tasks = [
    { id: '0', boardId: '0', taskName: "Another task", dateCreated: new Date(Date.UTC(2021, 00, 21, 15, 48)), archived: false },
    { id: '1', boardId: '0', taskName: "Prepare exam draft", dateCreated: new Date(Date.UTC(2021, 00, 21, 16, 48)), archived: false },
    { id: '2', boardId: '0', taskName: "Discuss exam organisation", dateCreated: new Date(Date.UTC(2021, 00, 21, 14, 48)), archived: false },
    { id: '3', boardId: '2', taskName: "Prepare assignment 2", dateCreated: new Date(Date.UTC(2021, 00, 10, 16, 00)), archived: false }
];


// Get all boards
app.get("/api/v1/boards", function (req, res) {
    let ret_arr = [];
    for (var i = 0; i < boards.length; i++) {
        let ret_board = { id: boards[i].id, name: boards[i].name, description: boards[i].description };
        ret_arr.push(ret_board);
    }
    return res.status(200).json(ret_arr);
})


// Get a specific board
app.get("/api/v1/boards/:Id", function (req, res) {
    let board_ID = req.params.Id;
    for (var i = 0; i < boards.length; i++) {
        if (board_ID === boards[i].id) {
            return res.status(200).json(boards[i]);
        }
    };
    return res.status(404).json({ "message": "Board with id " + board_ID + " does not exist" });
});

// Create a new board
app.post("/api/v1/boards/", function (req, res) {
    
    let board_name = req.body.name;
    if (board_name !== undefined) {
        board_description = req.body.description;
        new_board = { id: board_counter.toString(), name: board_name, description: board_description, tasks: [] };
        boards.push(new_board);

        board_counter++;

        return res.status(201).json(new_board);
    }
    return res.status(400).json({ "message": "The name parameter is required." });
});

// Get all tasks for a single board
app.get("/api/v1/boards/:Id/tasks", function (req, res) {
    let ret_arr = [];
    let board_ID = req.params.Id;
    let board_found = false

    for (var j = 0; j < boards.length; j++){
        if (board_ID === boards[j].id){
            board_found = true; 
        }
    }

    if (board_found === true) {
        for (var i = 0; i < tasks.length; i++) {
            if (board_ID === tasks[i].boardId) {
                
                ret_arr.push(tasks[i]);
        }};
        return res.status(200).json(ret_arr);
    }
    return res.status(404).json({ "message": "The board with ID " + board_ID + " was not found."});
});

// Update a single board
app.put("/api/v1/boards/:Id/", function (req, res){

    let board_ID = req.params.Id;
    let board_name = req.body.name;
    let board_description = req.body.description;

    if (board_name !== undefined && board_description !== undefined){
        for (var i = 0; i < boards.length; i++){
            if ( board_ID == boards[i].id){
                for (var y = 0; y < tasks.length; y++){
                    if (tasks[y].archived === false && tasks[y].boardId == board_ID){

                        return res.status(400).json({"message": "The board has active tasks. Please archive or move them and try again."})
                    }}

                boards[i].name = board_name
                boards[i].description = board_description
                return res.status(200).json(boards[i])
            }}
        return res.status(400).json({"message": "Board with ID " + board_ID + " was not found."})
        
    }
    return res.status(400).json({"message": "Board name and description are required."})
})

// Delete a single board
app.delete("/api/v1/boards/:Id", function (req, res){
    let board_ID = req.params.Id
    let deleted_board = undefined

    for (var y = 0; y < tasks.length; y++){
        if (tasks[y].archived === false && tasks[y].boardId == board_ID){

            return res.status(400).json({"message": "The requested board has active tasks. Please archive or move them and try again."})
        }}
    
    for (var i = 0; i < boards.length; i++){
        if (board_ID == boards[i].id){

            deleted_board = boards[i]
            boards.splice(i, 1)
            return res.status(200).json(deleted_board)
        }
    }
    return res.status(404).json({"message": "Board with ID " + board_ID + " was not found."})
})

// Delete all boards
app.delete("/api/v1/boards", function (req, res){
    
    let ret_arr = boards
    boards = []
    tasks = []
    return res.status(200).json(ret_arr)

})

// Get a single task
app.get("/api/v1/boards/:Id/tasks/:taskId", function (req, res){
    let board_ID = req.params.Id;
    let task_ID = req.params.taskId;

    for (var i = 0; i < boards.length; i++){
        if (board_ID == boards[i].id){
            for (var y = 0; y < tasks.length; y++){
                if (task_ID == tasks[y].id){
                    return res.status(200).json(tasks[y])
                }
            }
            return res.status(404).json({"message": "Task " + task_ID + " was not found."})
        }
        return res.status(404).json({"message": "Board with ID " + board_ID + " was not found."})
    }

})

// Create a task
app.post("/api/v1/boards/:Id/tasks", function (req, res) {

    let board_ID = req.params.Id;

    let new_task = { id: task_counter.toString(), boardId: board_ID, taskName: req.body.taskName, dateCreated: new Date(Date.now()), archived: false };
    task_counter++;

    tasks.push(new_task);

    let board_found = false;

    for (var i = 0; i < boards.length; i++) {
        if (board_ID === boards[i].id) {
            board_found = true;
            boards[i].tasks.push(new_task.id.toString());
        }
    }
    if (board_found === true) {
        return res.status(201).json(new_task);
    }
    return res.status(400).json({ "message": "Board with board id " + board_ID + " was not found. The task was not created." })
})

// Delete a single task
app.delete("/api/v1/boards/:Id/tasks/:taskId", function (req, res) {
    let board_ID = req.params.Id;
    let task_ID = req.params.taskId;
    let ret_val = undefined
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === task_ID) {


            for (var j = 0; j < boards.length; j++) {
                if (boards[j].id === board_ID) {
                    // boards[j].tasks.splice(j, 1) // ???????????????
                    for (var y = 0; y < boards[j].tasks.length; y++){
                        if (boards[j].tasks[y] == task_ID){
                            boards[j].tasks.splice[y, 1]
                            ret_val = tasks[i]
                            tasks.splice(i, 1)
                            return res.status(200).json(ret_val)
                        }
                    }
                    
                }
            }
            
        }
    }
    if (ret_val !== undefined){
        return res.status(200).json(ret_val)
    }
    return res.status(400).json({ "message": "Task or ID not found."})
})

// Partially update a task
app.patch("/api/v1/boards/:Id/tasks/:taskId", function (req, res) {
    let board_ID = req.params.Id;
    let task_ID = req.params.taskId;
    let new_board_ID = req.body.boardId
    let ret_val = undefined

    if ( req.body.archived !== undefined || req.body.boardId !== undefined || req.body.taskName !== undefined ) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === task_ID) {
                if (tasks[i].boardId != board_ID) { 
                    return res.status(400).json({"message": "Task " + task_ID + " not found on board " + board_ID})
                }
                if (req.body.archived !== undefined) {
                    tasks[i].archived = req.body.archived
                }
                if (new_board_ID !== undefined) {
                    if (new_board_ID != tasks[i].boardId){
                        
                        tasks[i].boardId = new_board_ID;

                        for (j = 0; j < boards.length; j++){
                            if (boards[j].id == board_ID){
                                
                                for (y = 0; y < boards[j].tasks.length; y++){
                                    if (boards[j].tasks[y] == task_ID)
                                        boards[j].tasks[y].slice(y, 1)
                                        break;
                                }
                            }
                            if (boards[j].id == new_board_ID){
                                boards[j].tasks.push(task_ID.toString())
                }}}}
                if (req.body.taskName !== undefined) {
                    tasks[i].taskName = req.body.taskName
                }
                ret_val = tasks[i]

            }
        }
        return res.status(201).json(ret_val);
    };
    return res.status(400).json({ "message": "At least one parameter is required. boardId, taskName or archived." })
})

// Unsupported method handling
app.all("/*", function (req, res){
    return res.status(405).json({"message": req.method + " method is not supported at " + req.url})
})

//Start the server
app.listen(port, () => {
    console.log('Event app listening...');
});