import React, { useState } from 'react'
import * as pages from 'pages/index';
import { P2PageWrapper } from 'components/layout/index';
import { Menu, Tabs, Icon } from 'antd';

function App() {

  const [currentTab, setCurrentTab] = useState("pages/CommonPage");

  const [tabs, setTabs] = useState([
    <Tabs.TabPane tab="Home" key="pages/CommonPage">
      <P2PageWrapper><pages.CommonPage /></P2PageWrapper>
    </Tabs.TabPane>,
  ]);

  const [pagePaths, setPagePaths] = useState({
    "pages/CommonPage": <P2PageWrapper><pages.CommonPage /></P2PageWrapper>,
    "pages/OneGridPage": <P2PageWrapper><pages.OneGridPage /></P2PageWrapper>,
    "pages/TwoGridPage": <P2PageWrapper><pages.TwoGridPage /></P2PageWrapper>,
    "pages/ThreeGridPage": <P2PageWrapper><pages.ThreeGridPage /></P2PageWrapper>,
    "pages/FourGridPage": <P2PageWrapper><pages.FourGridPage /></P2PageWrapper>,
    "pages/GridFormPage": <P2PageWrapper><pages.GridFormPage /></P2PageWrapper>,
    "pages/TreeFormPage": <P2PageWrapper><pages.TreeFormPage /></P2PageWrapper>,
    "pages/TreePage": <P2PageWrapper><pages.TreePage /></P2PageWrapper>,
    "pages/AttributeMng": <P2PageWrapper><pages.AttributeMng /></P2PageWrapper>,
  });

  function onTabChange(key) {
    setCurrentTab(key);
  }

  function onTabEdit(key, action) {
    if (action === 'remove') {
      removeTab(key);
    }
  }

  function removeTab(key) {
    const index = tabs.findIndex(tab => tab.key === key);
    if (index > -1) {
      if (tabs.length > 1) {
        setCurrentTab(tabs[index - 1].key);
      }
      setTabs([...tabs.filter(tab => tab.key !== key)]);
    }
  }

  function onMenuClick(menuInfo) {
    const tab = tabs.filter(tab => tab.key === menuInfo.key);
    if (tab.length === 0) {
      setTabs(prev => [...prev, 
        <Tabs.TabPane tab={menuInfo.item.props.title} key={menuInfo.key}>
          {pagePaths[menuInfo.item.props.path]}
        </Tabs.TabPane>,
      ]);
      setCurrentTab(menuInfo.key);
    }
  }

  return (
    <div className='w-full h-full p-0'>
      <div className='flex flex-row justify-between items-center px-2 border-b border-gray-200'>
        <div className='flex flex-row self-center'>
          <h2>Equipment Life Cycle Management</h2>
        </div>
        <div className='flex flex-row self-center'>
          <Menu onClick={onMenuClick} mode="horizontal">
            <Menu.Item key="pages/CommonPage" path="pages/CommonPage" title="Home">Home</Menu.Item>
            <Menu.SubMenu title={<span className="submenu-title-wrapper"><Icon type="setting" />SAMPLE</span>}>
              <Menu.Item key="pages/OneGridPage" path="pages/OneGridPage" title="One">One</Menu.Item>
              <Menu.Item key="pages/TwoGridPage" path="pages/TwoGridPage" title="Two">Two</Menu.Item>
              <Menu.Item key="pages/ThreeGridPage" path="pages/ThreeGridPage" title="Three">Three</Menu.Item>
              <Menu.Item key="pages/FourGridPage" path="pages/FourGridPage" title="Four">Four</Menu.Item>
              <Menu.Item key="pages/GridFormPage" path="pages/GridFormPage" title="GridForm">GridForm</Menu.Item>
              <Menu.Item key="pages/TreeFormPage" path="pages/TreeFormPage" title="TreeForm">TreeForm</Menu.Item>
              <Menu.Item key="pages/TreePage" path="pages/TreePage" title="Tree">Tree</Menu.Item>
              <Menu.Item key="pages/AttributeMng" path="pages/AttributeMng" title="AttributeMng">AttributeMng</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </div>
      <div className='flex flex-row p-2'>
        <Tabs hideAdd activeKey={currentTab} onChange={onTabChange} onEdit={onTabEdit} type="editable-card">
          {tabs}
        </Tabs>
      </div>
    </div>
  )
}

export default App
