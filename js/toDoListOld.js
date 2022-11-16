const myList = document.getElementById("myList");
const addTask = document.getElementById("addTask");
const searchTask = document.getElementById("searchTask");

let allTasks = new Array();
let tasksCount = 0;

// localStorage.clear();

if (!(localStorage.getItem("toDoList") === null)) 
{
    let allTasksTemp = JSON.parse(localStorage.getItem("toDoList"));

    for (let i = 0; i < allTasksTemp.length; ++i) {
        var info = allTasksTemp[i].split(';');
        createItem(info[0], info[1]);
    }
}

addTask.addEventListener("click", () => {
    const myTask = document.getElementById("myTask");
    const myTaskDate = document.getElementById("myTaskDate");

    if(myTask.value == "")
    {
        alert("You need to write something!")
    }
    else if(myTask.value.length < 3)
    {
        alert("Too short!");
        // myTask.value = "";
    }
    else if(myTask.value.length > 255)
    {
        alert("Too long!");
        // myTask.value = "";
    }
    else if(myTaskDate.value)
    {
        var temp = new Date();
        var y = temp.getFullYear();
        var m = temp.getMonth();
        var d = temp.getDate();
        var today = new Date(y,m,d);

        var date = myTaskDate.value.split('-')

        var taskDate = new Date(date[0], date[1]-1, date[2]);

        if(taskDate < today)
        {
            alert("The task date have to be a future date!");
            // myTask.value = "";
            myTaskDate.value = "";
        }
        else
        {
            createItem(myTask.value, myTaskDate.value);
            myTask.value = "";
            myTaskDate.value = "";
        }
    }
    else
    {
        createItem(myTask.value);
        myTask.value = "";
        myTaskDate.value = "";
    }

});

searchTask.addEventListener("input", function() {
    if(this.value.length >= 3)
    {
        var filter = this.value.toUpperCase();
        myListElem = myList.getElementsByTagName("li");

        const regex = new RegExp(filter, 'gi');

        for(let i = 0; i < myListElem.length; ++i)
        {
            var task = myListElem[i].firstChild.innerText || myListElem[i].firstChild.textContent;

            if (task.toUpperCase().indexOf(filter) > -1) 
            {
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

        for(let i = myListElem.length-1; i >= 0; --i)
        {
            if(myListElem[i].style.display == 'flex')
            {
                myListElem[i].classList.add("last-visible");
                break;
            }
        }
    }
    else
    {
        myListElem = myList.getElementsByTagName("li");

        for(let i = 0; i < myListElem.length; ++i) 
        {
            let text = myListElem[i].firstChild.innerHTML;
            text = text.replace(/(<mark>|<\/mark>)/gim, '');
            myListElem[i].firstChild.innerHTML = text;
            myListElem[i].style.display = 'flex';
            myListElem[i].classList.remove("last-visible");
        }
    }
});

function createItem(myTask, myTaskDate="No date")
{
    const myLi = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.innerHTML = myTask;

    taskText.addEventListener("click", function() {
        this.style.display = "none";

        const newInputCon = document.createElement("div");
        const newInput = document.createElement("input");

        newInput.type = "text";

        newInput.value = this.innerHTML;

        newInput.addEventListener("blur", function() {
            
            taskText.innerHTML = this.value;

            var info = allTasks[this.parentElement.parentElement.value].split(';');

            allTasks[this.parentElement.parentElement.value] = taskText.innerHTML.concat(";",info[1]);

            localStorage.setItem("toDoList", JSON.stringify(allTasks));

            taskText.style.display = "block";
            this.parentElement.remove();
            
        });

        newInputCon.append(newInput);

        this.parentElement.prepend(newInputCon);

        newInput.focus();
    });

    const taskEmptyDate = document.createElement("span");
    taskEmptyDate.innerHTML = myTaskDate;

    myLi.appendChild(taskText);
    myLi.appendChild(taskEmptyDate);

    const closeButton = document.createElement("span");
    closeButton.classList.add("close");
    closeButton.innerHTML = "X";

    closeButton.addEventListener("click", function() {

        allTasks.splice(this.parentElement.value,1);

        this.parentElement.remove();
    
        tasksCount--;

        myListElem = myList.getElementsByTagName("li");

        for (let i = 0; i < myListElem.length; ++i) {
            myListElem[i].value = i;
        }

        localStorage.setItem("toDoList", JSON.stringify(allTasks));

    });

    myLi.appendChild(closeButton);

    myLi.value = tasksCount;
    tasksCount++;

    myList.appendChild(myLi);

    allTasks.push(taskText.innerHTML.concat(";",taskEmptyDate.innerHTML));

    localStorage.setItem("toDoList", JSON.stringify(allTasks));
}