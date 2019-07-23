import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Layout, List, Icon } from 'antd';
import Cropper from './components/Cropper';

import { uniqueId } from './utils/utils';
import './App.css';
import "antd/dist/antd.css";

const { Header, Content, Sider } = Layout;

class App extends Component {
  state = {
    rectangles:[]
  }

  _rectAdded = (rectangles) => {
    this.setState({ rectangles });
  }

  _hide = (index) => {
    var rectangles = [...this.state.rectangles];
    rectangles[index].show = !rectangles[index].show;
    this.setState({ rectangles });
  }

  render() {
    let { rectangles } = this.state;
    console.log(rectangles);
    return (
      <div className="App">
        <Layout>
          <Header className="header">
            This is header!
            </Header>
          <Layout>
            <Sider width={100} style={{ background: '#fff' }}>
            </Sider>
            <Layout style={{ padding: '0' }}>
              <Content className='content'>
                <Cropper
                  rectAdded={this._rectAdded}
                  rectangles={this.state.rectangles}
                />
              </Content>
            </Layout>
            <Sider width={200} style={{ background: '#fff', paddingLeft: '5px' }}>
              <List
                itemLayout="horizontal"
                dataSource={rectangles}
                renderItem={(item, index) => (
                  < List.Item >
                    <List.Item.Meta
                      title={[
                        <Icon theme={item.show ? 'twoTone' : ''} key={uniqueId()} type="eye" onClick={e => this._hide(index)} />,
                        " Item " + index,
                        <Icon className="float-right" key={uniqueId()} type="delete" />
                      ]}
                  />
                  </List.Item>
                )}
              />
            </Sider>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default hot(App);
