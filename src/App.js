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
            if (row.displayYn === "Y") {
              const menu = row.leaf ? 
                <Menu.Item key={row.menuId} menuPath={row.menuPath} title={row.menuNm} menuId={row.menuId}>{row.menuNm}</Menu.Item> :
                <Menu.SubMenu key={row.menuId} title={row.menuNm} menuId={row.menuId} children={[]}></Menu.SubMenu>;
  
              if (keyByMenu.hasOwnProperty(row.upperMenuId)) {
                keyByMenu[row.upperMenuId].props.children.push(menu);
                keyByMenu[row.menuId] = menu;
              }
              else {
                keyByMenu[row.menuId] = menu;
                menus.push(menu);
              }
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

  /**
   * 탭 제거
   * @param {string} key 탭 키
   */
  function removeTab(key) {
    const index = tabs.findIndex(tab => Utils.toString(tab.key) === Utils.toString(key));
    if (index > -1) {
      if (tabs.length > 1) {
        setCurrentTab(tabs[(index === 0 ? 1 : index - 1)].key);
      }
      setTabs([...tabs.filter(tab => Utils.toString(tab.key) !== Utils.toString(key))]);
    }
  }

  function onMenuClick(menuInfo) {
    addTab({
      menuId: menuInfo.item.props.menuId,
      title: menuInfo.item.props.title,
      menuPath: menuInfo.item.props.menuPath,
    });
  }

  /**
   * 탭 추가
   * @param {
   *   menuId: 메뉴ID
   *   title: 메뉴명
   *   menuPath: 메뉴경로
   *   closeAfterOpen: 닫고 나서 열지 여부
   *   params: 파라미터
   * } menu 
   */
  function addTab(menu) {
    if (Utils.isEmpty(menu.menuId) && Utils.isNotEmpty(menu.menuPath)) {
      const findMenu = findMenuByPath(menu.menuPath);
      if (findMenu) {
        menu.menuId = findMenu.menuId;
        menu.title  = findMenu.menuNm;
        menu.menuPath = findMenu.menuPath;
      }
      else {
        return;
      }
    }
    if (Utils.isEmpty(menu.menuPath)) {
      return;
    }

    if (menu.closeAfterOpen === true) {
      removeTab(menu.menuId);
    }

    const tab = tabs.filter(tab => Utils.toString(tab.key) === Utils.toString(menu.menuId));
    if (menu.closeAfterOpen || tab.length === 0) {
      setTabs(prev => [...prev, 
        <Tabs.TabPane tab={menu.title} key={menu.menuId} menuId={menu.menuId} menuPath={menu.menuPath}>
          <P2PageWrapper key={menu.menuId} menuId={menu.menuId} menuPath={menu.menuPath} params={menu.params||{}}/>
        </Tabs.TabPane>,
      ]);
    }
    setCurrentTab(menu.menuId);
  }

  /**
   * 메뉴 경로로 메뉴 찾기
   * @param {string} menuPath 메뉴 경로
   * @returns {object} 메뉴 객체
   */
  function findMenuByPath(menuPath) {
    return menuData.find(menu => menu.menuPath === menuPath);
  }

  return (
    <BrowserRouter>
      <div className='w-full h-full p-0'>
        <div className='top-menu-bar'>
          <div className='flex flex-row self-center'>
            <div className='text-2xl font-bold text-white'>Equipment Life Cycle Management</div>
          </div>
          <div className='flex flex-row self-center'>
            <Menu onClick={onMenuClick} mode="horizontal">
              {menuList}
            </Menu>
          </div>
        </div>
        <div className='flex flex-row p-2 w-full h-[calc(100vh-var(--top-menu-bar-height))]'>
          <TabNavigateContext.Provider value={[tabs, addTab, removeTab, setCurrentTab, findMenuByPath, menuData]}>
            <Tabs hideAdd activeKey={Utils.toString(currentTab)} onChange={onTabChange} onEdit={onTabEdit} type="editable-card">
              {tabs}
            </Tabs>
          </TabNavigateContext.Provider>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App