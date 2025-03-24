import React, { Children } from "react";
import { ReactComponent as AddRow } from "assets/icons/row_add.svg";
import { ReactComponent as DeleteRow } from "assets/icons/row_delete.svg";

function P2GridButtonBar(props) {

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row w-full h-8 gap-1 justify-start">
        {props.title && (
          <span className="text-base font-normal self-end text-ellipsis whitespace-nowrap">{props.title}</span>
        )}
        {props.count > 0 && (
          <span className="text-base self-end text-ellipsis whitespace-nowrap">({props.count.toLocaleString()} 건)</span>
        )}
      </div>
      <div className="flex flex-row w-full h-8 gap-1 justify-end">
        {props.onAddRow && props.menuProps&& props.menuProps.saveUseYn === "Y" && (
          <button className="grid-btn" onClick={props.onAddRow}>
            <div className="flex flex-row gap-1 items-center">
              <AddRow width={24} height={24} fill="#4B5359"/>
              <span>행추가</span>
            </div>
          </button>
        )}
        {props.onDeleteRow && props.menuProps && props.menuProps.saveUseYn === "Y" && (
          <button className="grid-btn" onClick={props.onDeleteRow}>
            <div className="flex flex-row gap-1 items-center">
              <DeleteRow width={24} height={24} fill="#4B5359"/>
              <span>행삭제</span>
            </div>
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
