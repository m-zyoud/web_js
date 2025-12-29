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