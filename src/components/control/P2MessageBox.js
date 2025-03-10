import { Modal } from 'antd';

const P2MessageBox = {
  info: (props) => {
    if (typeof props === 'string') {
      props = {
        content: props,
      };
    }

    return Modal.info({
      ...props,
      title: props.title || '정보',
    });
  },

  success: (props) => { 
    if (typeof props === 'string') {
      props = {
        content: props,
      };
    }

    return Modal.success({
      ...props,
      title: props.title || '성공',
    });
  },

  error: (props) => {
    if (typeof props === 'string') {
      props = {
        content: props,
      };
    }

    return Modal.error({
      ...props,
      title: props.title || '에러',
    });
  },

  warn: (props) => {
    if (typeof props === 'string') {
      props = {
        content: props,
      };
    }

    return Modal.warn({
      ...props,
      title: props.title || '경고',
    });
  },

  confirm: (props) => {
    if (typeof props === 'string') {
      props = {
        content: props,
      };
    }
    
    return Modal.confirm({
      ...props,
      title: props.title || '확인',
    });
  }
};

export default P2MessageBox;
