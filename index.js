const { app, BrowserWindow } = require('electron');
const path = require('path');
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

let mainWindow;


//require('crash-reporter').start();

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1360,
        height: 800
    });
    //mainWindow.loadURL(path.join('file://', __dirname, 'build/index.html'));
    mainWindow.loadURL('http://localhost:8080');
    
    // Install React Dev Tools
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
        console.log(`Added Extension:  ${name}`);
    })
    .catch((err) => {
        console.log('An error occurred: ', err);
    });

    // Install Redux Dev Tools
    installExtension(REDUX_DEVTOOLS).then((name) => {
        console.log(`Added Extension:  ${name}`);
    })
    .catch((err) => {
        console.log('An error occurred: ', err);
    });

    mainWindow.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
})