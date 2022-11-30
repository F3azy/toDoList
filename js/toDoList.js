//Francesco Carvelli
class ToDoList {
    #tasks
    #tasksDate
    #list

    constructor(list) {
        this.#tasks = new Array();
        this.#tasksDate = new Array();
        this.#list = list;
    }

    #addTask(myTask) {
        this.#tasks.push(myTask);

        const taskText = document.createElement("span");
        taskText.innerHTML = myTask;

        return taskText;
    }

    #addTaskDates(myTaskDate) {
        if (myTaskDate === "") {
            myTaskDate = "No Date";
        }

        this.#tasksDate.push(myTaskDate);

        const taskEmptyDate = document.createElement("span");
        taskEmptyDate.innerHTML = myTaskDate;

        return taskEmptyDate;
    }

    #createCloseButton() {
        const closeButton = document.createElement("span");
        closeButton.classList.add("close");
        closeButton.innerHTML = "X";

        closeButton.addEventListener("click", () => {
            this.#tasks.splice(closeButton.parentElement.value, 1);
            this.#tasksDate.splice(closeButton.parentElement.value, 1);
        });

        closeButton.addEventListener("click", function () {
            this.parentElement.remove();
        });

        closeButton.addEventListener("click", () => { this.#updateLS(); });
        closeButton.addEventListener("click", () => { this.#giveValues(); });

        return closeButton;
    }

    #giveValues() {
        const myListElem = this.#list.getElementsByTagName("li");
        for (let i = 0; i < myListElem.length; ++i) {
            myListElem[i].value = i;
        }
    }

    #updateTask(taskText) {
        taskText.style.display = "none";

        const newInputCon = document.createElement("div");
        const newInput = document.createElement("input");
        newInputCon.append(newInput);

        newInput.type = "text";

        newInput.value = taskText.innerHTML;

        newInput.addEventListener("blur", () => { this.#inputChange(taskText, newInputCon) });

        taskText.parentElement.prepend(newInputCon);

        newInput.focus();
    }

    #inputChange(taskText, newInputCon) {
        taskText.innerHTML = newInputCon.firstChild.value;

        this.#tasks[newInputCon.parentElement.value] = taskText.innerHTML;

        this.#updateLS();

        taskText.style.display = "block";
        newInputCon.remove();
    }

    #updateLS() {
        let LSTAB = new Array();

        for (let i = 0; i < this.#tasks.length; i++) {
            LSTAB.push(this.#tasks[i].concat(";", this.#tasksDate[i]));
        }

        localStorage.setItem("toDoList", JSON.stringify(LSTAB));
    }

    createItem(myTask, myTaskDate) {
        const taskText = this.#addTask(myTask);
        const taskDate = this.#addTaskDates(myTaskDate);

        const myLi = document.createElement("li");

        taskText.addEventListener("click", () => { this.#updateTask(taskText) });

        myLi.appendChild(taskText);
        myLi.appendChild(taskDate);

        const closeButton = this.#createCloseButton();

        myLi.appendChild(closeButton);

        this.#list.appendChild(myLi);

        this.#giveValues();

        this.#updateLS();
    }

    searchTask(searchInput) {
        if (searchInput.length >= 3) {
            var filter = searchInput.toUpperCase();
            this.#hideNotSearched(filter);
        }
        else {
            this.#resetDisplay();
        }
    }

    #hideNotSearched(filter) {
        let myListElem = this.#list.getElementsByTagName("li");

        const regex = new RegExp(filter, 'gi');

        for (let i = 0; i < myListElem.length; ++i) {
            var task = myListElem[i].firstChild.innerText || myListElem[i].firstChild.textContent;

            if (task.toUpperCase().indexOf(filter) > -1) {
                let text = myListElem[i].firstChild.innerHTML;
                text = text.replace(/(<mark>|<\/mark>)/gim, '');
                const newText = text.replace(regex, '<mark>$&</mark>');
                myListElem[i].firstChild.innerHTML = newText;

                myListElem[i].style.display = 'flex';
                myListElem[i].classList.remove("last-visible");
            }
            else
                myListElem[i].style.display = 'none';
        }

        this.#checkLastVisible();
    }

    #checkLastVisible() {
        let myListElem = this.#list.getElementsByTagName("li");

        for(let i = myListElem.length-1; i >= 0; --i)
        {
            if(myListElem[i].style.display == 'flex')
            {
                myListElem[i].classList.add("last-visible");
                break;
            }
        }
    }

    #resetDisplay() {
        let myListElem = this.#list.getElementsByTagName("li");

        for (let i = 0; i < myListElem.length; ++i) {
            let text = myListElem[i].firstChild.innerHTML;
            text = text.replace(/(<mark>|<\/mark>)/gim, '');
            myListElem[i].firstChild.innerHTML = text;
            myListElem[i].style.display = 'flex';
            myListElem[i].classList.remove("last-visible");
        }
    }

    validation(myTask, myTaskDate) {
        let alerts = "";

        if(myTask == "")
        {
            alerts+="You need to write something!\n";
        }

        if(myTask.length < 3)
        {
            alerts+="Too short!\n";
        }

        if(myTask.length > 255)
        {
            alerts+="Too long!\n";
        }

        if(myTaskDate)
        {
            var temp = new Date();
            var y = temp.getFullYear();
            var m = temp.getMonth();
            var d = temp.getDate();
            var today = new Date(y,m,d);
    
            var date = myTaskDate.split('-')
    
            var taskDate = new Date(date[0], date[1]-1, date[2]);
    
            if(taskDate < today)
            {
                alerts+="The task date have to be a future date!\n";
            }
        }

        return alerts;
    }
}

const myList = document.getElementById("myList");
const addTask = document.getElementById("addTask");
const searchTask = document.getElementById("searchTask");

const toDoList = new ToDoList(myList);

if (!(localStorage.getItem("toDoList") === null)) {
    let allTasksTemp = JSON.parse(localStorage.getItem("toDoList"));

    for (let i = 0; i < allTasksTemp.length; i++) {
        var info = allTasksTemp[i].split(';');
        toDoList.createItem(info[0], info[1]);
    }
}

addTask.addEventListener("click", () => {
    const myTask = document.getElementById("myTask");
    const myTaskDate = document.getElementById("myTaskDate");


    let tasktext = myTask.value.trim();

    const alerts = toDoList.validation(tasktext, myTaskDate.value);

    if(alerts !== "") {
        alert(alerts);
    }
    else {
        toDoList.createItem(tasktext, myTaskDate.value);
        myTask.value = "";
        myTaskDate.value = "";
    }
});

searchTask.addEventListener("input", () => { toDoList.searchTask(searchTask.value) });