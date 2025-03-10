import React, { useRef } from 'react';
import { Tree, Input } from 'antd';
import '../../css/tree.css'

const { TreeNode } = Tree;
const { Search } = Input;

var gData = [];
var dataList = [];

const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.CD;
    const title = node;
    console.log("key => ", key);
    dataList.push({ key, title: title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { rowData, change } = this.props;
    gData = rowData;
    generateList(gData);

    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.CD.indexOf(searchValue);
        const beforeStr = item.CD.substr(0, index);
        const afterStr = item.CD_NM.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              <span className="attributeObject" data-object={JSON.stringify(item)} ></span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.CD_NM}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.CD} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.CD} title={title} />;
      });
    return (
      <>
        <Search style={{ marginBottom: 6 }} placeholder="Search" onChange={this.onChange}/>
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={change} 
        >
          {loop(gData)}
        </Tree>
      </>
    );
  }
}

export default SearchTree;