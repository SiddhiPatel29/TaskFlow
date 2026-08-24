const dom = {
    addTaskForm: document.getElementById('addTaskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    taskCategory: document.getElementById('taskCategory'),
    taskPriority: document.getElementById('taskPriority'),
    taskDueDate: document.getElementById('taskDueDate'),

    taskList: document.getElementById('taskList'),
    addTaskBtn: document.querySelector('.btn-add-task'),

    searchInput : document.getElementById('searchInput'),
    filterChips : document.getElementById('filterChips'),
    sortSelect : document.getElementById('sortSelect'),
}

function buildTaskCard(task) {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.dataset.id = task.id;
    card.dataset.priority = task.priority;
    card.dataset.category = task.category;
    card.dataset.completed = task.completed;

    if (task.completed) {
        card.classList.add('task-card-done');
    }

    const accent = document.createElement('div');
    accent.className = 'task-accent';
    card.appendChild(accent);

    const checkbox = document.createElement('button');
    checkbox.type = 'button';
    checkbox.className = 'task-checkbox';
    checkbox.dataset.action = 'toggle';
    checkbox.setAttribute('aria-pressed', String(task.completed));
    checkbox.setAttribute('aria-label', `Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`);
    if (task.completed) checkbox.classList.add('is-checked');
    checkbox.innerHTML = '<i class="fa-solid fa-check"></i>';
    card.appendChild(checkbox);

    const body = document.createElement('div');
    body.className = 'task-body';

    const dueStatus = getDueStatus(task.dueDate, task.completed);
    const dueLabel = {
        overdue: 'Overdue',
        today: 'Today',
        upcoming: formatDueDate(task.dueDate),
        none: '',
    }[dueStatus];

    body.innerHTML = `
    <div class="task-top">
        <h3 class="task-title ${task.completed ? 'task-title-done' : ''}">${escapeHtml(task.title)}</h3>
        <div class="task-menu">
            <button class="icon-btn" type="button" data-action="edit" aria-label="Edit task"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="icon-btn" type="button" data-action="delete" aria-label="Delete task"><i class="fa-regular fa-trash-can"></i></button>
        </div>
    </div>
    ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
    <div class="task-tags">
        ${dueLabel ? `<span class="tag tag-due ${dueStatus === 'overdue' ? 'tag-overdue' : dueStatus === 'today' ? 'tag-today' : ''}"><i class="fa-regular fa-clock"></i> ${dueLabel}</span>` : ''}
        <span class="tag tag-category tag-${task.category}">${capitalize(task.category)}</span>
        <span class="tag tag-priority tag-${task.priority}">${capitalize(task.priority)}</span>
    </div> `;

    card.appendChild(body);
    return card;
}

function renderTasks(visibleTasks){
    dom.taskList.innerHTML = '';

    visibleTasks.forEach((task) => dom.taskList.appendChild(buildTaskCard(task)));

}

function populateFormForEdit(task){
    dom.taskTitle.value = task.title;
    dom.taskDescription.value = task.description;
    dom.taskCategory.value = task.category;
    dom.taskPriority.value = task.priority;
    dom.taskDueDate.value = task.dueDate;
    dom.addTaskForm.dataset.editingId = task.id;
    dom.addTaskBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';

    dom.taskTitle.dispatchEvent(new Event('input'));
    dom.taskDescription.dispatchEvent(new Event('input'));

    addCancelEditButton();
    dom.taskTitle.focus();
    dom.addTaskForm.scrollIntoView?.({behavior: 'smooth', block: 'center'});
}

function addCancelEditButton(){
    if(document.getElementById('cancelEditBtn')) return;
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'cancelEditBtn';
    cancelBtn.className = 'chip';
    cancelBtn.textContent = 'Cancel';
    dom.addTaskBtn.insertAdjacentElement('beforebegin', cancelBtn);
}

function resetTaskForm(){
    dom.addTaskForm.reset();
    delete dom.addTaskForm.dataset.editingId;
    dom.addTaskBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
    removeCancelEditButton();
}

function removeCancelEditButton(){
    const cancelBtn = document.getElementById('cancelEditBtn');
    if(cancelBtn) cancelBtn.remove();
}

function syncFilterChips(activeFilter){
    const chips = dom.filterChips.querySelector('.chip');
    chips.forEach((chip) => {
        chip.classList.toggle('is-active', chip.dataset.filter === activeFilter);
    });
}