document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.index = index;

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            taskText.addEventListener('click', () => toggleComplete(index));

            const editInput = document.createElement('input');
            editInput.className = 'edit-input';
            editInput.type = 'text';
            editInput.value = task.text;
            editInput.addEventListener('blur', () => saveEdit(index, editInput.value));
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveEdit(index, editInput.value);
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(index));

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn'; // You may want to style this button
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editTask(index));

            taskItem.appendChild(taskText);
            taskItem.appendChild(editInput);
            taskItem.appendChild(editBtn);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
        updateFilterButtons();
    };

    const addTask = () => {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    const toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const editTask = (index) => {
        const taskItem = taskList.querySelector(`[data-index='${index}']`);
        taskItem.classList.add('editing');
        const editInput = taskItem.querySelector('.edit-input');
        editInput.focus();
    };

    const saveEdit = (index, newText) => {
        tasks[index].text = newText;
        saveTasks();
        renderTasks(); // This will remove the 'editing' class
    };

    const setFilter = (newFilter) => {
        filter = newFilter;
        renderTasks();
    };

    const updateFilterButtons = () => {
        filterAllBtn.classList.toggle('active', filter === 'all');
        filterActiveBtn.classList.toggle('active', filter === 'active');
        filterCompletedBtn.classList.toggle('active', filter === 'completed');
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterActiveBtn.addEventListener('click', () => setFilter('active'));
    filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

    renderTasks();
});
