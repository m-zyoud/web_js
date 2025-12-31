const STORAGE_KEYS = {
    TASKS: 'todoApp_tasks',
    LANGUAGE: 'todoApp_language',
    THEME: 'todoApp_theme',
    FILTER: 'todoApp_filter'
};

let currentLanguage = 'en';
let currentTheme = 'light';
const translations = {
    en: {
        title: 'Todo List',
        subtitle: '– TodoInput',
        inputPlaceholder: 'Enter your task...',
        addButton: 'Add new task',
        allTab: 'All',
        doneTab: 'Done',
        todoTab: 'Todo',
        deleteDoneBtn: 'Delete Done Tasks',
        deleteAllBtn: 'Delete All Tasks',
        renameTitle: 'Rename Task',
        renamePlaceholder: 'Enter new task name',
        renameBtn: 'Rename',
        cancelBtn: 'Cancel',
        confirmBtn: 'Yes',
        emptyAll: '📝 No tasks yet. Add your first task above!',
        emptyDone: '✅ No completed tasks yet.',
        emptyTodo: '📋 No pending tasks!',
        taskEmpty: 'Task cannot be empty.',
        taskNumber: 'Task must not start with a number.',
        taskShort: 'Task must be at least 5 characters.',
        taskExists: 'This task already exists.',
        noDoneTasks: 'No completed tasks to delete.',
        noTasks: 'No tasks to delete.',
        deleteTask: 'Are you sure to delete this task?',
        deleteAllConfirm: 'Delete all {count} tasks?',
        deleteDoneConfirm: 'Delete all {count} completed tasks?',
        totalTasks: '{total} total tasks ({done} completed)',
        completedTasks: '{count} completed tasks',
        pendingTasks: '{count} pending tasks',
        saved: '✓ Saved'
    },
    ar: {
        title: 'قائمة المهام',
        subtitle: '– إدخال المهام',
        inputPlaceholder: 'أدخل مهمتك...',
        addButton: 'إضافة مهمة جديدة',
        allTab: 'الكل',
        doneTab: 'مكتملة',
        todoTab: 'معلقة',
        deleteDoneBtn: 'حذف المهام المكتملة',
        deleteAllBtn: 'حذف كل المهام',
        renameTitle: 'إعادة تسمية المهمة',
        renamePlaceholder: 'أدخل اسم المهمة الجديد',
        renameBtn: 'إعادة تسمية',
        cancelBtn: 'إلغاء',
        confirmBtn: 'نعم',
        emptyAll: '📝 لا توجد مهام بعد. أضف مهمتك الأولى أعلاه!',
        emptyDone: '✅ لا توجد مهام مكتملة بعد.',
        emptyTodo: '📋 لا توجد مهام معلقة!',
        taskEmpty: 'لا يمكن أن تكون المهمة فارغة.',
        taskNumber: 'يجب ألا تبدأ المهمة برقم.',
        taskShort: 'يجب أن تحتوي المهمة على 5 أحرف على الأقل.',
        taskExists: 'هذه المهمة موجودة بالفعل.',
        noDoneTasks: 'لا توجد مهام مكتملة للحذف.',
        noTasks: 'لا توجد مهام للحذف.',
        deleteTask: 'هل أنت متأكد من حذف هذه المهمة؟',
        deleteAllConfirm: 'حذف كل الـ {count} مهمة؟',
        deleteDoneConfirm: 'حذف كل الـ {count} مهمة مكتملة؟',
        totalTasks: '{total} مهمة إجمالية ({done} مكتملة)',
        completedTasks: '{count} مهمة مكتملة',
        pendingTasks: '{count} مهمة معلقة',
        saved: '✓ تم الحفظ'
    }
};

let tasks = [];
let currentFilter = 'all';
let actionCallback = null;
let renameIndex = null;

function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLanguage);
        localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
        localStorage.setItem(STORAGE_KEYS.FILTER, currentFilter);
        showStorageIndicator();
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromStorage() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (savedLanguage) {
            currentLanguage = savedLanguage;
        }
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
            currentTheme = savedTheme;
        }
        const savedFilter = localStorage.getItem(STORAGE_KEYS.FILTER);
        if (savedFilter) {
            currentFilter = savedFilter;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function showStorageIndicator() {
    const indicator = document.getElementById('storageIndicator');
    indicator.textContent = getText('saved');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initializeApp();
}
);

