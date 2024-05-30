document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTaskToDOM(task));

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = { text: taskText, id: Date.now().toString() };
        addTaskToDOM(task);
        saveTaskToStorage(task);

        taskInput.value = '';
    }

    function addTaskToDOM(task) {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', task.id);
        listItem.innerHTML = `
            <span>${task.text}</span>
            <input type="text" class="editInput" style="display: none;">
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        `;

        taskList.appendChild(listItem);

        const editBtn = listItem.querySelector('.editBtn');
        const deleteBtn = listItem.querySelector('.deleteBtn');
        const span = listItem.querySelector('span');
        const editInput = listItem.querySelector('.editInput');

        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(listItem);
            removeTaskFromStorage(task.id);
        });

        editBtn.addEventListener('click', () => {
            if (editInput.style.display === 'none') {
                editInput.style.display = 'block';
                editInput.value = span.textContent;
                span.style.display = 'none';
                editBtn.textContent = 'Save';
            } else {
                const newText = editInput.value.trim();
                if (newText !== '') {
                    span.textContent = newText;
                    editInput.style.display = 'none';
                    span.style.display = 'block';
                    editBtn.textContent = 'Edit';
                    updateTaskInStorage(task.id, newText);
                } else {
                    alert('Task cannot be empty.');
                }
            }
        });
    }

    function saveTaskToStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTaskFromStorage(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function updateTaskInStorage(taskId, newText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, text: newText };
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
