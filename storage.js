
/**
 * Task storage manager
 * Handles saving and loading tasks from localStorage
 */
class TaskStorage {
  constructor() {
    this.storageKey = 'taskflow_tasks';
    this.preferenceKey = 'taskflow_preferences';
  }

  /**
   * Get all tasks from localStorage
   * @returns {Array} Array of task objects
   */
  getTasks() {
    const tasksJSON = localStorage.getItem(this.storageKey);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
  }

  /**
   * Save tasks to localStorage
   * @param {Array} tasks Array of task objects
   */
  saveTasks(tasks) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      return false;
    }
  }

  /**
   * Get user preferences from localStorage
   * @returns {Object} User preferences
   */
  getPreferences() {
    try {
      const preferencesJSON = localStorage.getItem(this.preferenceKey);
      return preferencesJSON ? JSON.parse(preferencesJSON) : {
        darkMode: true, // Default to dark mode
        accentColor: 'lilac', // Default accent color
        hideCompleted: false // Default to showing completed tasks
      };
    } catch (error) {
      console.error('Error getting preferences from localStorage:', error);
      return {
        darkMode: true,
        accentColor: 'lilac',
        hideCompleted: false
      };
    }
  }

  /**
   * Save user preferences to localStorage
   * @param {Object} preferences User preferences
   */
  savePreferences(preferences) {
    try {
      localStorage.setItem(this.preferenceKey, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
      return false;
    }
  }

  /**
   * Update a single preference
   * @param {String} key Preference key
   * @param {*} value Preference value
   */
  updatePreference(key, value) {
    const preferences = this.getPreferences();
    preferences[key] = value;
    return this.savePreferences(preferences);
  }
}

// Create and export a single instance
const taskStorage = new TaskStorage();
