import React from 'react';
import '../../css/twoModal.css';
import Draggable from 'react-draggable';
import { useRef } from 'react';

const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;
  const nodeRef = useRef(null);

  return (
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <Draggable nodeRef={nodeRef}>
          <section ref={nodeRef}>
            <header>
              {header}
              <button className="close" onClick={close}>
                &times;
              </button>
            </header>
            <main>{props.children}</main>
            <footer>
              <button className="close" onClick={close}>
                close
              </button>
            </footer>
          </section>
        </Draggable>
      ) : null}
    </div>
  );
};

export default Modal;