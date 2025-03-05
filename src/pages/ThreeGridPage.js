import React, { useCallback, useState, useRef, useEffect } from 'react'
import "react-splitter-layout/lib/index.css";

function ThreeGridPage() {
  const [data, setData] = useState([]); // JSON 데이터 저장
  const [dataone, setDataone] = useState([]); // JSON 데이터 저장
  const [msg, setMsg] = useState([]); // JSON 데이터 저장
  const [msgst, setMsgst] = useState(0); // JSON 데이터 저장
  const [empno, setEmpno] = useState(null); // JSON 데이터 저장
  const [name, setName] = useState(null); // JSON 데이터 저장
  const [hpno, setHpno] = useState(null); // JSON 데이터 저장
  const [email, setEmail] = useState(null); // JSON 데이터 저장
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inqApi = async() => 
  {
    try {
      await setData([]);
      let responce = await fetch("http://127.0.0.1:8080/list");
      let responce_data =await responce.json();
      setData(responce_data?responce_data:[]);
      await setMsg({msg:'조회되었습니다.'});
      setMsgst(1);
    } catch(e) {
      alert('error=>',e);
    }
  }

  const inqApione =  (async() => {
    try {
      if (empno == null) {
        alert('사원번호를 입력하세요');
        return null;
      }
      await setDataone([]);
      let responce = await fetch(`http://127.0.0.1:8080/listone?id=${empno}`)
      let responce_data = await responce.json();
      await setDataone(responce_data?responce_data:[]);
      await setMsg({msg:'조회되었습니다.'});
      setMsgst(2);
    } catch(e) {
      await setDataone((prevState) => ({...prevState, name:'',hpno:'',email:''  }) );
      await setMsg({msg:'조회건이 없습니다.'});
      setMsgst(2);
    }
  })

const saveApi = (async() => {
    try {
            await setMsgst(0);
            let responce = await fetch("http://127.0.0.1:8080/insert", {
                                    method: 'POST', 
                                    headers: {
                                      "Content-Type":"application/json; charset=utf-8"
                                    },
                                    body: JSON.stringify({empno:empno,name:name,hpno:hpno,email:email})
            });
            let responce_data = await responce.json();
            setMsg(await responce_data||[]);
            setMsgst(3);
            // alert(responce_data.msg);
      } catch (e) {
            alert('error=>',e);
      } 
  })

  useEffect(() => {
    
    if (msgst == 2) {  //단건조회시
      setTimeout(() => {
        setName(dataone.name);
        setHpno(dataone.hpno);
        setEmail(dataone.email);
      } , 100)
    }

    if (msgst != 0) {
      setIsModalOpen(true);
    }
    setMsgst(0);

  }, [msgst]);  // msg가 변경될 때마다 실행  

  const openNewWindow = () => {
    const newUrl = `http://localhost:3000/two?empno=${encodeURIComponent(empno)}`;
    window.open(
      newUrl, // 새 창에서 열 URL
      "_blank", // 새 탭에서 열기
      "width=600,height=400,top=100,left=100"
    )
  }

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">처리결과</h2>
          <div>{children}</div>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <table >
        <tbody>
        <tr>
            <td width={600}><h2>📌 직원 현황</h2>
                <button className="common-btn" onClick={inqApi}>조회</button>
                </td>
                <td width={600}><h2>📌 직원 등록</h2>
                <button className="common-btn" onClick={inqApione}>조회</button>
                <button className="common-btn" onClick={async() => {saveApi()}}>저장</button>
                    {/* 모달예시 */}
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    모달 열기
                </button>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <p>{msg.msg}</p>
                </Modal>     

                {/* 세창예시 */}
                <button  onClick={openNewWindow} className="bg-blue-500 text-white px-4 py-2 rounded">
                    새 창 열기
                </button>
            </td>
        </tr>
        </tbody>             
      </table>
      <table border={0} >
      <tbody>    
      <tr>    
      <td width={600}>
        <table border={1} key="table1" >
          <tbody>
          <tr>
              <td width={100}>사원번호</td>
              <td width={100}>이름</td>
              <td width={100}>전화번호</td>
              <td width={100}>email</td>
          </tr>
            {data.map((item) => (
              <tr key={item.empno}>
                  <td width={100}>{item.empno}</td>
                  <td width={100}>{item.name}</td>
                  <td width={100}>{item.hpno}</td>
                  <td width={100}>{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>  
        </td>
        <td>
        <p/>
          <table border={1} valign="top">
          <tbody>
          <tr>
              <td><label>사원번호</label></td>
              <td><input type="text" id="empno" className="text-sm bg-white border border-gray-200 rounded-md" value={empno} onChange={(e)=> setEmpno(e.target.value)}>
                   </input></td>
            </tr>
            <tr>
              <td><label>이름</label></td>
              <td><input type="text" id="name"  className="text-sm bg-white border border-gray-200 rounded-md" value={name} onChange={(e)=> setName(e.target.value)}>
              </input></td>
            </tr>
            <tr>
              <td><label>전화번호</label></td>
              <td><input type="text" id="hpno"  className="text-sm bg-white border border-gray-200 rounded-md" value={hpno} onChange={(e)=> setHpno(e.target.value)}>
              </input></td>
            </tr>
            <tr>
              <td><label>email</label></td>
              <td><input type="text" id="email" className="text-sm bg-white border border-gray-200 rounded-md" value={email} onChange={(e)=> setEmail(e.target.value)}>
              </input></td>
            </tr>
            <tr />
            </tbody>            
          </table>
          </td>
          </tr>
    </tbody>   
    </table>
      </div>
  );
}

export default ThreeGridPage;