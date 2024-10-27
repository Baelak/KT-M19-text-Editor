// Import methods to save and get data from the IndexedDB database in './database.js'
import { putDb } from './db';
import { header } from './header';
import { getDb } from './db'; 

export default class Editor {
  constructor() {
    const localData = localStorage.getItem('content');
    this.deferredPrompt = null; // Variable to hold the deferred prompt

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

    // Handle the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-info bar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      // Show the install button
      installButton.style.display = 'block';
    });

    // Install button click handler
    const installButton = document.getElementById('buttonInstall');
    
    if (installButton) {
      installButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default action
        console.log('Install button clicked');
        // Show the install prompt
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            this.deferredPrompt = null; // Clear the deferred prompt
          });
        }
      });
    }
  }
}