const normalTask = "<img src='assets/img/infoSign.svg'>"
const workingTask = "<img src='assets/img/working.svg'>"
const timeLimitedTask = "<img src='assets/img/timeLimited.svg'>"
const doneTask = "<img src='assets/img/Done.svg'>"
const failedTask = "<img src='assets/img/failed.svg'>"

const tasksContainer = document.getElementById("tasksContainer");

const notificationContainer = document.querySelector(".notificationBlockPopUp");
let notificationContainerSwhown = false;

const taskName = document.getElementById("taskNameInput");
const executor = document.getElementById("executorInput");
const task = document.getElementById("taskInput");
const expiration = document.getElementById("expirationInput");

const overlay = document.getElementById("overlay");
const popUp = document.getElementById("popUp");
const dateFormatRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.\d{4}$/;

let inputValidated;
let submitButton = document.getElementById("submitButton");
let box = document.querySelector(".hiddenBox");

let toBeDeleted = [];

let deleteButton = document.querySelector(".deleteButton");

let nrOfNotifications = 0;
let failedTasks = [];
let lowTimeTask = [];

let filters = [];

taskInitialisation();

document.querySelector(".seeDeletedBlocks").addEventListener("click", showDeletingPage);

deleteButton.addEventListener("click", removeBoxes);

document.querySelector(".filterTasks").addEventListener("click", showHideFilterPopUp)



document.getElementById("filterNormal").addEventListener("click", function() {
    addAndRemoveFilters(0, "filterNormal");
  });
  
  document.getElementById("filterWorking").addEventListener("click", function() {
    addAndRemoveFilters(1, "filterWorking");
  });
  
  document.getElementById("filterDone").addEventListener("click", function() {
    addAndRemoveFilters(3, "filterDone");
  });
  
  document.getElementById("filterTimeLimited").addEventListener("click", function() {
    addAndRemoveFilters(2, "filterTimeLimited");
  });
  
  document.getElementById("filterFiled").addEventListener("click", function() {
    addAndRemoveFilters(4, "filterFiled");
  });
  
  function addAndRemoveFilters(filter, filterName) {
    if (filters.includes(filter)) {
      let index = filters.indexOf(filter);
      if (index !== -1) {
        filters.splice(index, 1);
      }
      document.getElementById(filterName).classList.remove("filterElementChecked");
    } else {
      filters.push(filter);
      document.getElementById(filterName).classList.add("filterElementChecked");
    }
    filterDisplayedElements();
  }
  


function taskInitialisation(){
    // localStorage.clear()
    if (localStorage.getItem("tasks")){
        let tasks = localStorage.getItem("tasks");
        tasks = JSON.parse(tasks);
        for (let key in tasks){
            if (tasks[key].status === 0 ){
                actualStatus = seeExpirationstatus(tasks[key].expiration)
                taskConstructor(tasks[key].taskName, tasks[key].executor, tasks[key].task, tasks[key].expiration, actualStatus, key)
                if(actualStatus !== 0){
                    nrOfNotifications++;
                    if(actualStatus === 2){
                        lowTimeTask.push([tasks[key].taskName, tasks[key].executor, tasks[key].expiration])
                    }
                    else{
                        failedTasks.push([tasks[key].taskName, tasks[key].executor, tasks[key].expiration])
                    }
                }
            }
            else{
                taskConstructor(tasks[key].taskName, tasks[key].executor, tasks[key].task, tasks[key].expiration, tasks[key].status, key)
            }
        }
    }
    if(nrOfNotifications){
        let numberOfNotifications = document.querySelector(".notificationAboutTasks")
        numberOfNotifications.innerHTML = nrOfNotifications
        numberOfNotifications.style.padding = "2px 5px "

        while (lowTimeTask.length > 0) {
            const poppedElement = lowTimeTask.pop();
            addElementIntoNotificationBar(poppedElement[0], poppedElement[1], poppedElement[2])
        }

        while (failedTasks.length > 0) {
            const poppedElement = failedTasks.pop();
            addElementIntoNotificationBar(poppedElement[0], poppedElement[1], poppedElement[2], true)
        }
    }
}

document.querySelector(".notificationBlock").addEventListener('click', function(){
    if (!notificationContainerSwhown){
        notificationContainer.style.display = "flex"
        notificationContainerSwhown = true;
    }
    else{
        notificationContainer.style.display = "none"
        notificationContainerSwhown = false;
    }
})

