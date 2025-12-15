import React, { useCallback, useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client";
import { loadMessage } from '../../services/userService';
import moment from 'moment';

const host =
  (typeof window !== "undefined" &&
    window.__APP_CONFIG__ &&
    window.__APP_CONFIG__.BACKEND_URL) ||
  process.env.REACT_APP_BACKEND_URL;
function ChatWindow(props) {
  const [mess, setMess] = useState([]);
  const [userData, setuserData] = useState({});
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const socketRef = useRef();
  const socketIdRef = useRef();

  const fetchMessage = useCallback(async () => {
    if (!props.roomId) {
      return;
    }

    const res = await loadMessage(props.roomId, props.userId);
    if (res) {
      setMess(res.data);
      setuserData(res.data.userData);
    }
  }, [props.roomId, props.userId]);
 
  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    const userData = JSON.parse(localStorage.getItem('userData'));
    setUser(userData);
    
    socketRef.current.on('getId', data => {
      socketIdRef.current = data;
    }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.
   
    if (props.roomId) {
      fetchMessage();
    }

    socketRef.current.on('sendDataServer', () => {
      fetchMessage();
      const elem = document.getElementById('box-chat');
      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
    }); // mỗi khi có tin nhắn thì mess sẽ được render thêm 

    return () => {
      socketRef.current.disconnect();
    };
  }, [fetchMessage, props.roomId]);
  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        text: message,
        userId: user.id,
        roomId: props.roomId,
        userData: userData,
      };
      socketRef.current.emit('sendDataClient', msg);
 
     /*Khi emit('sendDataClient') bên phía server sẽ nhận được sự kiện có tên 'sendDataClient' và handle như câu lệnh trong file index.js
           socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
             socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
           })
     */
      setMessage('');
    }
  };
    return (

        <div className="ks-messages ks-messenger__messages">
        <div className="ks-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            {userData && userData.image && (
              <img src={userData.image} alt="Avatar" style={{width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', objectFit: 'cover'}} />
            )}
            <div className="ks-description">
              <div className="ks-name" style={{fontSize: '16px', fontWeight: '600', color: '#202124', marginBottom: '4px'}}>
                {userData && userData.firstName && userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}` 
                  : 'Chat'}
              </div>
              <div className="ks-amount" style={{fontSize: '13px', color: '#5f6368'}}>
                <span style={{display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#34a853', marginRight: '6px'}}></span>
                Đang hoạt động
              </div>
            </div>
          </div>
          <div className="ks-controls">
            <button className="btn btn-light" type="button" style={{borderRadius: '50%', width: '40px', height: '40px', padding: '0', border: 'none', background: '#f1f3f4', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.currentTarget.style.background = '#e8eaed'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f3f4'}>
              <span className="la la-phone" style={{fontSize: '18px', color: '#5f6368'}} />
            </button>
            <button className="btn btn-light" type="button" style={{borderRadius: '50%', width: '40px', height: '40px', padding: '0', border: 'none', background: '#f1f3f4', marginLeft: '8px', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.currentTarget.style.background = '#e8eaed'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f3f4'}>
              <span className="la la-video-camera" style={{fontSize: '18px', color: '#5f6368'}} />
            </button>
            <button className="btn btn-light" type="button" style={{borderRadius: '50%', width: '40px', height: '40px', padding: '0', border: 'none', background: '#f1f3f4', marginLeft: '8px', transition: 'all 0.2s ease'}} onMouseOver={(e) => e.currentTarget.style.background = '#e8eaed'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f3f4'}>
              <span className="la la-info-circle" style={{fontSize: '18px', color: '#5f6368'}} />
            </button>
          </div>
        </div>
        <div className="ks-body ks-scrollable jspScrollable" data-auto-height data-reduce-height=".ks-footer" data-fix-height={32} style={{height: '480px', overflow: 'hidden', padding: '0px', width: '701px'}} tabIndex={0}>
          <div  className="jspContainer" style={{width: '701px', height: '481px'}}>
            <div  className="jspPane" style={{padding: '0px', top: '0px', width: '691px'}}>
              <ul id="box-chat" className="ks-items" style={{overflowY:'scroll',maxHeight:'479px'}}>
                {mess && mess.length > 0 &&
                 mess.map((item, index) => {
                   if (!item.userData) {
                     return null;
                   }

                   return (
                     <li key={index} className={item.userData.id === user.id ? "ks-item ks-from" : "ks-item ks-self"}>
                       <span className="ks-avatar ks-offline">
                         <img src={item.userData.image} width={36} height={36} className="rounded-circle" alt="User avatar" style={{border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', objectFit: 'cover'}} />
                       </span>
                       <div className="ks-body">
                         <div className="ks-header">
                           <span className="ks-name">{item.userData.firstName+" "+item.userData.lastName}</span>
                           <span className="ks-datetime">{moment(item.createdAt).fromNow()}</span>
                         </div>
                         <div className="ks-message">{item.text}</div>
                       </div>
                     </li>
                   );
                 })
                }
               
                
               
              
              
              </ul>
            </div>
            <div className="jspVerticalBar">
              <div className="jspCap jspCapTop" />
              <div className="jspTrack" style={{height: '481px'}}>
                <div className="jspDrag" style={{height: '206px'}}>
                  <div className="jspDragTop" />
                  <div className="jspDragBottom" />
                </div>
              </div>
              <div className="jspCap jspCapBottom" />
            </div>
          </div>
        </div>
        <div className="ks-footer">
          <textarea onChange={(e) => setMessage(e.target.value)} value={message} className="form-control" placeholder="Type something..." defaultValue={""} />
          <div className="ks-controls">
            <button onClick={() => sendMessage()} className="btn btn-primary">Send</button>
          
            
          </div>
        </div>
      </div>

    );
}

export default ChatWindow;