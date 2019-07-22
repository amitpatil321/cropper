import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Layout } from 'antd';
import Cropper from './components/Cropper';

import './App.css';
import "antd/dist/antd.css";

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header className="header">
          This is header!
        </Header>
        <Layout>
          <Sider width={100} style={{ background: '#fff' }}>
            Sidebar
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content className='content'>
              <Cropper />
            </Content>
          </Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            Sidebar
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
}

export default hot(App);
