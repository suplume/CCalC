import React from "react";
import Timer from "./Timer.jsx";
import Projects from "./Projects.jsx";
import Menu from "./Menu.jsx"
import Config from "./Config.jsx"
import { ipcRenderer } from "electron";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const nowTimerData = this.searchTimer(props.nowTimerData, props.nowTimerID);
    this.state = {
      nowTimerID: props.nowTimerID,
      nowTotalTime: nowTimerData.totalTime,
      nowLimit: nowTimerData.limit,
      nowTimerData: nowTimerData,
      isEditable: nowTimerData.isEditable,
      isOpened: false,
      elapsedTime: 0,
      timerData: props.nowTimerData,
      menuShow: false,
      configShow: false
    }

    this.firstProjectName =  nowTimerData.projectName,
    this.firstTimerName = nowTimerData.timerName,

    this.startTime = ~~(performance.now() / 1000);
    this.recordTime = this.timeStamp();
    this.nowTime = props.nowTimerData.totalTime;
    this.timeoutID = 0;
  }

  /** タイマー初期起動 */
  componentDidMount() {
    this.timer();
  }

  /** タイマーデータ群から指定したIDのデータを返す */
  searchTimer(data, id) {
    return data.filter(d=>d.id===id)[0];
  }

  /** 現在のタイムスタンプを返す */
  timeStamp() {
    return ~~((new Date()).getTime()/1000);
  }

  /** 経過時間をフォーマットした時間で返す */
  timerFormat(num) {
    return `${String(~~(num/3600)).padStart(2,"0")}:${String(~~(num/60%60)).padStart(2,"0")}:${String(num%60).padStart(2,"0")}`
  }

  /** 時間を刻む処理 */
  timer() {
    this.setState({
      elapsedTime: ~~(performance.now() / 1000) - this.startTime
    });
    this.timeoutID = setTimeout(this.timer.bind(this), 1000);
  }

  /** 時間を登録する処理 */
  record(e) {
    if(e && e.target.dataset.id) {
      this.registerTimerData({
        nextID: e.target.dataset.id-0,
        elapsedTime: this.state.elapsedTime,
        startTime: this.recordTime,
        stopTime: this.recordTime + this.state.elapsedTime
      });
      this.changeTimerData();
    } else {
      if(this.nowTimerData.projectName === this.refs.Timer.pNameEle.value && this.nowTimerData.timerName === this.refs.Timer.tNameEle.value) {
        this.registerTimerData({
          elapsedTime: this.state.elapsedTime,
          startTime: this.recordTime,
          stopTime: this.recordTime + this.state.elapsedTime
        });
      } else {
        this.registerTimerData({
          isNew: true,
          newProjectName: this.refs.Timer.pNameEle.value,
          newTimerName: this.refs.Timer.tNameEle.value,
          elapsedTime: this.state.elapsedTime,
          startTime: this.recordTime,
          stopTime: this.recordTime + this.state.elapsedTime
        });
      }
    }
    this.setState({
      elapsedTime: 0,
    });
    this.startTime = ~~(performance.now() / 1000);
    this.recordTime = this.timeStamp();
    this.nowTime = this.props.nowTimerData.totalTime;
    this.refs.Timer.setState({isStarted: true});
  }

  /** メインプロセスへタイマーデータを送信 */
  registerTimerData(data) {
    ipcRenderer.sendSync('receiptFreeTimerData', Object.assign(data, {id: this.state.nowTimerID}));
  }

  /** タイマーデータの変更処理 */
  changeTimerData() {
    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  /** タイマーの名前を設定 */
  setNames() {
    const data = this.searchTimer(this.state.timerData, this.state.nowTimerID);
    this.refs.Timer.pNameEle.value = data.projectName;
    this.refs.Timer.tNameEle.value = data.timerName;
    this.refs.Timer.setProjectNameWidth(this.refs.Timer.pWidthEle.clientWidth);
  }

  /** メニューの表示非表示の処理 */
  toggleMenu() {
    this.setState({
      menuShow: !this.state.menuShow
    });
  }

  /** 設定の表示非表示の処理 */
  toggleConfig() {
    this.setState({
      configShow: !this.state.configShow
    });
  }

  /** 設定表示処理 */
  configOpen() {
    this.toggleMenu();
    this.toggleConfig();
  }

  /** 設定の登録処理（メインプロセスへ設定データを送信） */
  configSave() {
    let updateConfig = this.props.config;
    Object.keys(this.refs.configView.state).forEach(k=>updateConfig[k]=this.refs.configView.state[k]);
    ipcRenderer.sendSync('receiptConfig', updateConfig);
    this.toggleConfig();
  }

  /** レンダリング */
  render() {
    this.nowTimerData = this.searchTimer(this.state.timerData, this.state.nowTimerID);
    const ignoredTimerData = this.state.timerData.filter(d=>d.id!==this.state.nowTimerID);
    const totalTime = this.timerFormat(this.nowTimerData.totalTime + this.state.elapsedTime);
    //const nowLimit = this.timerFormat(this.nowTimerData.limit - totalTime);
    //const nowProgress = (this.nowTimerData.limit - totalTime) / this.nowTimerData.limit * 100;
    const nowLimit = this.timerFormat(0);
    const nowProgress = 100;

    return(
      <div id="wrapper">
        <Menu show={this.state.menuShow} onHide={this.toggleMenu.bind(this)} configOpen={this.configOpen.bind(this)} />
        <Config config={this.props.config} show={this.state.configShow} onHide={this.toggleConfig.bind(this)} configSave={this.configSave.bind(this)} ref='configView' />
        <Timer nowTimerData={this.nowTimerData} totalTime={totalTime} nowLimit={nowLimit} nowProgress={nowProgress} changeTimerData={this.changeTimerData.bind(this)} record={this.record.bind(this)} showMenu={this.toggleMenu.bind(this)} ref='Timer' />
        {!!ignoredTimerData.length &&
          <Projects timerData={ignoredTimerData} record={this.record.bind(this)} isOpened={this.state.isOpened} ref='Projects' />
        }
      </div>
    );
  }
}
