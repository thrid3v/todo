let currentUser = null;
const API_URL = 'http://localhost:3002';

// User functions
async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            updateUI();
            loadTodos();
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            updateUI();
            loadTodos();
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed');
    }
}

// User search functionality
let selectedUser = null;
let searchTimeout = null;

document.getElementById('userSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim();
    const searchResults = document.getElementById('userSearchResults');
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Hide results if search is empty
    if (!searchTerm) {
        searchResults.classList.remove('active');
        selectedUser = null;
        return;
    }

    // Add debounce to prevent too many API calls
    searchTimeout = setTimeout(() => {
        fetch(`${API_URL}/users/search?name=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(users => {
                searchResults.innerHTML = '';
                users.forEach(user => {
                    const div = document.createElement('div');
                    div.className = 'user-search-result-item';
                    div.textContent = user.name;
                    div.onclick = () => selectUser(user);
                    searchResults.appendChild(div);
                });
                searchResults.classList.add('active');
            })
            .catch(error => console.error('Error searching users:', error));
    }, 300);
});

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    const searchContainer = document.querySelector('.user-search-container');
    const searchResults = document.getElementById('userSearchResults');
    
    if (!searchContainer.contains(e.target)) {
        searchResults.classList.remove('active');
    }
});

function selectUser(user) {
    selectedUser = user;
    const searchInput = document.getElementById('userSearch');
    const searchResults = document.getElementById('userSearchResults');
    
    searchInput.value = user.name;
    searchResults.classList.remove('active');
}

// Todo functions
async function addTodo() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;

    if (!title || !selectedUser) {
        alert('Please fill in all required fields and select a user');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                assignedToId: selectedUser.id,
                createdById: currentUser.id,
            }),
        });

        if (response.ok) {
            document.getElementById('todoTitle').value = '';
            document.getElementById('todoDescription').value = '';
            document.getElementById('userSearch').value = '';
            selectedUser = null;
            loadTodos();
        } else {
            alert('Failed to create todo');
        }
    } catch (error) {
        console.error('Error creating todo:', error);
        alert('Error creating todo');
    }
}

async function loadTodos() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_URL}/todos/user/${currentUser.id}`);
        const todos = await response.json();

        const assignedTodos = todos.filter(todo => todo.assignedTo.id === currentUser.id);
        const createdTodos = todos.filter(todo => todo.createdBy.id === currentUser.id);

        displayTodos('assignedTodosList', assignedTodos);
        displayTodos('createdTodosList', createdTodos);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayTodos(containerId, todos) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoElement.innerHTML = `
            <div class="todo-content">
                <div class="title">${todo.title}</div>
                ${todo.description ? `<div class="description">${todo.description}</div>` : ''}
                <div class="meta">
                    ${todo.completed ? 'Completed' : 'Pending'} | 
                    Created by: ${todo.createdBy.name} | 
                    Assigned to: ${todo.assignedTo.name}
                </div>
            </div>
            <div class="actions">
                <button class="toggle" onclick="toggleTodo(${todo.id})">
                    ${todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        container.appendChild(todoElement);
    });
}

async function toggleTodo(id) {
    try {
        const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
            method: 'PUT',
        });

        if (response.ok) {
            loadTodos();
        } else {
            alert('Failed to toggle todo');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to toggle todo');
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadTodos();
        } else {
            alert('Failed to delete todo');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete todo');
    }
}

// UI functions
async function updateUI() {
    if (currentUser) {
        document.querySelector('.user-section').style.display = 'none';
        document.querySelector('.todo-section').style.display = 'block';
        loadUsers();
    } else {
        document.querySelector('.user-section').style.display = 'flex';
        document.querySelector('.todo-section').style.display = 'none';
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const select = document.getElementById('assignTo');
        select.innerHTML = '<option value="">Select user to assign to</option>';

        users.forEach(user => {
            if (user.id !== currentUser.id) {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
}); 