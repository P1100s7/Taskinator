//* after you copy this js corrently see 4.4.1 to finish this awful module 
// for some reason the tasks still start at in progress when it says to do ur on the top of 4.4.6
// finish this on the 18th you bitch ass mf

var tasks = [];
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInputs = document.querySelector("input[name='task-name']").value;
  var taskTypeInputs = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInputs === "" || taskTypeInputs === "") {
    alert("you need to fill out the task form!");
    return false;
  }
  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  //check if task is new or one being edited by seeing if it has a data-task-id attribute
  var isEdit = formEl.getAttribute("data-task-id");

  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInputs, taskTypeInputs, taskId);
  } else {
    var taskDataObj = {
      name: taskNameInputs,
      type: taskTypeInputs,
      status: "To Do"
    };
    createTaskEl(taskDataObj);
  }
  console.log(taskDataObj);
  console.log(taskDataObj.status)
};

var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);

  //create task actions (buttons and select) for task
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  
  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  // takes the value from the id and adds it to taskDataObj which can then add the data to the tasks array 4.4.4
  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  //4.4.5
  saveTasks();

  //increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function (taskId) {
  //create container to hold elements
  var actionsContainerEl = document.createElement("div");
  actionsContainerEl.className = "task-actions";

  //create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionsContainerEl.appendChild(editButtonEl);

  //create delete btn
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionsContainerEl.appendChild(deleteButtonEl);

  //create change status dropdown
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  actionsContainerEl.appendChild(statusSelectEl);

  //create status options
  var statusChoice = ["to do", "in progress", "completed"];

  for (var i = 0; i < statusChoice.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoice[i]);
    statusOptionEl.textContent = statusChoice[i];

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionsContainerEl;
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find task list item with taskId value
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object with the new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  // 4.4.5
  saveTasks();

  alert("Task Updated!");

  // remove data attribute from form
  formEl.removeAttribute("data-task-id");
  // update formEl button to go back to saying "Add Task" instead of "Edit Task"
  // just changed document from formEl i think it was a typo
  document.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function (event) {
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } 
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function (event) {
  console.log(event.target.value);

  // find task list item based on event.target's data-task-id attribute
  var taskId = event.target.getAttribute("data-task-id");

  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // convert value to lower case
  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update tasks in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].status = statusValue);
  }

  // 4.4.5
  saveTasks();

};

var editTask = function (taskId) {
  console.log(taskId);

  // get task list item element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);

  // write values of taskname and taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form with a value of the task's id so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);
  // update form's button to reflect editing a task rather than creating a new one
  formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function (taskId) {
  console.log(taskId);
  // find task list element with taskId value and remove it
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  //create new array to hold updated list of tasks
  var updateTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesnt match the value of taskId, lets keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updateTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updateTaskArr;

  // 4.4.5
  saveTasks();
};

// 4.4.5
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);
