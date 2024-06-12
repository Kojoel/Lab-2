const textArea = document.querySelector("#text-area");
const addItemBtn = document.querySelector("#add-item-button");
const ul = document.querySelector('.content ul');

let todoIdCounter = localStorage.getItem('todoIdCounter') ? parseInt(localStorage.getItem('todoIdCounter')) : 0;

// Load saved todo items from localStorage
function loadTodoItems() {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => {
        addItemToDOM(todo.id, todo.text, todo.completed);
    });
}

function saveTodoItems(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addItemToDOM(id, text, completed) {
    // Create todo item div
    const todoItemDiv = document.createElement('div');
    todoItemDiv.className = 'todo-item';
    todoItemDiv.style.display = 'flex';
    todoItemDiv.style.gap = '10px';

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.setAttribute('id', `checkbox-${id}`);
    checkBox.checked = completed;

    const label = document.createElement('label');
    label.htmlFor = `checkbox-${id}`;
    label.textContent = text;
    if (completed) {
        label.classList.add('completed');
    }

    todoItemDiv.appendChild(checkBox);
    todoItemDiv.appendChild(label);

    // Create update & delete buttons div
    const updelBtnDiv = document.createElement('div');
    updelBtnDiv.className = 'updel-btn';
    updelBtnDiv.style.display = 'flex';
    updelBtnDiv.style.gap = '10px';

    const updBtn = document.createElement('button');
    updBtn.textContent = 'Update';
    updBtn.setAttribute('id', `upd-button-${id}`);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('id', `del-button-${id}`);

    updelBtnDiv.appendChild(updBtn);
    updelBtnDiv.appendChild(delBtn);

    // Creating List element
    const List = document.createElement('li');
    List.style.display = "flex";
    List.style.justifyContent = 'space-between';
    List.style.alignItems = "center";
    List.style.backgroundColor = "white";
    List.style.paddingLeft = "10px";

    // Appending elements to List
    List.appendChild(todoItemDiv);
    List.appendChild(updelBtnDiv);

    ul.appendChild(List);

    // Grey out event when checkbox is clicked
    checkBox.addEventListener('change', () => {
        label.classList.toggle('completed', checkBox.checked);
        if (label.classList.contains('completed')) {
            updBtn.style.opacity = '.5';
        } else {
            updBtn.style.opacity = '1';
        }
        updateTodoItem(id, checkBox.checked, label.textContent);
    });

    // Remove List from ul when delete is clicked
    delBtn.addEventListener('click', () => {
        ul.removeChild(List);
        deleteTodoItem(id);
    });

    // Updating List when update button is clicked
    updBtn.addEventListener('click', () => {
        if (label.classList.contains('completed')) {
            alert("Cannot be updated");
        } else {
            const newText = prompt("Update your item:", label.textContent);
            if (newText && newText.trim() !== '') {
                label.textContent = newText.trim();
                updateTodoItem(id, checkBox.checked, label.textContent);
            }
        }
    });
}

function createItem() {
    if (textArea.value.trim() === '') {
        alert("No todo item entered!");
    } else {
        // Increment the counter to ensure unique IDs
        todoIdCounter++;
        localStorage.setItem('todoIdCounter', todoIdCounter);

        const id = `todo-${todoIdCounter}`;
        const text = textArea.value;
        const completed = false;

        addItemToDOM(id, text, completed);
        saveNewTodoItem(id, text, completed);

        // Clear the textarea after adding the item
        textArea.value = '';
    }
}

function saveNewTodoItem(id, text, completed) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ id, text, completed });
    saveTodoItems(todos);
}

function updateTodoItem(id, completed, text) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex > -1) {
        todos[todoIndex] = { id, text, completed };
        saveTodoItems(todos);
    }
}

function deleteTodoItem(id) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.id !== id);
    saveTodoItems(todos);
}

addItemBtn.addEventListener("click", createItem);
window.addEventListener('load', loadTodoItems);
