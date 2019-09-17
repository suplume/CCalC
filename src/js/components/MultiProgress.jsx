import React from "react";
import { Toast, ProgressBar } from "react-bootstrap";

export default class Projects extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Toast>
        <Toast.Header>
          <strong className="mr-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>
          <ProgressBar now={60} />
        </Toast.Body>
      </Toast>
    )
  }
}
