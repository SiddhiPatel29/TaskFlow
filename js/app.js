const state = {
    tasks: [],
    search: '',
    filter : 'all',
    sort : 'newest',
}

const FILTERS = {
    all: () => true,
    active: (task) => !task.completed,
    completed: (task) => task.completed,
    high: (task) => task.priority === 'high',
    low: (task) => task.priority === 'low',
};

const SORTERS = {
    newest: (a, b) => b.createdAt - a.createdAt,
    oldest: (a, b) => a.createdAt - b.createdAt,
    az: (a, b) => a.title.localeCompare(b.title),
    priority: (a, b) => priorityWeight(b.priority) - priorityWeight(a.priority),
};

function getVisibleTasks(){
    const filterFn = FILTERS[state.filter] ?? FILTERS.all;
    const sortFn = SORTERS[state.sort] ?? SORTERS.newest;

    return state.tasks
        .filter((task) => task.title.toLowerCase().includes(state.search))
        .filter(filterFn)
        .slice()
        .sort(sortFn);
}

function render() {
    const visibleTasks = getVisibleTasks();
    renderTasks(visibleTasks, state.tasks.length > 0);
    renderStats(state.tasks);
    toggleClearCompletedButton(state.tasks.some((task) => task.completed));
}

function updateTask(id, changes) {
    state.tasks = state.tasks.map((task) => (task.id === id ? { ...task, ...changes } : task));
    saveTasks(state.tasks);
    render();
}

function deleteTask(id) {
    const card = dom.taskList.querySelector(`.task-card[data-id="${id}"]`);

    const removeFromState = () => {
        state.tasks = state.tasks.filter((task) => task.id !== id);
        saveTasks(state.tasks);
        render();
    }

    if (!card) {
        removeFromState();
        return;
    }

    card.style.transition = 'opacity 180ms ease, transform 180ms ease'
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95) translateY(6px)';
    card.addEventListener('transitionend', removeFromState)
}

function addTask({ title, description, category, priority, dueDate }) {
    const newTask = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        category,
        priority,
        dueDate,
        createdAt: Date.now(),
    };

    state.tasks = [newTask, ...state.tasks];
    saveTasks(state.tasks);
    render();
}

function handleAddTaskFormSubmit(event) {
    event.preventDefault();

    const title = dom.taskTitle.value.trim();
    if (!title) {
        dom.taskTitle.focus();
        return;
    }

    const formValues = {
        title,
        description: dom.taskDescription.value.trim(),
        category: dom.taskCategory.value,
        priority: dom.taskPriority.value,
        dueDate: dom.taskDueDate.value,
    };

    const editingId = dom.addTaskForm.dataset.editingId;
    if (editingId) {
        updateTask(editingId, formValues);
    }
    else {
        addTask(formValues);
    }

    resetTaskForm();
}

function startEditingTask(id) {
    const task = state.tasks.find((task) => task.id === id);
    if (!task) return;
    populateFormForEdit(task);
}

function toggleTaskComplete(id) {
    const task = state.tasks.find((task) => task.id === id);
    if (!task) return;
    updateTask(id, { completed: !task.completed });
}

function clearCompletedTasks(){
    state.tasks = state.tasks.filter((task) => !task.completed);
    saveTasks(state.tasks);
    render();
}

function bindEvents() {
    dom.addTaskForm.addEventListener('submit', handleAddTaskFormSubmit);

    dom.addTaskForm.addEventListener('click', (event) => {
        if (event.target.closest('#cancelEditBtn')) {
            resetTaskForm();
        }
    });

    dom.taskList.addEventListener('click', (event) => {
        const card = event.target.closest('.task-card');
        if (!card) return;

        const id = card.dataset.id;

        if (event.target.closest('[data-action = "toggle"]')) {
            toggleTaskComplete(id);
        } else if (event.target.closest('[data-action="edit"]')) {
            startEditingTask(id);
        } else if (event.target.closest('[data-action="delete"]')) {
            deleteTask(id);
        }
    });

    dom.searchInput.addEventListener('input', (event) => {
        state.search = event.target.value.trim().toLowerCase();
        render();
        }
    );

    dom.filterChips.addEventListener('click', (event) => {
        const chip = event.target.closest('.chip');
        if(!chip) return;
        state.filter = chip.dataset.filter;
        syncFilterChips(state.filter);
        render();
    });

    dom.sortSelect.addEventListener('change', (event) => {
        state.sort = event.target.value;
        render();
    });

    dom.taskToolbar.addEventListener('click', (event) => {
        if(event.target.closest('#clearCompletedBtn')){
            clearCompletedTasks();
        }
    });
}

function init() {
    const storedTasks = loadTasks();
    if (storedTasks) {
        state.tasks = storedTasks;
    }

    render();
    bindEvents();

}

document.addEventListener('DOMContentLoaded', init);