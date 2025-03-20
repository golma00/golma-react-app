import React, { useState, useEffect } from 'react'
import { P2PageWrapper } from 'components/layout/index';
import { P2MessageBox } from 'components/control/index';
import { BrowserRouter } from 'react-router-dom';
import { Menu, Tabs } from 'antd';
import { TabNavigateContext } from 'hooks/useTabNavigate';
import axios from 'axios';
import * as Utils from 'utils/Utils';

function App() {

  const [currentTab, setCurrentTab] = useState(-1);
  const [tabs, setTabs] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    async function getAuthMenuList() {
      try {
        const res = await axios.post('/api/v1/auth/menuList', {});
        if (res.data.code === "00") {
          let keyByMenu = {};
          let menus = [];

          setMenuData(res.data.data.result);
          res.data.data.result.forEach(row => {
            const menu = row.leaf ? 
              <Menu.Item key={row.menuId} path={row.menuUrl} title={row.menuNm} menuId={row.menuId}>{row.menuNm}</Menu.Item> :
              <Menu.SubMenu key={row.menuId} title={row.menuNm} menuId={row.menuId} children={[]}></Menu.SubMenu>;

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
    addTab({
      menuId: menuInfo.item.props.menuId,
      title: menuInfo.item.props.title,
      path: menuInfo.item.props.path,
    });
  }

  function addTab(menu) {
    if (Utils.isEmpty(menu.menuId) && Utils.isNotEmpty(menu.path)) {
      const m = findMenuByPath(menu.path);
      if (m) {
        menu.menuId = m.menuId;
        menu.title  = m.menuNm;
      }
      else {
        return;
      }
    }
    if (Utils.isEmpty(menu.path)) {
      return;
    }

    const tab = tabs.filter(tab => tab.key === menu.menuId);
    if (tab.length === 0) {
      setTabs(prev => [...prev, 
        <Tabs.TabPane tab={menu.title} key={menu.menuId} menuId={menu.menuId} menuPath={menu.path}>
          <P2PageWrapper key={menu.menuId} menuId={menu.menuId} menuPath={menu.path}>
          </P2PageWrapper>
        </Tabs.TabPane>,
      ]);
    }
    setCurrentTab(menu.menuId);
  }

  function findMenuByPath(path) {
    return menuData.find(menu => menu.menuUrl === path);
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
        <div className='flex flex-row p-2'>
          <TabNavigateContext.Provider value={[tabs, addTab, removeTab, setCurrentTab, findMenuByPath, menuData]}>
            <Tabs hideAdd activeKey={currentTab + ""} onChange={onTabChange} onEdit={onTabEdit} type="editable-card">
              {tabs}
            </Tabs>
          </TabNavigateContext.Provider>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App