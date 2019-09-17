import electron from 'electron';
import { app, ipcMain, BrowserWindow, Tray, Menu, MenuItem, globalShortcut, shortcut, screen } from 'electron';
import fs from 'fs';
import path from 'path';

/** アプリ多重起動防止 */
const doubleboot = app.requestSingleInstanceLock();
if(!doubleboot){
  app.quit();
}

/** ガベージコレクション範囲外変数宣言 */
let mainWindow = null;
let config;
let freeTimerData;
let projectTimerData = [];
let nowID = 1;
let isClosed = false;
let isLogouted = false;
let revisionInfo;
const menu = new Menu();
const freeTimerDataPath = path.join(app.getPath('userData'), 'free.json');
const configPath = path.join(app.getPath('userData'), 'config.json');
const MINHEIGHT = 57;
const os = process.platform;

/** タイマー保存用jsonを用意 */
try {
  fs.statSync(freeTimerDataPath);
  freeTimerData = JSON.parse(fs.readFileSync(freeTimerDataPath, 'utf8'));
} catch(err) {
  if(err.code === 'ENOENT') {
    const initTimerData = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/free.json'), 'utf8'));
    fs.writeFileSync(freeTimerDataPath, JSON.stringify(initTimerData))
    freeTimerData = JSON.parse(fs.readFileSync(freeTimerDataPath, 'utf8'));
  }
}

/** 設定ファイルを用意 */
try {
  fs.statSync(configPath);
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch(err) {
  if(err.code === 'ENOENT') {
    fs.writeFileSync(configPath, '{}')
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
}

/** ウィンドウの表示非表示 */
const showHideWindow = () => {
  if(mainWindow.isFocused() && mainWindow.isVisible()) {
    mainWindow.hide();
    if(os === 'darwin') {
      Menu.sendActionToFirstResponder('hide:');
    }
  } else {
    mainWindow.show();
  }
}

/** タイマーデータのフォーマットを返す */
const timerDataFormat = (id, projectName, timerName) => {return {
  id: id,
  projectName: projectName,
  timerName: timerName,
  totalTime: 0,
  limit: 0, isCompleted: false,
  isEditable: true,
  history: []
}}

app.on('ready', () => {
  /** MacのときDockから非表示 */
  if(os === "darwin") {
    app.dock.hide();
  }

  /** メインディスプレイ情報取得 */
  const display = electron.screen.getPrimaryDisplay();
  const displayWidth = display.bounds.width;
  const displayHeight = display.bounds.height;

  /** メインウィンドウ表示 */
  mainWindow = new BrowserWindow({
    width: displayWidth,
    height: displayHeight,
    x: 0,
    y: 0,
    minWidth: 1000,
    minHeight: MINHEIGHT,
    frame: false,
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL('file://' + __dirname + path.sep + 'index.html');

  /** グローバルショートカットの登録 */
  globalShortcut.register('CommandOrControl+Alt+Enter', showHideWindow);

  /** ウィンドウクローズ時タイマーデータ処理 */
  mainWindow.on('close', function(event) {
    if(!isClosed) {
      event.preventDefault();
      mainWindow.webContents.send('saveTimerData');
      ipcMain.once('checkStopTimer', (event) => {
        isClosed = true;
        app.quit();
      });
    }
  });
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  /** タスクトレイ設定 */
  const tray = new Tray(path.join(__dirname + "/img/tray_icon_mac.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "終了", click: function () { mainWindow.close(); } }
  ]);

  tray.setToolTip(app.getName());
  tray.setContextMenu(contextMenu);
});

/** プロセス終了時 */
process.on('exit', function(){
  console.log('Exiting Application....');
  globalShortcut.unregister('CommandOrControl+Alt+Enter');
  mainWindow = null;
});
process.on('SIGINT',function(){
  process.exit(0);
});

/** レンダリングへ初期データ送信 */
ipcMain.on('getInitialData', (event) => {
  event.sender.send('sendInitialData', {id: nowID, data: freeTimerData, config: config});
});

/** タイマーデータ処理 */
ipcMain.on('receiptFreeTimerData', (event, data) => {
  const index = freeTimerData.map((d,i)=>d.id===data.id && i).filter(d=>d!==false)[0];
  freeTimerData[index].totalTime += data.elapsedTime;
  freeTimerData[index].history.push({
    startTime: data.startTime,
    stopTime: data.stopTime,
    elapsedTime: data.elapsedTime
  });
  if(data.nextID) {
    nowID = data.nextID;
  } else if(data.isNew) {
    nowID = (a=>a.length&&a[0].id)(freeTimerData.filter(d=>d.projectName===data.newProjectName&&d.timerName===data.newTimerName));
    if(nowID === 0) {
      nowID = freeTimerData.length + 1;
      freeTimerData.push(timerDataFormat(nowID, data.newProjectName, data.newTimerName));
    }
  } else {
    nowID = 1;
  }
  fs.writeFileSync(freeTimerDataPath, JSON.stringify(freeTimerData))
  event.sender.send('changeTimerData', {id: nowID, data: freeTimerData});
  event.returnValue = true;
});

/** 設定データ処理 */
ipcMain.on('receiptConfig', (event, data) => {
  config = data;
  fs.writeFileSync(configPath, JSON.stringify(config))
  event.returnValue = true;
});

/** 透明部分クリックで背景へ */
ipcMain.on('hideWindow', showHideWindow);
