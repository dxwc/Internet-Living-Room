import React, { Component } from 'react';
import LoginPage from './login/Login.jsx';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

class Home extends Component {
  render() {
    return (
      <div>
        <Layout className="layout">
          <Header>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item><LoginPage/></Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px', height:650 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Public Channel</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background: '#fff', padding: 24, minHeight: 600 }}>Content</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Internet Living Room ©2018 Created by ILR
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default Home;