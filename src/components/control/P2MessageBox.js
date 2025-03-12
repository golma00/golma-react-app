import { Modal } from 'antd';

/**
 * antd Modal 메서드를 래핑한 메서드
 * https://3x.ant.design/components/modal/
 */
const P2MessageBox = {

  setContent(props) {
    if (typeof props === 'string') {
      props = {
        content: props,
      };
    }
    if (props.content && props.content.includes('\n')) {
      props.className = 'whitespace-pre-wrap';
    }
    return props;
  },

  info: (props) => {
    props = P2MessageBox.setContent(props);

    return Modal.info({
      ...props,
      title: props.title || '정보',
    });
  },

  success: (props) => { 
    props = P2MessageBox.setContent(props);

    return Modal.success({
      ...props,
      title: props.title || '성공',
    });
  },

  error: (props) => {
    props = P2MessageBox.setContent(props);

    return Modal.error({
      ...props,
      title: props.title || '에러',
    });
  },

  warn: (props) => {
    props = P2MessageBox.setContent(props);

    return Modal.warn({
      ...props,
      title: props.title || '경고',
    });
  },

  confirm: (props) => {
    props = P2MessageBox.setContent(props);
    
    return Modal.confirm({
      ...props,
      title: props.title || '확인',
    });
  }
};

export default P2MessageBox;
