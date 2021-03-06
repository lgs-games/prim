// Modules to control application life and create native browser window

const {Logger} = require("./src/model/logger");

const {app, BrowserWindow} = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
    let logger = Logger.Instance;
    logger.debug("Création de la fenêtre !");
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 925,
        height: 650,
        frame: false,
        icon: path.join(__dirname, './assets/img/prim.png'),
        webPreferences: {
            preload: path.join(__dirname, './src/preload.js'),
            enableRemoteModule: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('src/view/index.html').then();

    // fix minimum size
    mainWindow.setMinimumSize(975,700)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Close the DevTools
    mainWindow.webContents.on("devtools-opened", () => {
        mainWindow.webContents.closeDevTools();
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    let logger = Logger.Instance;
    logger.level = Logger.Levels.Debug;
    logger.debug("Starting the game!");

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    let logger = Logger.Instance;
    logger.info("Closing the application!");

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
