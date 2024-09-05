let button = document.querySelector(".btn-add");
let input = document.querySelector(".input-task");
let fullList = document.querySelector(".list-task");
let myTasks = [];
let editingTaskIndex = null;

function addNewTask() {

    if (input.value.trim() === "") {
        Swal.fire({
            text: "Please, type a task! :)",
            confirmButtonText: 'OK'
        })

        return;
    }

    if (editingTaskIndex !== null) {
        myTasks[editingTaskIndex].toDo = input.value;
        editingTaskIndex = null;
        button.innerHTML = "Add";
        input.style.backgroundColor = "white";
        input.style.color = "black";
        button.style.backgroundColor = "#3b8e7d";
    } else {
        myTasks.push({
            toDo: input.value,
            done: false,
            createdAt: Date.now()
        });
    }

    input.value = "";

    showTasks();

}

button.addEventListener("click", addNewTask)

//Show tasks
function showTasks() {
    let newLi = "";

    //order by timestamp
    myTasks.sort((a, b) => {
        if (a.done === b.done) {
            return a.createdAt - b.createdAt;
        }
        return a.done - b.done;
    });

    myTasks.forEach((task, pos) => {

        const checkboxImg = task.done ? "./img/bx-checkbox-checked.png" : "./img/bx-checkbox.png";
        newLi = `${newLi}
        <li class="task ${task.done && "done"}">
            <img src="${checkboxImg}" class="check-icon" alt="todo's check" onclick="doneTask(${pos})" />
            <p>${task.toDo}</p> 
            <div class="edit-trash">
                <img src="./img/edit-alt-regular-24.png" alt="edit" onclick="editTask(${pos})" />
                <img src="./img/trash-alt-regular-24.png" alt="delete" onclick="deleteTask(${pos})" />
            </div>  
        </li>
        `
    })

    fullList.innerHTML = newLi;

    localStorage.setItem("list", JSON.stringify(myTasks));
}


//Delete task
async function deleteTask(pos) {
    const result = await Swal.fire({
        title: "Delete task!",
        text: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
    })

    if (result.isConfirmed) {
        myTasks.splice(pos, 1)
        showTasks();

        console.log(pos);
    }
}

//Done task
function doneTask(pos) {
    myTasks[pos].done = !myTasks[pos].done

    showTasks();
}

//Edit task
function editTask(pos) {
    input.value = myTasks[pos].toDo;
    editingTaskIndex = pos;
    input.focus();
    button.innerHTML = "Save";
    button.style.backgroundColor = "grey";
}

//Reload tasks
function reloadItems() {
    let localStorageTasks = localStorage.getItem("list");
    if (localStorageTasks) {
        myTasks = JSON.parse(localStorageTasks);
    }

    showTasks();
}

reloadItems();