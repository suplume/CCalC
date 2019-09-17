import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, InputGroup, ProgressBar, Container, Tooltip, OverlayTrigger } from "react-bootstrap";

class Progress extends React.Component {
  render () {
    const now = this.props.now;
    const label = this.props.label;

    return(
      <ProgressBar variant="dark" animated now={now} label={label} />
    );
  }
}

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarted: true,
      projectNameWidth: {}
    };
  }

  setProjectNameWidth(width) {
    if(width) {
      this.setState({projectNameWidth: {width: width + 'px'}});
    } else {
      this.setState({projectNameWidth: {width: '20px'}});
    }
  }

  componentDidMount() {
    this.pWidthEle = document.getElementById('project-name-width');
    this.pNameEle = document.getElementById('project-name');
    this.tNameEle = document.getElementById('timer-name');
    this.setProjectNameWidth(this.pWidthEle.clientWidth);
    this.refs.TimerName.focus();
  }

  timerCheck(event) {
    if((this.pNameEle.value && this.tNameEle.value) && ((event.target.id === "timer-name" && event.target.value !== this.props.nowTimerData.timerName) || (event.target.id === "project-name" && event.target.value !== this.props.nowTimerData.projectName))) {
      this.setState({
        isStarted: false
      });
    } else {
      this.setState({
        isStarted: true
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    if(!this.state.isStarted) {
      this.props.record(event);
    }
  }

  render() {
    const projectNameWidth = this.state.projectNameWidth;
    const isStarted = this.state.isStarted;
    const hasLimit = !!this.props.nowTimerData.limit;

    return (
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand>
          <i className="fa fa-file-powerpoint"></i>
          <Form.Control id="project-name" plaintext defaultValue={this.props.nowTimerData.projectName} className="text-light d-inline p-0 ml-3 border-left-0 border-top-0 border-rigth-0 border-light" style={projectNameWidth} onKeyUp={this.timerCheck.bind(this)} onChange={e=>{(a=>{a.innerText=e.target.value;this.setProjectNameWidth(a.clientWidth)})(document.getElementById('project-name-width'))}} />
          <div id="project-name-width" style={{display:'inline-block', position:'fixed', visibility: 'hidden'}}>{this.props.nowTimerData.projectName}</div>
        </Navbar.Brand>
        <Nav className="mr-3">
          <Nav.Link href="#free" onClick={this.props.changeTimerData}>FreeTimer</Nav.Link>
          <OverlayTrigger key="bottom" placement="bottom" overlay={<Tooltip>Comming soon...</Tooltip>}>
            <div className="d-inline-block">
              <Nav.Link href="#projects" disabled onClick={this.props.changeTimerData}>Projects</Nav.Link>
            </div>
          </OverlayTrigger>
        </Nav>
        {//!!hasLimit &&
          <OverlayTrigger key="bottom" placement="bottom" overlay={<Tooltip>Comming soon...</Tooltip>}>
            <Container className="d-inline" style={{maxWidth: '300px'}}>
              <Progress now={this.props.nowProgress} label={this.props.nowLimit} />
            </Container>
          </OverlayTrigger>
        }
        <Form className="w-100 d-inline my-auto ml-3 mr-2" onSubmit={this.handleSubmit.bind(this)}>
          <InputGroup>
            <FormControl id="timer-name" plaintext type="text" placeholder="New Timer" className="text-light p-0 px-1 border-left-0 border-top-0 border-rigth-0 border-light" defaultValue={this.props.nowTimerData.timerName} onKeyUp={this.timerCheck.bind(this)} ref="TimerName" />
            <Button variant="outline-light" disabled={this.props.nowTimerData.id===1&&isStarted?true:false} className={["fa", isStarted ? "fa-pause":"fa-play", "ml-3"].join(" ")} onClick={this.props.record}></Button>
          </InputGroup>
        </Form>
        <Navbar.Text className="text-monospace ml-3">{this.props.totalTime}</Navbar.Text>
        <Nav className="ml-3">
          <Nav.Link href="#menu" onClick={this.props.showMenu}><i className="fa fa-ellipsis-v"></i></Nav.Link>
        </Nav>
      </Navbar>
    )
  }
}