function initializeApp() {
    renderTasks();
    updateActiveTab();
    updateLanguage();
    updateTheme();
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    document.getElementById('renameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') confirmRename();
    });
    window.onclick = function (event) {
        const popup = document.getElementById('popup');
        const renamePopup = document.getElementById('renamePopup');
        if (event.target === popup) closePopup();
        if (event.target === renamePopup) closeRenamePopup();
    }
}
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateTheme();
    saveToStorage();
}

function updateTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('themeBtn').textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    updateLanguage();
    saveToStorage();
}

function updateLanguage() {
    const isArabic = currentLanguage === 'ar';
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLanguage);
    document.getElementById('langBtn').textContent = isArabic ? 'English' : 'العربية';
    const t = translations[currentLanguage];
    document.getElementById('mainTitle').innerHTML = `${t.title} <span class="sub-title">${t.subtitle}</span>`;
    document.getElementById('taskInput').placeholder = t.inputPlaceholder;
    document.getElementById('addBtn').textContent = t.addButton;
    document.getElementById('allTab').textContent = t.allTab;
    document.getElementById('doneTab').textContent = t.doneTab;
    document.getElementById('todoTab').textContent = t.todoTab;
    document.getElementById('deleteDoneBtn').textContent = t.deleteDoneBtn;
    document.getElementById('deleteAllBtn').textContent = t.deleteAllBtn;
    document.getElementById('renameTitle').textContent = t.renameTitle;
    document.getElementById('renameInput').placeholder =
        t.renamePlaceholder;
    document.getElementById('renameConfirmBtn').textContent = t.renameBtn;
    document.getElementById('renameCancelBtn').textContent = t.cancelBtn;
    document.getElementById('cancelBtn').textContent = t.cancelBtn;
    document.getElementById('confirmBtn').textContent = t.confirmBtn;
    renderTasks();
}
function getText(key, params = {}) {
    let text = translations[currentLanguage][key] || key;
    Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  return text;
}
function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'done') return task.done;
    if (currentFilter === 'todo') return !task.done;
  return true;
});
updateTaskCounter(filteredTasks.length);
if (filteredTasks.length === 0) {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.textContent = currentFilter === 'all' ? 
  getText('emptyAll') :
  currentFilter === 'done' ? 
  getText('emptyDone') :
  getText('emptyTodo');
  list.appendChild(emptyState);
  return;
}
filteredTasks.forEach((task, index) => {
    const originalIndex = tasks.indexOf(task);
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleTask(originalIndex);
    const text = document.createElement('span');
    text.textContent = task.text;
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✏️';
    editBtn.title = currentLanguage === 'ar' ? 'تعديل المهمة' : 'Edit task';
    editBtn.onclick = () => renameTask(originalIndex);
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.title = currentLanguage === 'ar' ? 'حذف المهمة' : 'Delete task';
  deleteBtn.onclick = () => confirmPopup(() => deleteTask(originalIndex), getText('deleteTask'));
   actions.appendChild(editBtn);
   actions.appendChild(deleteBtn);
      li.appendChild(checkbox);
      li.appendChild(text);
      li.appendChild(actions);
      list.appendChild(li);
      });
    } 
    function updateTaskCounter(count) {
        const counter = document.getElementById('taskCounter');
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.done).length;   
        if (currentFilter === 'all') {
          counter.textContent = getText('totalTasks', { total: totalTasks, done: doneTasks });
          } else if (currentFilter === 'done') {
          counter.textContent = getText('completedTasks', { count });
        } else {
            counter.textContent = getText('pendingTasks', { count });
            }
            }
            function addTask() {
                const input = document.getElementById('taskInput');
                const text = input.value.trim();
                if (!validateInput(text)) return;
                  tasks.push({ text, done: false });
                  input.value = '';
    saveToStorage();
    renderTasks();
    input.style.background = currentTheme === 'dark' ? '#2d5a2d' : '#d4edda';
    setTimeout(() => {
    input.style.background = '';
    }, 500);
    }
    function toggleTask(index) {
        tasks[index].done = !tasks[index].done;
        saveToStorage();
        renderTasks();
      }
      function deleteTask(index) {
        tasks.splice(index, 1);
        saveToStorage();
        renderTasks();
      }
      function renameTask(index) {
        renameIndex = index;
        document.getElementById('renameInput').value = tasks[index].text;
        document.getElementById('renamePopup').style.display = 'flex';
        setTimeout(() => {
          document.getElementById('renameInput').focus();
          document.getElementById('renameInput').select();
        }, 100);
      }