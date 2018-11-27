import React, { Component } from 'react';
import LoginPage from './login/Login.jsx';
import { Layout, Menu, Breadcrumb, Card, Row, Col } from 'antd';

const { Header, Content, Footer } = Layout;

class Home extends Component {
  render() {
    return (
      <div>
        <Layout className="layout">
          <Header>
            <Row type="flex">
              <Col>
                <h1 style={ {color: "#C0C0C0"} }>Internet Living Room</h1>
              </Col>
              <Col>
                <LoginPage/>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: '0 50px', height: 650 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Public Channel</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background: '#fff', padding: 24, minHeight: 600 }}>
              <Row type="flex">
                <Col>
                  <Card style={{ width: 768, height: 432 }}>
                    <p>This part can be used to show video</p>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: 300, height: 432 }}>
                    <p>for showing the messages</p>
                  </Card>
                </Col>
              </Row>
              <Row type="flex">
                <Col>
                  <Card style={{ width: 768, height: 120 }}>
                    <p>for voting</p>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: 300, height: 120 }}>
                    <p>for typing the messages</p>
                  </Card>
                </Col>
              </Row>
            </div>
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