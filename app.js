/**
 * TaskManager Class
 * Main application logic for managing tasks
 */
class TaskManager {
  constructor() {
    // DOM Elements
    this.taskForm = document.getElementById('task-form');
    this.taskTitleInput = document.getElementById('task-title');
    this.taskDescriptionInput = document.getElementById('task-description');
    this.taskList = document.getElementById('task-list');
    this.emptyState = document.getElementById('empty-state');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.hideCompletedToggle = document.getElementById('hide-completed');
    this.notification = document.getElementById('notification');
    this.notificationText = document.getElementById('notification-text');
    
    // State
    this.tasks = [];
    this.currentFilter = 'all';
    
    // Initialize
    this.loadTasks();
    this.loadPreferences();
    this.renderTasks();
    this.setupEventListeners();
  }
  
  /**
   * Load tasks from storage
   */
  loadTasks() {
    this.tasks = taskStorage.getTasks();
  }
  
  /**
   * Load user preferences
   */
  loadPreferences() {
    const preferences = taskStorage.getPreferences();
    this.hideCompletedToggle.checked = preferences.hideCompleted;
    
    // Set initial filter if hide completed is enabled
    if (preferences.hideCompleted) {
      this.currentFilter = 'active';
      this.updateFilterButtons();
    }
  }
  
  /**
   * Save tasks to storage
   */
  saveTasks() {
    taskStorage.saveTasks(this.tasks);
  }
  
  /**
   * Create a new task
   * @param {String} title Task title
   * @param {String} description Task description
   */
  createTask(title, description) {
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    this.tasks.unshift(newTask); // Add to beginning of array
    this.saveTasks();
    this.renderTasks();
    this.showNotification('Task added successfully!');
  }
  
  /**
   * Toggle task completion status
   * @param {String} taskId ID of the task to toggle
   */
  toggleTaskCompletion(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      this.saveTasks();
      
      // Allow animation to play before re-rendering
      setTimeout(() => {
        this.renderTasks();
      }, 500);
      
      const status = this.tasks[taskIndex].completed ? 'completed' : 'active';
      this.showNotification(`Task marked as ${status}!`);
    }
  }
  
  /**
   * Delete a task
   * @param {String} taskId ID of the task to delete
   */
  deleteTask(taskId) {
    const taskElement = document.querySelector(`.task-item[data-id="${taskId}"]`);
    
    // Add removing class for animation
    if (taskElement) {
      taskElement.classList.add('removing');
      
      // Wait for animation to finish before removing from array
      setTimeout(() => {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
      }, 300);
      
      this.showNotification('Task deleted!');
    }
  }
  
  /**
   * Filter tasks based on current filter
   * @returns {Array} Filtered task array
   */
  filterTasks() {
    switch(this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        // When in 'all' mode, respect the hideCompleted preference
        return this.hideCompletedToggle.checked 
          ? this.tasks.filter(task => !task.completed)
          : this.tasks;
    }
  }
  
  /**
   * Render tasks to the DOM
   */
  renderTasks() {
    const filteredTasks = this.filterTasks();
    
    // Clear current list
    this.taskList.innerHTML = '';
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
      this.emptyState.classList.remove('hidden');
    } else {
      this.emptyState.classList.add('hidden');
    }
    
    // Render each task
    filteredTasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.taskList.appendChild(taskElement);
    });
  }
  
  /**
   * Create a DOM element for a task
   * @param {Object} task Task data
   * @returns {HTMLElement} Task list item element
   */
  createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
      <label class="task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="custom-checkbox">
          <i class="fas fa-check"></i>
        </span>
      </label>
      <div class="task-content">
        <div class="task-header">
          <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
          <div class="task-actions">
            <button class="delete-btn" aria-label="Delete task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
      </div>
    `;
    
    // Add event listeners
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      this.toggleTaskCompletion(task.id);
    });
    
    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      this.deleteTask(task.id);
    });
    
    return taskItem;
  }
  
  /**
   * Set the current filter
   * @param {String} filter Filter name ('all', 'active', or 'completed')
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.updateFilterButtons();
    this.renderTasks();
  }
  
  /**
   * Update filter button active states
   */
  updateFilterButtons() {
    this.filterButtons.forEach(btn => {
      if (btn.dataset.filter === this.currentFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  /**
   * Show a notification message
   * @param {String} message Message to display
   */
  showNotification(message) {
    this.notificationText.textContent = message;
    this.notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }
  
  /**
   * Escape HTML special characters to prevent XSS
   * @param {String} text Text to escape
   * @returns {String} Escaped HTML text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Form submission
    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.taskTitleInput.value;
      const description = this.taskDescriptionInput.value;
      
      if (title.trim()) {
        this.createTask(title, description);
        this.taskForm.reset();
        this.taskTitleInput.focus();
      }
    });
    
    // Filter buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.setFilter(filter);
      });
    });
    
    // Hide completed toggle
    this.hideCompletedToggle.addEventListener('change', () => {
      taskStorage.updatePreference('hideCompleted', this.hideCompletedToggle.checked);
      this.renderTasks();
    });
  }
}

// Initialize the task manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TaskManager();
});
