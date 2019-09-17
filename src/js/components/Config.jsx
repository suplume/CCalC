import React from "react";
import { Modal, Button, Form, InputGroup, Container } from "react-bootstrap";

export default class Config extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue.bind(this);
  }

  changeValue(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        id="config"
      >
        <Modal.Header closeButton>
          <Modal.Title>設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              レコルID
            </Form.Label>
            <Form.Control id="recoruID" type="text" placeholder="P000" defaultValue={this.props.config.recoruID} onChange={this.changeValue.bind(this)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              レコルパスワード
            </Form.Label>
            <Form.Control id="recoruPassword" type="password" placeholder="******" defaultValue={this.props.config.recoruPassword} onChange={this.changeValue.bind(this)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>キャンセル</Button>
          <Button variant="primary" onClick={this.props.configSave}>保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
