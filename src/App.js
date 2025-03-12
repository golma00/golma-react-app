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
    "pages/CommonPage": <pages.CommonPage />,
    "pages/OneGridPage": <pages.OneGridPage />,
    "pages/TwoGridPage": <pages.TwoGridPage />,
    "pages/ThreeGridPage": <pages.ThreeGridPage />,
    "pages/FourGridPage": <pages.FourGridPage />,
    "pages/GridFormPage": <pages.GridFormPage />,
    "pages/TreeFormPage": <pages.TreeFormPage />,
    "pages/TreePage": <pages.TreePage />,
    "pages/AttributeMng": <pages.AttributeMng />,
    "pages/admin/MenuMng": <pages.MenuMng />,
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
        <div className='flex flex-row justify-between items-center px-2 border-b border-gray-200'>
          <div className='flex flex-row self-center'>
            <div className='text-lg font-bold'>Equipment Life Cycle Management</div>
          </div>
          <div className='flex flex-row self-center'>
            <Menu onClick={onMenuClick} mode="horizontal">
              {menuList}
            </Menu>
          </div>
        </div>
        <div className='flex flex-row p-2'>
          <Tabs hideAdd activeKey={currentTab} onChange={onTabChange} onEdit={onTabEdit} type="editable-card">
            {tabs}
          </Tabs>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
