// Form Submission Logic
document.getElementById("submitBtn").addEventListener("click", function() {
    const todo = document.getElementById("addTodo").value;
    const description = document.getElementById("description").value;
   
   
    const formData = {
        addTodo: todo,
        description: description,
       
        
    };

    axios.post('/api/save-data', formData)
        .then(response => {
            alert(response.data.message); // Display the success message from the server
            fetchAndDisplaytodos(); // Refresh the todo list after data is saved
        })
        .catch(error => {
            console.error('Error saving data: ', error);
        });

       
});

// todo Deletion Functionality
function deletetodo(todoId) {
    axios.delete(`/api/delete-todo/${todoId}`)
    
        .then(res => {
            
            alert(res.data.message);
            fetchAndDisplaytodos(); // Refresh the todo list after deletion
        })
        .catch(error => {
            console.error('Error deleting todo: ', error);
        });
       
    
       
}

function markAsDone(todoId) {
    axios.put(`/api/mark-done/${todoId}`)
        .then(response => {
            alert(response.data.message);
            fetchAndDisplaytodos();
        })
        .catch(error => {
            console.error('Error marking as done: ', error);
        });
}

// Fetch and Display todos
function fetchAndDisplaytodos() {
    axios.get('/api/get-todos')
        .then(response => {
            const todos = response.data;
            const todoList = document.getElementById('items');
            const doneList = document.getElementById('done');

            if (!todoList || !doneList) {
                console.error('Error: todoList or doneList element not found.');
                return;
            }

            // Clear the lists
            todoList.innerHTML = '';
            doneList.innerHTML = '';

            if (todos.length === 0) {
                // Handle the case when there are no tasks
                const noTasksMessage = document.createElement('li');
                noTasksMessage.textContent = 'No tasks available.';
                todoList.appendChild(noTasksMessage);
                return;
            }

            todos.forEach(todo => {
                const listItem = document.createElement('li');
                listItem.textContent = `task: ${todo.addTodo}, description: ${todo.description}`;

                const doneButton = document.createElement('button');
                doneButton.textContent = 'Done';
                doneButton.addEventListener('click', () => markAsDone(todo.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deletetodo(todo.id));

                listItem.appendChild(doneButton);
                listItem.appendChild(deleteButton);

                if (todo.isDone) {
                    doneList.appendChild(listItem);
                } else {
                    todoList.appendChild(listItem);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching todos: ', error);
        });
}
// Call the fetchAndDisplayexpenses function when the page is fully loaded
window.addEventListener('load', fetchAndDisplaytodos);


