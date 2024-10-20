// Import methods to save and get data from the IndexedDB database in './database.js'
import { putDb } from './db';
import { header } from './header';
import { getDb } from './db'; 

export default class Editor {
  constructor() {
    const localData = localStorage.getItem('content');

    // Check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in IndexedDB.
    // Fall back to localStorage if nothing is stored in IndexedDB, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || localData || header);
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });

    // Install button click handler
    const installButton = document.getElementById('buttonInstall');
    
    if (installButton) {
      installButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default action
        console.log('Install button clicked');
        // Add your PWA installation logic here
      });
    }
  }
}
