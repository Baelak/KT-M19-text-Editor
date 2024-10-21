// Develop/client/src/js/install.js

const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA

// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default mini-infobar from appearing
    event.preventDefault();

    // Save the event so it can be triggered later
    window.deferredPrompt = event;

    // Show the install button
    butInstall.style.display = 'block';
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
        return;
    }

    // Show the install prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const result = await promptEvent.userChoice;
    console.log('User choice:', result);

    // Reset the deferred prompt variable
    window.deferredPrompt = null;

    // Hide the install button
    butInstall.style.display = 'none';
});

// Prevent editor blur when clicking install button
butInstall.addEventListener('mousedown', (event) => {
    event.preventDefault();
});

// Add a handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    console.log('PWA has been installed!', event);

    // Clear the deferred prompt
    window.deferredPrompt = null;
});
