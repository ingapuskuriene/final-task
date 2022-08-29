import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Toolbar from './components/Toolbar';
import AllUsersPage from './pages/AllUsersPage';
import SingleUserPage from './pages/SingleUserPage';
import Filter from './pages/Filter';

import mainContext from './context/mainContext';
import fetchRequest from './fetchRequest';

function App() {
  let [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(socketIOClient('http://localhost:4000'));
  }, []);

  const [messages, setMessages] = useState([]);
  const [state, setState] = useState({
    users: [],
    filter: {},
    currentUser: {},
    autoLogin: null,
  });
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('message', (message) => {
      const newMessages = messages.filter((msg) => msg._id !== message._id);
      setMessages([...newMessages, message]);
    });

    socket.on('users', (users) => {
      setState({ ...state, users });
    });
  }, [socket, messages]);

  useEffect(() => {
    if (!state.currentUser?.userId && state.autoLogin !== false) {
      fetchRequest('/login', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ stayLoggedIn: state.autoLogin }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && !state.currentUser?.userId) {
            setState({
              ...state,
              currentUser: data,
              autoLogin: data.autoLogin,
            });
          }
        });
    }
    if (state.users.length === 0) {
      fetchRequest('/all-users')
        .then((res) => res.json())
        .then((res) => {
          setState({ ...state, users: res.users });
        });
    }
  }, [state, state.currentUser]);

  const filteredMessages = messages.filter(
    (data) => data.receiver === state.currentUser?.userId
  );

  return (
    <div className="App">
      <mainContext.Provider value={{ state, setState }}>
        <BrowserRouter>
          <Toolbar />
          <div className="mb-10">
            {state.currentUser?.photos?.length < 2 && (
              <div className="d-flex error-box align-center p-10 mb-10">
                <strong>You need more photos to use the app</strong>
              </div>
            )}
            {filteredMessages.length > 0 &&
              filteredMessages.map((data) => {
                const senderName = state.users.find(
                  (user) => user.userId === data.sender
                ).username;
                return (
                  <div className="d-flex alert-box align-center">
                    <div>
                      User&nbsp;<strong>{senderName}</strong>
                      &nbsp;has liked your profile
                    </div>
                  </div>
                );
              })}
            {filteredMessages.length > 0 && (
              <div className="d-flex space-btw">
                <div></div>
                <button onClick={() => setMessages([])}>Clear messages</button>
              </div>
            )}
          </div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {state.currentUser?.userId && (
              <>
                <Route path="/all-users" element={<AllUsersPage />} />
                <Route path="/user/:id" element={<SingleUserPage />} />
                <Route path="/filter" element={<Filter />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </mainContext.Provider>
    </div>
  );
}

export default App;
