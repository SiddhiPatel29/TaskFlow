const STORAGE_KEYS = {
    TASKS: 'taskflow.tasks',
    GOALS: 'taskflow.goals',
}

function saveTasks(tasks){
    try{
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    }
    catch(error){
        console.error('TaskFlow: failed to save tasks to localStorage.', error);
    }
}

function loadTasks(){
    try{
        const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
        if(!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    }
    catch (error){
        console.error('TaskFlow: failed to read tasks from localStorage.', error);
        return null;
    }
}

function saveGoals(goals){
    try{
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    }
    catch(error){
        console.error('TaskFlow: failed to save goals to localStorage.', error);
    }
}

function loadGoals(){
    try{
        const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
        if(!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    }
    catch (error){
        console.error('TaskFlow: failed to read goals from localStorage.', error);
        return null;
    }
}