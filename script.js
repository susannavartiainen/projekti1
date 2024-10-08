// viittaukset DOM-elementteihin
const todoForm = document.getElementById('todo-form'); // lomake johon käyttäjä kirjoittaa uuden tehtävän
const todoInput = document.getElementById('todo-input'); // tekstikenttä johon käyttäjä syöttää tehtävän nimen
const todoList = document.getElementById('todo-list'); // HTML-elementti, johon kaikki tehtävät renderöidään
const errorMessage = document.getElementById('error-message'); // elementti jossa näytetään virheilmoituksia jos syöte ei ole kelvollinen
const taskCounter = document.getElementById('task-counter'); // näyttää aktiivisten tehtävien määrän
// nappeja joilla suodatetaan tehtäviä niiden tilan mukaan (näytä kaikki, näytä aktiiviset, näytä tehdyt)
const showAllBtn = document.getElementById('show-all'); 
const showActiveBtn = document.getElementById('show-active');
const showCompletedBtn = document.getElementById('show-completed'); 

let todos = JSON.parse(localStorage.getItem('todos')) || []; // tämä lataa tehtävät selaimen localstorage-muistista

function updateTaskCounter() { // tämä funktio laskee aktiivisten tehtävien määrän ja päivittää sen näytölle
    const activeTasks = todos.filter(todo => !todo.completed).length; // suodattaa kaikki aktiiviset tehtävät ja laskee niiden määrän
    taskCounter.textContent = `Tehtäviä: ${activeTasks}`; // päivittää tehtävien laskurin näyttämään aktiivisten tehtävien määrän
}

function saveToLocalStorage() { // tämä tallentaa tehtävät localstorageen
    localStorage.setItem('todos', JSON.stringify(todos)); // Tallentaa todos-taulukon JSON-muodossa localstorageen
}

// Tehtävän luonti ja käsittely
function createTodoElement(todo) {
    const li = document.createElement('li'); // luo elementti <li> joka on tehtävän sisältö
    li.textContent = todo.text; // tehtävän teksti <li> elementtiin
    li.className = todo.completed ? 'completed' : ''; // jos teyhtävä on merkitty tehdyksi, lisätään completed luokka, muuten ei

    const completeBtn = document.createElement('button'); // luodaan uusi painike joka merkitsee tehtävän tehdyksi tai palauttaa sen
    completeBtn.textContent = todo.completed ? 'Palauta' : 'Tehty'; // painikkeen teksti sen mukaan onko tehtävä tehty vai ei
    completeBtn.addEventListener('click', () => toggleComplete(todo)); // lisätään klikkauksen kuuntelija joka vaihtaa tehtävän tilan

    const deleteBtn = document.createElement('button'); // painike joka poistaa tehtävän
    deleteBtn.textContent = 'Poista'; // painikkeen teksti on "poista"
    deleteBtn.addEventListener('click', () => deleteTodo(todo)); // lisätään klikkauksen kuuntelija joka poistaa tehtävän
    
    li.appendChild(completeBtn); // lisätään completeBtn ja deleteBtn <li> elementtiin
    li.appendChild(deleteBtn); // lisätään deleteBtn <li> elementtiin
    return li; // palautetaan luotu <li> elementti, joka sisältää tehtävän tiedot ja painikkeet
}

// Lisää tehtävä listaan
function addTodo(text) {
    const newTodo = { text, completed: false }; // luo uuden tehtäväobjektin, joka sisältää tekstin ja merkin että se on vielä tekemättä
    todos.push(newTodo); // uusi tehtävä taulukkoon
    saveToLocalStorage(); // tallentaa kaikki tehtävät localstorageen
    renderTodos(); // renderöi kaikki tehtävät uudelleen
}

// Merkitse tehtävä tehdyksi
function toggleComplete(todo) {
    todo.completed = !todo.completed; // vaihda tehtävän "completed" tila 
    saveToLocalStorage();
    renderTodos();
}

// Poista tehtävä
function deleteTodo(todo) {
    todos = todos.filter(t => t !== todo); // suodata poistettava tehtävä todos-taulukosta
    saveToLocalStorage();
    renderTodos();
}

// Näytä tehtävät
function renderTodos(filter = 'all') {
    todoList.innerHTML = ''; // tyhjentää nykyisen listan, jotta voidaan renderöidä tehtävät uudelleen
    const filteredTodos = todos.filter(todo => { // suodattaa tehttävät valitun suodattimen mukaan
        if (filter === 'active') return !todo.completed; // palauttaa aktiiviset tehtävät
        if (filter === 'completed') return todo.completed; // palauttaa tehdyt tehtävt
        return true; // palauttaa kaikki tehtävät
    });

    filteredTodos.forEach(todo => { // renderöi suodatetut tehtävät
        todoList.appendChild(createTodoElement(todo)); // lisää kaikki suodatetut tehtävät listaan
    });

    updateTaskCounter(); // päivittää tehtävien laskurin
}

// Lomakkeen lähetys
todoForm.addEventListener('submit', function (e) {
    e.preventDefault(); // estää lomakkeen oletuskäyttäytymisen
    const text = todoInput.value.trim(); // trimmaa ylimääräiset välilyönnit pois syötteestä

    // Tarkista syöte
    if (text.length < 3) { // syöte väh. 3 merkkiä
        errorMessage.textContent = 'Tehtävän täytyy olla vähintään 3 merkkiä pitkä.'; // virheilmoitus
        errorMessage.style.display = 'block'; // näyttää virheilmoituksen
        todoInput.style.borderColor = 'red'; // tekstikentän reunaväri
    } else {
        errorMessage.style.display = 'none'; // ei virheilmoitusta
        todoInput.style.borderColor = '';
        addTodo(text);
        todoInput.value = '';
    }
});

// Suodatusnappien toiminnot
showAllBtn.addEventListener('click', () => renderTodos('all')); // näytä kaikki tehtävät
showActiveBtn.addEventListener('click', () => renderTodos('active')); // näytä vain aktiiviset tehtävät
showCompletedBtn.addEventListener('click', () => renderTodos('completed')); // näytä vain tehdyt tehtävät

// Lataa tehtävät alussa
renderTodos(); // renderöi kaikki tehtävät alussa
