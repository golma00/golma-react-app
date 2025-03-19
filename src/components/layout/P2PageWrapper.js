import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { P2MessageBox } from 'components/control/index';

function P2PageWrapper(props) {
  const [success, setSuccess] = useState(false);
  const [menuProps, setMenuProps] = useState({});
  const [Page, setPage] = useState(null);

  useEffect(() => {
    const loadComponent = async () => {
      const { default: loadedComponent } = await import(`../../${props.menuPath}.js`);
      setPage(() => loadedComponent);
    };
    loadComponent();

    async function getMenuAuth() {
      try {
        const res = await axios.post('/api/v1/auth/menuAuth', { menuId: props.menuId });
        if (res.data.code === "00") {
          setMenuProps(res.data.data.result);
          setSuccess(true);
        }
        else {
          P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다.');
          setSuccess(false);
        }
      }
      catch (e) {
        P2MessageBox.error(e.message || '시스템 오류가 발생했습니다.');
        setSuccess(false);
      }
    }
    getMenuAuth();

  }, []);

  return (
    <>
      { success && Page ? <Page menuProps={menuProps}/> : <div>Loading...</div>}
    </>
  )
}

export default P2PageWrapper;
