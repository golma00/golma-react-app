import React, { useState, useEffect } from 'react'
import * as pages from 'pages/index';
import { P2PageWrapper } from 'components/layout/index';
import { P2MessageBox } from 'components/control/index';
import { BrowserRouter } from 'react-router-dom';
import { Menu, Tabs } from 'antd';
import axios from 'axios';

function App() {

  const [currentTab, setCurrentTab] = useState("pages/CommonPage");
  const [tabs, setTabs] = useState([
  ]);

  const [pagePaths, setPagePaths] = useState({
    "pages/CommonPage": <P2PageWrapper><pages.CommonPage /></P2PageWrapper>,
    "pages/OneGridPage": <P2PageWrapper><pages.OneGridPage /></P2PageWrapper>,
    "pages/TwoGridPage": <P2PageWrapper><pages.TwoGridPage /></P2PageWrapper>,
    "pages/ThreeGridPage": <P2PageWrapper><pages.ThreeGridPage /></P2PageWrapper>,
    "pages/GridFormPage": <P2PageWrapper><pages.GridFormPage /></P2PageWrapper>,
    "pages/TreeFormPage": <P2PageWrapper><pages.TreeFormPage /></P2PageWrapper>,
    "pages/FourGridPage": <P2PageWrapper><pages.FourGridPage /></P2PageWrapper>,
    "pages/FiveGridPage": <P2PageWrapper><pages.FiveGridPage /></P2PageWrapper>,
    "pages/TreePage": <P2PageWrapper><pages.TreePage /></P2PageWrapper>,
    "pages/AttributeMng": <P2PageWrapper><pages.AttributeMng /></P2PageWrapper>,
  });

  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    async function getAuthMenuList() {
      try {
        const res = await axios.post('/api/v1/auth/menuList', {});
        if (res.data.code === "00") {
          let keyByMenu = {};
          let menus = [];
          res.data.data.result.forEach(row => {
            const menu = row.leaf ? 
              <Menu.Item key={row.menuId} path={row.menuUrl} title={row.menuNm}>{row.menuNm}</Menu.Item> :
              <Menu.SubMenu title={row.menuNm} children={[]}></Menu.SubMenu>;

            if (keyByMenu.hasOwnProperty(row.upperMenuId)) {
              keyByMenu[row.upperMenuId].props.children.push(menu);
              keyByMenu[row.menuId] = menu;
            }
            else {
              keyByMenu[row.menuId] = menu;
              menus.push(menu);
            }
          }); 
          setMenuList(menus);
        }
        else {
          P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다.');
        }
      }
      catch (e) {
        P2MessageBox.error(e.message || '시스템 오류가 발생했습니다.');
      }
    }
    getAuthMenuList();
  }, []);

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
        setCurrentTab(tabs[(index === 0 ? 1 : index - 1)].key);
      }
      setTabs([...tabs.filter(tab => tab.key !== key)]);
    }
  }

  function onMenuClick(menuInfo) {
    const tab = tabs.filter(tab => tab.key === menuInfo.key);
    if (tab.length === 0) {
      setTabs(prev => [...prev, 
        <Tabs.TabPane tab={menuInfo.item.props.title} key={menuInfo.key}>
          <P2PageWrapper menuId={menuInfo.key}>
            {pagePaths[menuInfo.item.props.path]}
          </P2PageWrapper>
        </Tabs.TabPane>,
      ]);
    }
    setCurrentTab(menuInfo.key);
  }

  return (
    <BrowserRouter>
      <div className='w-full h-full p-0'>
        <div className='h-16 flex flex-row justify-between items-center px-4 bg-primary-900'>
          <div className='flex flex-row self-center'>
            <div className='text-2xl font-bold text-white'>Equipment Life Cycle Management</div>
          </div>
          <div className='flex flex-row self-center'>
            <Menu onClick={onMenuClick} mode="horizontal">
              {menuList}
            </Menu>
          </div>
        </div>
        <div className='flex flex-row self-center'>
          <Menu onClick={onMenuClick} mode="horizontal">
            <Menu.Item key="pages/CommonPage" path="pages/CommonPage" title="Home">Home</Menu.Item>
            <Menu.SubMenu title={<span className="submenu-title-wrapper"><Icon type="setting" />SAMPLE</span>}>
              <Menu.Item key="pages/OneGridPage" path="pages/OneGridPage" title="One">One</Menu.Item>
              <Menu.Item key="pages/TwoGridPage" path="pages/TwoGridPage" title="Two">Two</Menu.Item>
              <Menu.Item key="pages/ThreeGridPage" path="pages/ThreeGridPage" title="Three">Three</Menu.Item>
              <Menu.Item key="pages/FourGridPage" path="pages/FourGridPage" title="Four">Four</Menu.Item>
              <Menu.Item key="pages/FiveGridPage" path="pages/FiveGridPage" title="Five">Five</Menu.Item>
              <Menu.Item key="pages/GridFormPage" path="pages/GridFormPage" title="GridForm">GridForm</Menu.Item>
              <Menu.Item key="pages/TreeFormPage" path="pages/TreeFormPage" title="TreeForm">TreeForm</Menu.Item>
              <Menu.Item key="pages/TreePage" path="pages/TreePage" title="Tree">Tree</Menu.Item>
              <Menu.Item key="pages/AttributeMng" path="pages/AttributeMng" title="AttributeMng">AttributeMng</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
