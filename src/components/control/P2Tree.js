import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { Tree, } from "antd";

function P2Tree(props, ref) {
  const [nodeKeyField, setNodeKeyField] = useState(props.nodeKeyField || "key");
  const [parentKeyField, setParentKeyField] = useState(props.parentKeyField || "parentKey");
  const [nodeTitleField, setNodeTitleField] = useState(props.nodeTitleField || "title");
  const [nodeSeqField, setNodeSeqField] = useState(props.nodeSeqField || "alignSeq");
  const [rowData, setRowData] = useState();
  const [treeData, setTreeData] = useState();
  const [selectedTreeNode, setSelectedTreeNode] = useState();
  const [newNodeCount, setNewNodeCount] = useState(1);
  const [newNodeKey, setNewNodeKey] = useState(null);

  const [expandedKeys, setExpandedKeys] = useState(props.defaultExpandedKeys || []);
  const [selectKeys, setSelectKeys] = useState(props.selectKeys || []);

  const [keyByTreeNode, setKeyByTreeNode] = useState({});

  useImperativeHandle(ref, () => ({
    api: {
      getTreeData: () => {
        return treeData;
      },
      getRowData: () => {
        return rowData;
      },
      getModifiedRowData: () => {
        return rowData.filter((item) => item["_status"] !== "");
      },
      addChildTreeNode: (data) => {
        if (selectedTreeNode) {
          setNewNodeCount(prev => prev + 1);

          const newNodeId = `new${newNodeCount}`;
          setNewNodeKey(newNodeId);

          setRowData([
            ...rowData.slice(0, rowData.indexOf(selectedTreeNode.props.dataRef) + 1),
            { 
              _oldStatus: "I",
              _status: "I", 
              [nodeTitleField]: `신규 ${newNodeCount}`, 
              [nodeKeyField]: newNodeId, 
              [parentKeyField]: selectedTreeNode.key||selectedTreeNode.props.eventKey, 
              ...data 
            },
            ...rowData.slice(rowData.indexOf(selectedTreeNode.props.dataRef) + 1)
          ]);

          setExpandedKeys(prev => [...prev, selectedTreeNode.key||selectedTreeNode.props.eventKey]);
        }
      },
      deleteTreeNode: (key) => {
        const treeNode = keyByTreeNode[key];
        recursiveDeleteTreeNode(treeNode);

        setRowData([ ...rowData ]);
      },
      getSelectedTreeNodeKey: () => {
        return selectedTreeNode.key || selectedTreeNode.props.eventKey;
      },
      getSelectedTreeNode: () => {
        return selectedTreeNode;
      },
      setSelectedTreeNode: (key) => {
        setSelectKeys([key]);
      },
    }
  }));

  const recursiveDeleteTreeNode = (treeNode) => {
    let deleted = false;
    if (treeNode.props.children && treeNode.props.children.length > 0) {
      treeNode.props.children.forEach((child) => {
        deleted = recursiveDeleteTreeNode(child);
        if (deleted) {
          treeNode.props.children.splice(treeNode.props.children.indexOf(child), 1);
        }
      });
    }

    if ((!treeNode.props.children || treeNode.props.children.length === 0)) {
      if (treeNode.props.dataRef["_status"] === "I") {
        const index = rowData.indexOf(treeNode.props.dataRef);
        if (index > -1) {
          rowData.splice(index, 1);

          let keyByTreeNodeMap = keyByTreeNode;
          delete keyByTreeNodeMap[treeNode.props.dataRef[nodeKeyField]];
          setKeyByTreeNode(keyByTreeNodeMap);

          deleted = true;
        }
      }
      else {
        treeNode.props.dataRef["_status"] = "D";
      }
    }
    else {
      treeNode.props.dataRef["_status"] = "D";
    }

    return deleted;
  }

  useEffect(() => {
    setRowData(props.rowData);
    setNodeKeyField(props.nodeKeyField || "key");
    setParentKeyField(props.parentKeyField || "parentKey");
    setNodeTitleField(props.nodeTitleField || "title");
    setNodeSeqField(props.nodeSeqField || "alignSeq");
  }, [props.rowData, props.nodeKeyField, props.parentKeyField, props.nodeTitleField, props.nodeSeqField]);

  useEffect(() => {
    const createTree = (data) => {
      let treeNodes = [];
      let keyByTreeNodeMap = {};
  
      data.forEach((item) => {
        if (!item["_status"]) {
          item["_status"] = "";
          item["_oldStatus"] = "";
        }

        let title = "";
        if (typeof nodeTitleField === "function") {
          title = nodeTitleField(item);
        }
        else {
          title = item[nodeTitleField];
        }

        const node = <Tree.TreeNode 
          key={item[nodeKeyField]} 
          title={
            item["_status"] === "I" ? <span className="text-blue-500">{title}</span> :
            item["_status"] === "U" ? <span className="text-red-500">{title}</span> :
            item["_status"] === "D" ? <span className="line-through">{title}</span> :
            title
          }
          children={[]}
          dataRef={item}
          update={update}
        />;
  
        if (newNodeKey && item[nodeKeyField] === newNodeKey) {
          setNewNodeKey(null);
  
          keyByTreeNodeMap[node.props.dataRef[nodeKeyField]] = node;
          onSelect(newNodeKey, {node: node});
        }
        
        if (keyByTreeNodeMap.hasOwnProperty(item[parentKeyField])) {
          const parentNode = keyByTreeNodeMap[item[parentKeyField]];
          parentNode.props.children.push(node);
          keyByTreeNodeMap[item[nodeKeyField]] = node;
          item[nodeSeqField] = parentNode.props.children.length - 1;
        }
        else {
          treeNodes.push(node);
          keyByTreeNodeMap[item[nodeKeyField]] = node;
          item[nodeSeqField] = 0;
        }
      });
  
      setKeyByTreeNode(prev => ({ ...prev, ...keyByTreeNodeMap }));
      return treeNodes;
    }

    if (rowData && rowData.length > 0) {
      setTreeData(createTree(rowData));
    }
    else {
      setKeyByTreeNode({});
      setTreeData([]);
    }
  }, [rowData, nodeKeyField, parentKeyField, nodeTitleField, nodeSeqField, newNodeKey]);

  const update = useCallback(() => {
    setRowData([...rowData]);
  }, [rowData]);

  const onSelect = useCallback((selectedKey, e) => {
    setSelectedTreeNode(e.node);
    setSelectKeys([e.node.key || e.node.props.eventKey]);

    if (props.onSelect) {
      props.onSelect(selectedKey, e);
    }
  }, [keyByTreeNode]);

  const onDrop = useCallback((info) => {
    const { node: targetNode, dragNode, dragNodesKeys, dropPosition } = info;

    // 순서 변경
    if (info.dropToGap) {
      const targetIndex = rowData.indexOf(targetNode.props.dataRef);
      const targetNodeKey = targetNode.props.dataRef[nodeKeyField];
      const dragIndex = rowData.indexOf(dragNode.props.dataRef);

      const parentKey = dragNode.props.dataRef[parentKeyField];
      const parentNode = keyByTreeNode[parentKey];

      let insertType = "before";
      const targetNodePositionInParentChailren = parentNode.props.children.indexOf(keyByTreeNode[targetNodeKey]);
      if (dropPosition > targetNodePositionInParentChailren) { // 아래로 이동
        insertType = "after";
      }

      const startIndex = targetIndex + (insertType === "before" ? 0 : 1);
      dragNode.props.dataRef[parentKeyField] = targetNode.props.dataRef[parentKeyField];
      if (dragNode.props.dataRef["_status"] === "") {
        dragNode.props.dataRef["_status"] = "U";
      }
      rowData.splice(startIndex, 0, rowData.splice(dragIndex, 1)[0]);

      let i = 1;
      dragNodesKeys.forEach((key) => {
        if (key !== dragNode.props.dataRef[nodeKeyField]) {
          if (keyByTreeNode[key].props.dataRef["_status"] === "") {
            keyByTreeNode[key].props.dataRef["_status"] = "U";
          }
          rowData.splice(startIndex + i, 0, rowData.splice(rowData.indexOf(keyByTreeNode[key].props.dataRef), 1)[0]);
          i++;
        }
      });

      setRowData([ ...rowData ]);

      setExpandedKeys(prev => [...prev, dragNode.props.eventKey]);
    }
    else { // 다른 부모 내에서 이동
      const parentKey = dragNode.props.dataRef[parentKeyField];
      const targetIndex = rowData.indexOf(targetNode.props.dataRef);
      const dragIndex = rowData.indexOf(dragNode.props.dataRef);

      // 현재 부모에서 삭제
      const parentNode = keyByTreeNode[parentKey];
      parentNode.props.children.splice(parentNode.props.children.indexOf(dragNode), 1);

      // 새로운 부모에 추가
      dragNode.props.dataRef[parentKeyField] = targetNode.props.dataRef[nodeKeyField];
      if (dragNode.props.dataRef["_status"] === "") {
        dragNode.props.dataRef["_status"] = "U";
      }
      rowData.splice(targetIndex + 1, 0, rowData.splice(dragIndex, 1)[0]);

      let i = 2;
      dragNodesKeys.forEach((key) => {
        if (key !== dragNode.props.dataRef[nodeKeyField]) {
          if (keyByTreeNode[key].props.dataRef["_status"] === "") {
            keyByTreeNode[key].props.dataRef["_status"] = "U";
          }
          rowData.splice(targetIndex + i, 0, rowData.splice(rowData.indexOf(keyByTreeNode[key].props.dataRef), 1)[0]);
          i++;
        }
      });

      setRowData([ ...rowData ]);

      setExpandedKeys(prev => [...prev, targetNode.props.eventKey]);
    }

    if (props.onDrop) {
      props.onDrop(info);
    }
  }, [keyByTreeNode]);

  const onExpand = useCallback((expandedKeys) => {
    setExpandedKeys(expandedKeys);
  }, []);

  return (
    <div className="h-full border border-gray-300 rounded-md p-2 overflow-y-auto">
      <Tree {...props} 
        draggable={true}
        blockNode={true}
        expandedKeys={expandedKeys} 
        autoExpandParent={false} 
        defaultExpandParent={false}
        selectedKeys={selectKeys}
        onSelect={onSelect} 
        onDrop={onDrop}
        onExpand={onExpand}
      >
        {treeData}
      </Tree>
    </div>
  )
}

export default forwardRef(P2Tree);
