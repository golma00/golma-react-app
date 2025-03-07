import React, { useEffect, useState } from "react";
import { Tree } from "antd";

const TreePage = () => {
  const [treeData, setTreeData] = useState([]);
  const [msgst, setMsgst] = useState(0); // JSON 데이터 저장
  const [data, setData] = useState([]); // JSON 데이터 저장

  const formatTreeData = (data, depth = 0) => {
    return data.map((item) => ({
      title: (
        <span style={{ marginLeft: depth * 20 }}>{item.name}</span> // Depth마다 20px 들여쓰기
      ),
      key: item.id,
      children: item.children ? formatTreeData(item.children, depth + 1) : [],
    }));
  };
  
  const inqApi = async() => 
    {
      try {
        await setData([]);
        let responce = await fetch("http://127.0.0.1:8080/menu");
        let responce_data =await responce.json();
        setData(responce_data?responce_data:[]);
        setMsgst(1);
      } catch(e) {
        alert('error=>',e);
      }
    }

  useEffect(() => {
    if (msgst != 0) {
      if (msgst == 1) {
        const tree = buildTreeData(data);  // 트리 구조로 변환
        console.log('tree=>', JSON.stringify(tree, null, ' '))
        setTreeData(formatTreeData(tree));
      }
    }
    setMsgst(0);
  }, [msgst]);  // msg가 변경될 때마다 실행  
  

  // 트리 구조로 변환하는 함수
  const buildTreeData = (data) => {
    const map = {};  // id를 키로 하는 맵
    const roots = []; // 최상위 항목을 저장할 배열

    // 데이터에서 각 항목을 맵에 저장하고 부모-자식 관계 설정
    data.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.parent_id === null) {
        // 최상위 항목일 경우 root 배열에 추가
        roots.push(map[item.id]);
      } else {
        // 부모 항목에 children 추가
        if (map[item.parent_id]) {
          map[item.parent_id].children.push(map[item.id]);
        }
      }
    });
    return roots;  // 최상위 항목을 반환
  };

  return (
    <>
      <div>
      <button className="common-btn" onClick={inqApi}>조회</button>
      <br/>
      <table>
        <tbody>
          <td width={2000}>
            <Tree treeData={treeData}
                  switcherIcon={null} />
          </td>
        <td width={150}>
          111
        </td>
      </tbody>
      </table>
      </div>
    </>
  );
};

export default TreePage;