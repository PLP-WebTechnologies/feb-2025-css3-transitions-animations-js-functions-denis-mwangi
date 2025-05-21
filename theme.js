
/**
 * Theme manager
 * Handles dark/light mode and accent color preferences
 */
class ThemeManager {
  constructor() {
    this.body = document.body;
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.themeToggleIcon = this.themeToggleBtn.querySelector('i');
    this.colorSwatches = document.querySelectorAll('.color-swatch');
    
    this.loadTheme();
    this.initEventListeners();
  }

  /**
   * Load theme preferences from storage
   */
  loadTheme() {
    const preferences = taskStorage.getPreferences();
    
    // Set dark/light mode
    this.setDarkMode(preferences.darkMode);
    
    // Set accent color
    this.setAccentColor(preferences.accentColor);
  }

  /**
   * Toggle between dark and light mode
   */
  toggleDarkMode() {
    const isDarkMode = this.body.classList.contains('dark-mode');
    this.setDarkMode(!isDarkMode);
    taskStorage.updatePreference('darkMode', !isDarkMode);
  }

  /**
   * Set dark mode on or off
   * @param {Boolean} isDarkMode Whether dark mode should be enabled
   */
  setDarkMode(isDarkMode) {
    if (isDarkMode) {
      this.body.classList.add('dark-mode');
      this.themeToggleIcon.className = 'fas fa-sun';
    } else {
      this.body.classList.remove('dark-mode');
      this.themeToggleIcon.className = 'fas fa-moon';
    }
  }

  /**
   * Set the accent color
   * @param {String} color Color name
   */
  setAccentColor(color) {
    // Update CSS variable
    document.documentElement.style.setProperty('--accent', `var(--${color})`);
    
    // Update active swatch
    this.colorSwatches.forEach(swatch => {
      if (swatch.dataset.color === color) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
    
    // Save preference
    taskStorage.updatePreference('accentColor', color);
  }

  /**
   * Initialize event listeners for theme controls
   */
  initEventListeners() {
    // Dark mode toggle
    this.themeToggleBtn.addEventListener('click', () => {
      this.toggleDarkMode();
    });
    
    // Accent color swatches
    this.colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        this.setAccentColor(color);
      });
    });
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