function addElementIntoNotificationBar(taskName, executor, expiration, isFailed = false){
    let ajustments = "";
    if(!isFailed){
        ajustments = "<div class='notificationDescription' style='color: #FFB55E'>" + executor + " should complete task " + taskName + " till " + expiration + "</div>";
    }
    else {
        ajustments = "<div class='notificationDescription' style='color: #FF5E5E'>" + "Task " + taskName +" was failed by " + executor + "</div>";
    }
    notificationContainer.insertAdjacentHTML("beforeend", ajustments)
}


function seeExpirationstatus(date){
    let [targetDay, targetMonth, targetYear] = date.split(".");
    let target = new Date(targetYear, targetMonth - 1, targetDay);
    let today = new Date();
    let timeDifference = target.getTime() - today.getTime();
    let remainingHours = Math.ceil(timeDifference / (1000 * 60 * 60));
    if (remainingHours > 24 ){
        return 0;
    }
    else if (remainingHours > 0 ){
        return 2;
    }
    return 4
}


document.getElementById("newTaskButton").addEventListener("click", showPopUp);
document.getElementById("closePopUp").addEventListener("click", hidePopUp);
document.getElementById("submitButton").addEventListener("click", addTaskToList);


taskName.addEventListener("input", function(e){
    inputValidated.taskName = validateInputs(taskName)
    enableDisableSubmit()
})
executor.addEventListener("input", function(e){
    inputValidated.executor = validateInputs(executor)
    enableDisableSubmit()
})
task.addEventListener("input", function(e){
    inputValidated.task = validateInputs(task)
    enableDisableSubmit()
})
expiration.addEventListener("input", function(e){
    inputValidated.expiration = validateDateInput(expiration)
    enableDisableSubmit()
})



function showPopUp(){
    taskName.value = "";
    executor.value = "";
    task.value = "";
    expiration.value = "";
    overlay.style.display = "block";
    popUp.style.display = "flex";
    inputValidated = {
        "taskName"  : false,
        "executor"  : false,
        "task"      : false,
        "expiration": false,
    };
}

function hidePopUp(){        
    overlay.style.display = "none";
    popUp.style.display = "none";
}


function validateDateInput(input){
    if(dateFormatRegex.test(input.value))return true;
    return false
}

function validateInputs(input){
    if( input.value.length > 0 )return true;
    return false;
}



function enableDisableSubmit(){

    if( inputValidated.taskName === true &&
        inputValidated.executor === true &&
        inputValidated.task === true &&
        inputValidated.expiration === true){
            submitButton.style.cursor = "pointer";
            submitButton.style.pointerEvents = "all";
        }
}



function addTaskToList(){
    hidePopUp()
    let newTask = {
        taskName: taskName.value,
        executor: executor.value,
        task: task.value,
        expiration: expiration.value,
        status: 0
    }

    if (localStorage.getItem("lastTasks")){
        let lastTask = JSON.parse(localStorage.getItem("lastTasks")) ;
        let tasks = JSON.parse(localStorage.getItem("tasks")) ;
        tasks[lastTask+1] = newTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("lastTasks", JSON.stringify(lastTask+1));
        taskConstructor(taskName.value, executor.value, task.value, expiration.value, 0, lastTask+1)
    }
    else{
        let lastTask = 0;
        let tasks = {};
        tasks[lastTask+1] = newTask;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("lastTasks", JSON.stringify(lastTask+1));
        taskConstructor(taskName.value, executor.value, task.value, expiration.value, 0, lastTask+1)
    }

    
}


