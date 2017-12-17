import React, { Component } from 'react';
import styles from './Welcome.css';

export default class Welcome extends Component {

  handleAddBoard = () => {
    this.props.onAddBoard();
  }
  render() {
    return (
      <div className={styles.home} data-tid="home">
        <h1>welcom</h1>
        <button onClick={this.handleAddBoard}>add board</button>
      </div>
    );
  }
}
