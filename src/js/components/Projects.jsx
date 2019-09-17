import React from "react";
import { Container, Card, CardColumns, Button, Badge, ProgressBar, Fade , Nav } from "react-bootstrap";

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
  }

  timerFormat(num) {
    return `${String(~~(num/3600)).padStart(2,"0")}:${String(~~(num/60%60)).padStart(2,"0")}:${String(num%60).padStart(2,"0")}`
  }

  render() {
    const timerData = this.props.timerData;
    return (
      <Fade in={this.props.isOpened} mountOnEnter unmountOnExit>
        <CardColumns className="mt-10 p-3">
        {timerData.map(d=>{
          return (
            <Card bg="dark" text="light">
              <Card.Header>
                {d.projectName}
                {/* <Button variant="dark" className="fa fa-ellipsis-v ml-auto" style={{background: "none", border: "0", outline: "0", float: "right"}}></Button> */}
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  {d.timerName}
                </Card.Title>
                <Card.Text>
                  {//!!d.limit &&
                    <ProgressBar striped variant="dark" now={100} label="00:00:00" />
                  }
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-right">
                {this.timerFormat(d.totalTime)}
              </Card.Footer>
              <Button variant="dark" className="fa fa-play text-center w-100" data-id={d.id} onClick={this.props.record}></Button>
            </Card>
          )
        })}
        </CardColumns>
      </Fade>
    )
  }
}
