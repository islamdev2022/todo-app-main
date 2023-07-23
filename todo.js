// Get DOM elements
const addBtn = document.getElementById('add');
const todoList = document.getElementById('to');
const todoInput = document.getElementById('type');
const itemsLeft = document.getElementById('nbritem');
const completedbtn=document.getElementsByClassName('btns')[2];
const clearAll=document.getElementById('clear');

const filterAllBtn = document.getElementsByClassName('btns')[0];
const filterActiveBtn = document.getElementsByClassName('btns')[1];
const filterCompletedBtn = document.getElementsByClassName('btns')[2];

// random number function
function generateRandomId() {
  const randomNumber = Math.floor(Math.random() * 100000);
  return randomNumber;
}

getTasks();
updateItemsLeft();
// Event listener for the add button
addBtn.addEventListener('click', () => {
    addTask();
    saveTasks();

  todoInput.value="";
});
clearAll.addEventListener('click', () => {
    removeAllCompletedTasks();
    saveTasks();
  });

filterActiveBtn.addEventListener('click', () => {
    showActiveTasks();
  });
  
filterCompletedBtn.addEventListener('click', () => {
    showCompletedTasks();
  });
  
filterAllBtn.addEventListener('click',()=>{
    showAllTasks()
})
  function showAllTasks() {
    Array.from(todoList.children).forEach((item) => {
      item.style.display = 'block';
      item.style.cssText="position:absolute:"
    });
  }
  
  function showActiveTasks() {
    Array.from(todoList.children).forEach((item) => {
      if (item.classList.contains('check')) {
        item.style.display = 'none';
      } else {
        item.style.display = 'block';
        item.style.cssText="position:absolute:"
      }
    });
  }
  
  function showCompletedTasks() {
   
    Array.from(todoList.children).forEach((item) => {
        if (item.classList.contains('check')) {
        item.style.display = 'block';
        item.style.cssText="position:absolute:"
      } else {
        item.style.display = 'none';
      }
    });
  }
// Function to add a task
function addTask() {
  const taskText = todoInput.value.trim();

  if (taskText === "") {
    return;
  }
  const randomId = generateRandomId();
  const listItem = createListItem(taskText);
  listItem.setAttribute('id', randomId);
  todoList.appendChild(listItem);
  
  updateItemsLeft();
}
// Function to create a button
function createButton(src, className, onClick) {
  const button = document.createElement('img');
  button.src = src;
  button.className = className;
  button.addEventListener('click', onClick);

  return button;
}

// Function to create a list item
function createListItem(text) {
  const listItem = document.createElement('li');
  const taskText = document.createTextNode(text)

  const deleteBtn = createButton('images/icon-cross.svg', 'del', deleteTask);
  const checkBtn = createButton('images/icon-check.svg', 'checking', completeTask);

  listItem.appendChild(taskText);
  listItem.appendChild(deleteBtn);
  listItem.appendChild(checkBtn);

  return listItem;
}

// Function to delete a task
function deleteTask() {
  const listItem = this.parentElement;
  listItem.remove();
  saveTasks();updateItemsLeft();
  const tasks = gettaskparse();
   tasks.filter(task => task !== todoList);//TO REMOVE IT FROM THE LOCAL STORAGE TOO
}

// Function to mark a task as completed
function completeTask() {

  const listItem = this.parentElement;
  if (listItem.className==='')
  {listItem.classList.add("check")}
  else if(listItem.className==='check'){
    listItem.classList.remove("check")
  }
}

// Function to update the count of remaining tasks
function updateItemsLeft() {
  itemsLeft.textContent = todoList.childElementCount;
}
// Function to delete all completed tasks
function removeAllCompletedTasks() {
    
    Array.from(todoList.children).forEach((task) => {
        if (task.classList.contains('check')) {
      task.remove();}
    });
  
    updateItemsLeft();
  }

  
// now for the dark mode

const darkModeToggle = document.getElementById('darkModeToggle');
const mode=document.getElementById('mode')

darkModeToggle.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  const elementsToToggle = document.querySelectorAll('.image,.body, .do,.ulu,.all,li,#links,#clear');
  elementsToToggle.forEach(element => {             // THIS IS FOR ADDING THE CLASS "DARK MODE" INTO THE ELEMENTS I WANT (ABOVE) 
    element.classList.toggle('dark-mode');
  });

  if (document.body.classList.contains('dark-mode')) {
    mode.src = 'images/icon-moon.svg';
    mode.alt = 'Dark Mode';
    Array.from(todoList.children).forEach((item) => {
      item.style.backgroundColor=" hsl(237, 14%, 26%)"
      item.style.color='white'
    })
  } else {
    mode.src = 'images/icon-sun.svg';
    mode.alt = 'ligh mode';
    Array.from(todoList.children).forEach((item) => {
      item.style.backgroundColor=" white"
      item.style.color='black'
    })
  }
}


saveTasks()
// Save tasks to local storage
function saveTasks() {
  const tasks = [];
  const list = document.getElementById('to');
  const listItems = list.getElementsByTagName('li');
  
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const taskText = listItem.textContent;
    tasks.push(taskText);
  }

  window.localStorage.setItem('tasks', JSON.stringify(tasks));
}


function gettaskparse(){ //TO GET THE TASKS FROM LOCAL STORAGE AS AN ARRAY
  const storedTasks = window.localStorage.getItem('tasks');
  const arrtasks = JSON.parse(storedTasks)}



// Retrieve tasks from local storage
function getTasks() { //TO GET THE TASKS FROM LOCAL STORAGE AS A NODE FOR THE LIST
  const storedTasks = window.localStorage.getItem('tasks');
  if (storedTasks) {
    const arrtasks = JSON.parse(storedTasks)
    arrtasks.forEach((task) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(task, 'text/html');
      const node = doc.body.firstChild;
      const listItem = document.createElement('li');

      listItem.appendChild(node)
      todoList.appendChild(listItem)
      const deleteBtn = createButton('images/icon-cross.svg', 'del', deleteTask);
      const checkBtn = createButton('images/icon-check.svg', 'checking', completeTask);
      listItem.appendChild(deleteBtn);
      listItem.appendChild(checkBtn);
      
    })

  }
}


// NOW FOR THE DRAG AND DROP

document.addEventListener('DOMContentLoaded', function() {
  const list = document.getElementById('to');

  // Allow the `li` elements to be dragged
  const listItems = list.querySelectorAll('li');
  

  listItems.forEach(function(item) {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', drop);
    item.addEventListener('dragend', dragEnd);
    item.setAttribute('draggable','true')
  });


let draggedItem = null;

function dragStart(e) {
  draggedItem = e.target;
  // Add a 'dragging' class to the item being dragged
  e.target.classList.add('dragging');
  
}

function dragOver(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function drop(e) {
  e.preventDefault();
  // Remove the 'dragging' class from the dragged item
  this.classList.remove('drag-over');
    const dropIndex = Array.from(listItems).indexOf(this);
    const draggedIndex = Array.from(listItems).indexOf(draggedItem);
    if (dropIndex > draggedIndex) {
      this.parentNode.insertBefore(draggedItem, this.nextSibling);
    } else {
      this.parentNode.insertBefore(draggedItem, this);
    }
}

function dragEnd(e) {
  listItems.forEach(function(item) {
    item.classList.remove('drag-over');
    item.classList.remove('dragging')
  });
}
});