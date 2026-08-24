function generateId(){
    return `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getTodayISO(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2,'0')
    const day = String(today.getDate()).padStart(2,'0')
    return `${year}-${month}-${day}`;
}

function getDueStatus(dueDate, completed){
    if(!dueDate){
        return 'none';
    }
    else if(completed){
        return 'upcoming';
    }

    const today = getTodayISO();
    if(dueDate < today) return 'overdue';
    if(dueDate === today) return 'today';
    return 'upcoming';
}

function formatDueDate(isoDate){
    if(!isoDate) return '';
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}

function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

function capitalize(word){
    if(!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function priorityWeight(priority){
    const weights = {high: 3, medium: 2, low: 1};
    return weights[priority] ?? 0;
}