import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        id="main-menu"
      >
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item action href="#link1" onClick={this.props.configOpen}>
              設定
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    );
  }
}
