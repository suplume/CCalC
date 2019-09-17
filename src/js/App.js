import React from "react";
import { render } from "react-dom";
import { ipcRenderer } from "electron";
import App from "./components/App.jsx";

let mainView;

/** 初期読み込み */
ipcRenderer.send('getInitialData');
ipcRenderer.once('sendInitialData', (event, res) => {
  render(
    <App nowTimerID={res.id} nowTimerData={res.data} config={res.config} ref={c=>mainView=c} />,
    document.getElementById("root")
  )
});

/** 時間データが変更されたらViewに反映 */
ipcRenderer.on('changeTimerData', (event, res) => {
  mainView.setState({
    nowTimerID: res.id,
    timerData: res.data
  }, ()=>{
    mainView.setNames();
  });
});

/** 表示データ切り替え */
ipcRenderer.on('changeTimerData', (event, res) => {
  mainView.setState({
    timerData: res.data
  });
});

/** 透明部分クリックでWindowを隠す */
document.addEventListener('click', function(event) {
  console.log(event.path);
  if(event.path.length < 8 && !(event.path[0].className.includes('nav')) && !(event.path[0].className.includes('modal'))) {
    ipcRenderer.send('hideWindow');
  }
});

/** 終了時処理 */
ipcRenderer.once('saveTimerData', (event) => {
  mainView.record();
  event.sender.send('checkStopTimer');
});
