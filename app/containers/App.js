// @flow
import React, { Component } from 'react';
// import type { Children } from 'react';
import Tabs from '../components/Tabs/Tabs';


export default class App extends Component {

  tabs: Tabs;
  tabsDom: HTMLElement;

  props: {
  };

  componentDidMount() {
    this.tabs = new Tabs();
    this.tabs.init(this.tabsDom, {
      tabOverlapDistance: 14,
      minWidth: 45,
      maxWidth: 243
    });
  }

  saveTabsDomRef = (dom: HTMLElement) => {
    this.tabsDom = dom;
  }

  addTab = () => {
    this.tabs.addTab({
      title: 'New Tab',
    });
  }

  render() {
    return (
      <div>
        <div className="chrome-tabs" ref={this.saveTabsDomRef}>
          <div className="chrome-tabs-content" />
          <div className="chrome-tabs-bottom-bar" />
        </div>

        <button onClick={this.addTab}>add tab</button>
      </div>
    );
  }
}
