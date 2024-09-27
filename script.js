// Viittaukset DOM-elementteihin
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const taskCounter = document.getElementById('task-counter');
const showAllBtn = document.getElementById('show-all');
const showActiveBtn = document.getElementById('show-active');
const showCompletedBtn = document.getElementById('show-completed');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Päivitä tehtävien määrä
function updateTaskCounter() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    taskCounter.textContent = `Tehtäviä: ${activeTasks}`;
}

// Tallenna LocalStorageen
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Luo uusi tehtäväelementti
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.textContent = todo.text;
    li.className = todo.completed ? 'completed' : '';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = todo.completed ? 'Palauta' : 'Tehty';
    completeBtn.addEventListener('click', () => toggleComplete(todo));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Poista';
    deleteBtn.addEventListener('click', () => deleteTodo(todo));

    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    return li;
}

// Lisää tehtävä listaan
function addTodo(text) {
    const newTodo = { text, completed: false };
    todos.push(newTodo);
    saveToLocalStorage();
    renderTodos();
}

// Merkitse tehtävä tehdyksi
function toggleComplete(todo) {
    todo.completed = !todo.completed;
    saveToLocalStorage();
    renderTodos();
}

// Poista tehtävä
function deleteTodo(todo) {
    todos = todos.filter(t => t !== todo);
    saveToLocalStorage();
    renderTodos();
}

// Näytä tehtävät
function renderTodos(filter = 'all') {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });

    updateTaskCounter();
}

// Lomakkeen lähetys
todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = todoInput.value.trim();

    // Tarkista syöte
    if (text.length < 3) {
        errorMessage.textContent = 'Tehtävän täytyy olla vähintään 3 merkkiä pitkä.';
        errorMessage.style.display = 'block';
        todoInput.style.borderColor = 'red';
    } else {
        errorMessage.style.display = 'none';
        todoInput.style.borderColor = '';
        addTodo(text);
        todoInput.value = '';
    }
});

// Suodatusnappien toiminnot
showAllBtn.addEventListener('click', () => renderTodos('all'));
showActiveBtn.addEventListener('click', () => renderTodos('active'));
showCompletedBtn.addEventListener('click', () => renderTodos('completed'));

// Lataa tehtävät alussa
renderTodos();
