import React, { useState, useEffect, useCallback, useImperativeHandle, useRef, forwardRef } from "react";
import { Tree, } from "antd";
import * as Utils from "utils/Utils";
export const insertStatus = "I"
export const updateStatus = "U"
export const deleteStatus = "D"
export const statusField = "_status" 
export const oldStatusField = "_oldStatus";

function P2Tree(props, ref) {
  const [nodeKeyField, setNodeKeyField] = useState(props.nodeKeyField || "key");
  const [parentKeyField, setParentKeyField] = useState(props.parentKeyField || "parentKey");
  const [nodeTitleField, setNodeTitleField] = useState(props.nodeTitleField || "title");
  const [nodeSeqField, setNodeSeqField] = useState(props.nodeSeqField || "alignSeq");
  const [rowData, setRowData] = useState(props.rowData || []);
  const [treeData, setTreeData] = useState();
  const [selectedTreeNode, setSelectedTreeNode] = useState();
  const [newNodeCount, setNewNodeCount] = useState(1);
  const [newNodeKey, setNewNodeKey] = useState(null);

  const [expandedKeys, setExpandedKeys] = useState(props.defaultExpandedKeys || []);
  const [selectKeys, setSelectKeys] = useState(props.selectKeys || []);
  const [allKeys, setAllKeys] = useState(null);

  const [keyByTreeNode, setKeyByTreeNode] = useState({});
  const [expandDepth] = useState(props.expandDepth || allKeys);
  const [editable] = useState(props.editable || true);
  
  // 플래그: 초기 로드 여부
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useImperativeHandle(ref, () => ({
    api: {
      clear: () => {
        setSelectKeys([]);
        setSelectedTreeNode(null);
        setExpandedKeys(props.defaultExpandedKeys || allKeys);
        setKeyByTreeNode({});
        setTreeData([]);
      },
      getTreeData: () => {
        return treeData;
      },
      getRowData: () => {
        return rowData;
      },
      setRowData: (rowData) => {
        setRowData([...rowData]);
      },
      getModifiedRows: () => {
        return rowData.filter((item) => item[statusField] !== "");
      },
      addAfterTreeNode: (data) => {
        if (selectedTreeNode) {
          setNewNodeCount(prev => prev + 1);

          const newNodeId = `new${newNodeCount}`;
          setNewNodeKey(newNodeId);

          const parentNode = keyByTreeNode[selectedTreeNode.props.dataRef[parentKeyField]];

          let newNode = { 
            [oldStatusField]: insertStatus,
            [statusField]: insertStatus, 
            [nodeKeyField]: newNodeId, 
            [parentKeyField]: parentNode.key||parentNode.props.eventKey, 
            ...data 
          };

          if (typeof nodeTitleField === "string") {
            newNode[nodeTitleField] = `신규 ${newNodeCount}`;
          }

          setRowData([
            ...rowData.slice(0, rowData.indexOf(selectedTreeNode.props.dataRef) + 1),
            newNode,
            ...rowData.slice(rowData.indexOf(selectedTreeNode.props.dataRef) + 1)
          ]);

          setExpandedKeys(prev => [...prev, selectedTreeNode.key||selectedTreeNode.props.eventKey]);
        }
      },
      addChildTreeNode: (data) => {
        if (selectedTreeNode) {
          setNewNodeCount(prev => prev + 1);

          const newNodeId = `new${newNodeCount}`;
          setNewNodeKey(newNodeId);

          let newNode = { 
            [oldStatusField]: insertStatus,
            [statusField]: insertStatus, 
            [nodeKeyField]: newNodeId, 
            [parentKeyField]: selectedTreeNode.key||selectedTreeNode.props.eventKey, 
            ...data 
          };

          if (typeof nodeTitleField === "string") {
            newNode[nodeTitleField] = `신규 ${newNodeCount}`;
          }

          let insertIndex = 0;
          if (selectedTreeNode.props.children && selectedTreeNode.props.children.length > 0) {
            const lastChild = selectedTreeNode.props.children[selectedTreeNode.props.children.length - 1];
            insertIndex = rowData.indexOf(lastChild.props.dataRef) + 1;
          }
          else {
            insertIndex = rowData.indexOf(selectedTreeNode.props.dataRef) + 1
          }

          setRowData([
            ...rowData.slice(0, insertIndex),
            newNode,
            ...rowData.slice(insertIndex)
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
      // 처음 화면 들어올 때 최상단 선택
      firstNodeSelect: () => {
        if (rowData && rowData.length > 0) {
          const key = String(rowData[0][nodeKeyField]);
          const node = keyByTreeNode[key];
          setSelectKeys([key]);
          
          if (props.onSelect && node) {
            props.onSelect(key, { node, selected: true });
          }
        }
      }
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
      if (treeNode.props.dataRef[statusField] === insertStatus) {
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
        treeNode.props.dataRef[statusField] = deleteStatus;
      }
    }
    else {
      treeNode.props.dataRef[statusField] = deleteStatus;
    }

    return deleted;
  }

  useEffect(() => {
    setRowData(props.rowData);
  }, [props.rowData]);

  useEffect(() => {
    setNodeKeyField(props.nodeKeyField || "key");
    setParentKeyField(props.parentKeyField || "parentKey");
    setNodeTitleField(props.nodeTitleField || "title");
    setNodeSeqField(props.nodeSeqField || "alignSeq");
  }, [props.nodeKeyField, props.parentKeyField, props.nodeTitleField, props.nodeSeqField]);

  useEffect(() => {
    const createTree = (data) => {
      let treeNodes = [];
      let keyByTreeNodeMap = {};
      // 모든 노드의 키를 누적할 배열
      let allKeys = [];
      
      const expandedKeyList = [];
      // 키 : 뎁스 맵 
      const nodeDepthMap = {};
  
      data.forEach((item, index) => {
        if (!item["_status"]) {
          item["_status"] = "";
          item["_oldStatus"] = "";
        }

        const key = String(item[nodeKeyField]);
        const parentKey = item[parentKeyField];
        // 부모 키 값이 존재 할 경우 depth 값을 1 추가해서 지정 후 다시 대입
        const depth = nodeDepthMap[parentKey] ? nodeDepthMap[parentKey] + 1 : 1;
        nodeDepthMap[key] = depth;
        
        // depth 가 prop으로 주어지지 않으면 모두 펼쳐지도록
        if (!expandDepth || depth <= expandDepth) {
          if (parentKey && !expandedKeyList.includes(parentKey)) {
            expandedKeyList.push(parentKey);
          }
          if (!expandedKeyList.includes(key)) {
            expandedKeyList.push(key);
          }
        }
        let title = "";
        if (typeof nodeTitleField === "function") {
          title = nodeTitleField(item);
        }
        else {
          title = item[nodeTitleField];
        }

        const node = <Tree.TreeNode 
        key={String(item[props.nodeKeyField || "key"])}
          title={
            item[statusField] === "I" ? <span className="text-blue-500">{title}</span> :
            item[statusField] === "U" ? <span className="text-red-500">{title}</span> :
            item[statusField] === "D" ? <span className="line-through">{title}</span> :
            title
          }
          children={[]}
          dataRef={item}
          update={update}
          disabled={item["disabled"] === "Y" || item["disabled"] === true}
        />;

        //allKeys.push(item[nodeKeyField]);
        allKeys.push(String(item[props.nodeKeyField || "key"]));
  
        if (newNodeKey && item[nodeKeyField] === newNodeKey) {
          setNewNodeKey(null);
          
          keyByTreeNodeMap[node.props.dataRef[nodeKeyField]] = node;
          onSelect(newNodeKey, { node: node, selected: true });
        }
        
        if (keyByTreeNodeMap.hasOwnProperty(item[parentKeyField])) {
          const parentNode = keyByTreeNodeMap[item[parentKeyField]];
          parentNode.props.children.push(node);
          keyByTreeNodeMap[item[nodeKeyField]] = node;
          if (editable) {
            if (Utils.isEmpty(item[nodeSeqField])) {
              item[nodeSeqField] = parentNode.props.children.length;
            }
          }
          else {
            if (editable) {
              if (item[nodeSeqField] !== parentNode.props.children.length) {
                if (Utils.isEmpty(item[statusField])) {
                  item[statusField] = updateStatus;
                }
              }
              item[nodeSeqField] = parentNode.props.children.length;
            }
          }
        }
        else {
          treeNodes.push(node);
          keyByTreeNodeMap[item[nodeKeyField]] = node;
          if (editable) {
            item[nodeSeqField] = 1;
          }
        }
      });
  
      setKeyByTreeNode(prev => ({ ...prev, ...keyByTreeNodeMap }));
      // 만약 expandedKeys 상태가 비어있는 경우에만 모든 키로 설정
      if (isInitialLoad) {
        setExpandedKeys(expandedKeyList);
        setAllKeys(allKeys);
        setIsInitialLoad(false);
      }
      return treeNodes;
    }

    if (rowData && rowData.length > 0) {
      setTreeData(createTree(rowData));
    }
    else {
      setKeyByTreeNode({});
      setTreeData([]);
      if (isInitialLoad) {
        setExpandedKeys([]);
      }
    }
  }, [rowData, nodeKeyField, parentKeyField, nodeTitleField, nodeSeqField, newNodeKey]);

  const update = useCallback(() => {
    setRowData([...rowData]);
  }, [rowData]);

  const onSelect = useCallback((selectedKey, e) => {

    if (props.onBeforeSelect && selectedTreeNode && e.node !== selectedTreeNode) {
      const result = props.onBeforeSelect(selectedTreeNode);
      if (!result) {
        return;
      }
    }

    // 노드를 선택하지 않는 기능은 제외
    if (!e.selected) {
      return;
    }

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
      if (dragNode.props.dataRef[statusField] === "") {
        dragNode.props.dataRef[statusField] = updateStatus;
      }
      rowData.splice(startIndex, 0, rowData.splice(dragIndex, 1)[0]);

      let i = 1;
      dragNodesKeys.forEach((key) => {
        if (Utils.toString(key) !== Utils.toString(dragNode.props.dataRef[nodeKeyField])) {
          if (keyByTreeNode[key].props.dataRef[statusField] === "") {
            keyByTreeNode[key].props.dataRef[statusField] = updateStatus;
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
      if (dragNode.props.dataRef[statusField] === "") {
        dragNode.props.dataRef[statusField] = updateStatus;
      }
      rowData.splice(targetIndex + 1, 0, rowData.splice(dragIndex, 1)[0]);

      let i = 2;
      dragNodesKeys.forEach((key) => {
        if (Utils.toString(key) !== Utils.toString(dragNode.props.dataRef[nodeKeyField])) {
          if (keyByTreeNode[key].props.dataRef[statusField] === "") {
            keyByTreeNode[key].props.dataRef[statusField] = updateStatus;
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
        blockNode={true}
        expandedKeys={expandedKeys} 
        autoExpandParent={false} 
        defaultExpandParent={false}
        selectedKeys={selectKeys}
        onSelect={onSelect} 
        onDrop={onDrop}
        onExpand={onExpand}
        dafaultExpandAll
      >
        {treeData}
      </Tree>
    </div>
  )
}

export default forwardRef(P2Tree);
