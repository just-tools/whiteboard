import React, { Component } from 'react';
import path from 'path';
// import type { Children } from 'react';
import { remote } from 'electron';
import Datastore from 'nedb';
import Tabs from '../components/Tabs/Tabs';
import Welcome from '../components/Welcome/Welcome';
import tabStyle from './Tab.css';
import Board from '../components/Board';

let boardCount = 0;

export default class App extends Component {

  tabs: Tabs;
  tabsDom: HTMLElement;

  props: {
  };

  constructor(props) {
    super(props);
    this.state = {
      boards: [],
      activeBoardId: null,
    };
    const homePath = remote.app.getPath('home');
    this.db = {
      boards: new Datastore({ filename: path.join(homePath, 'whiteboard.boards.db'), autoload: true }),
    };
  }

  componentDidMount() {
    this.tabs = new Tabs();
    this.tabs.init(this.tabsDom, {
      tabOverlapDistance: 14,
      minWidth: 45,
      maxWidth: 243
    });
    this.initTabEvents();
    const welcomeBoard = {
      id: 'welcome',
      title: 'Welcome'
    };
    this.db.boards.find({}, (err, boards) => {
      this.setState({
        loaded: true,
        boards: [welcomeBoard, ...boards],
        activeBoardId: welcomeBoard.id,
      });
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loaded && !this.tabInited) {
      this.initBoards(nextState.boards);
      this.tabInited = true;
    }
  }

  handleAddBoard = () => {
    this.addBoard();
  }

  initBoards = (boards) => {
    boards.forEach((board) => {
      this.tabs.addTab(board);
    });
  }

  onTabActive = ({ detail }) => {
    const { tabProperties } = detail;
    this.setState({
      activeBoardId: tabProperties.id,
    });
  };

  initTabEvents() {
    this.tabsDom.addEventListener('activeTabChange', this.onTabActive);
  }

  saveTabsDomRef = (dom: HTMLElement) => {
    this.tabsDom = dom;
  }

  addBoard = () => {
    const boardData = {
      id: `board${boardCount}`,
      title: 'New Board',
    };
    boardCount += 1;
    this.db.boards.insert(boardData, (err, newBoard) => {
      const board = {
        ...newBoard,
        component: <Board />
      };
      this.tabs.addTab(board);
    });
  }

  renderTabContent() {
    const { activeBoardId } = this.state;
    return this.state.boards.map((item) => {
      const { id } = item;
      let component;
      const cls = activeBoardId === id ? [tabStyle.tabPane, tabStyle.active] : tabStyle.tabPane;
      if (id !== 'welcome') {
        component = <Board />;
      } else {
        component = <Welcome onAddBoard={this.handleAddBoard} />;
      }
      return (
        <div id={id} className={cls}>
          {component}
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="chrome-tabs" ref={this.saveTabsDomRef}>
          <div className="chrome-tabs-content" />
          <div className="chrome-tabs-bottom-bar" />
        </div>
        <div className={tabStyle.tabContent}>
          {this.renderTabContent()}
        </div>
      </div>
    );
  }
}