function taskConstructor(taskName, executor, task, expiration, status, taskID){
    switch (status){
        case 1: {
            box.querySelector(".boxStatusForeground").innerHTML = workingTask;
            box.querySelector(".boxStatus").innerText = "status: working";
            break;
        }
        case 2: {
            box.querySelector(".boxStatusForeground").innerHTML = timeLimitedTask;
            box.querySelector(".boxStatus").innerText = "status: limited time";
            break;
        }
        case 3: {
            box.querySelector(".boxStatusForeground").innerHTML = doneTask;
            box.querySelector(".boxStatus").innerText = "status: done";
            break;
        }
        case 4: {
            box.querySelector(".boxStatusForeground").innerHTML = failedTask;
            box.querySelector(".boxStatus").innerText = "status: failed";
            break;
        }
        default: {
            box.querySelector(".boxStatusForeground").innerHTML = normalTask;
            box.querySelector(".boxStatus").innerText = "status: normal";
            break;
        }
    }
    box.querySelector(".boxTaskName").innerText = taskName;
    box.querySelector(".boxPersonName").innerText = executor;
    box.querySelector(".boxComents").innerText = task;
    box.querySelector(".boxExpirationDate").innerText = "expiration date: " + expiration;

    box.querySelector(".changeBoxStatus").id = "task"+taskID;
    box.querySelector(".boxExample").id = taskID;
    box.querySelector(".boxExample").setAttribute("status", status)

    tasksContainer.insertAdjacentHTML("beforeend", box.innerHTML)

    tasksContainer.addEventListener("click", function(event) {
        let target = event.target;
        if (target.matches(".changeBoxStatus")) {
          let taskId = target.id.replace("task", "");
          console.log("here");
          overlay.style.display = "block";
          document.querySelector(".popUpChangeTaskStatus").style.display = "flex";
          addEventListenersOnPopUps(taskId);
        }
    });

}


function addEventListenersOnPopUps(id){
    document.getElementById("statusNormal").addEventListener("click", function(){
        changeStatus( id, 0 )
    })
    document.getElementById("statusWorking").addEventListener("click", function(){
        changeStatus( id, 1)
    })
    document.getElementById("statusDone").addEventListener("click", function(){
        changeStatus( id, 3 )
    })
    document.getElementById("closeStatusPopUp").addEventListener("click", function(){
        removeEventListenersOnPopUps()
    })
}

function removeEventListenersOnPopUps(){
    document.getElementById("statusNormal").removeEventListener("click", function(){
        removeEventListenersOnPopUps()
    })
    document.getElementById("statusWorking").removeEventListener("click", function(){
        removeEventListenersOnPopUps()
    })
    document.getElementById("statusDone").removeEventListener("click", function(){
        removeEventListenersOnPopUps()
    })
    document.getElementById("closeStatusPopUp").removeEventListener("click", function(){
        removeEventListenersOnPopUps()
    })
    overlay.style.display = "none";
    document.querySelector(".popUpChangeTaskStatus").style.display = "none";
}

function changeStatus( id, status ){
    let tasks = JSON.parse(localStorage.getItem("tasks")) ;
    tasks[id].status = status;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    location.reload();
}


function showDeletingPage() {
  deleteButton.style.display = "flex";
  
  let boxes = document.querySelectorAll(".boxExample");

  for (let block of boxes) {
    block.style.boxShadow = "0px 16px 32px #24FF00";
    block.style.cursor = "pointer";
    
    block.addEventListener("click", handleClick);
  }
}

function removeBoxes() {
  deleteButton.style.display = "none";
  
  let boxes = document.querySelectorAll(".boxExample");

  for (let block of boxes) {
    block.style.boxShadow = "0px 16px 32px #D1DAE8";
    block.style.cursor = "default";
    block.removeEventListener("click", handleClick);
  }

    let storedObject = JSON.parse(localStorage.getItem("tasks"));
    
    for ( let id of toBeDeleted){
        let object = parseInt(id)
        delete storedObject[object];
    }

    localStorage.setItem("tasks", JSON.stringify(storedObject));

    location.reload()

}

function handleClick() {
  if (toBeDeleted.includes(this.id)) {
        let index = toBeDeleted.indexOf(this.id);
        if (index !== -1) {
            toBeDeleted.splice(index, 1);
        }
      this.style.boxShadow = "0px 16px 32px #24FF00";
    } else {
        toBeDeleted.push(this.id)
        this.style.boxShadow = "0px 16px 32px #FF5E5E";
    }
}

let filterPopUp = document.querySelector(".filterBlockPopUp");

function showHideFilterPopUp(){
    if(filterPopUp.style.display === "none"){
        filterPopUp.style.display = "flex"
    }
    else{
        filterPopUp.style.display = "none"
    }
}

function filterDisplayedElements(){
    let tasks = document.querySelectorAll(".boxExample"); 

    for (let task of tasks){
        if(filters.length === 0 ){
            task.style.display = "flex";
        }
        else if( filters.indexOf(parseInt(task.getAttribute("status"))) !== -1 ){
            task.style.display = "flex";
        }
        else{
            task.style.display = "none";
        }
    }
}

