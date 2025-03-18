import React, { Children, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function P2GridButtonBar(props) {

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row w-full h-8 gap-1 justify-start">
        {props.title && (
          <span className="text-base self-end text-ellipsis whitespace-nowrap">{props.title}</span>
        )}
        {props.count > 0 && (
          <span className="text-base self-end text-ellipsis whitespace-nowrap">({props.count.toLocaleString()} 건)</span>
        )}
      </div>
      <div className="flex flex-row w-full h-8 gap-1 justify-end">
        {props.onAddRow && props.menuProps&& props.menuProps.saveUseYn === "Y" && (
          <button className="grid-btn" onClick={props.onAddRow}>
            <FontAwesomeIcon icon="fa-plus" className="pr-1" size="sm"/>
            <span>행추가</span>
          </button>
        )}
        {props.onDeleteRow && props.menuProps && props.menuProps.saveUseYn === "Y" && (
          <button className="grid-btn" onClick={props.onDeleteRow}>
            <FontAwesomeIcon icon="fa-minus" className="pr-1" size="sm"/>
            <span>행삭제</span>
          </button>
        )}
        {
          Children.map(props.children, (child, index) => {
            return (
              <React.Fragment key={index}>
                {
                  child.props.auth && props.menuProps && props.menuProps[child.props.auth] === "Y" && child
                }
                {
                  !child.props.auth && child
                }
              </React.Fragment>
            );
          })
        }
      </div>
    </div>
  );
}

export default P2GridButtonBar;
