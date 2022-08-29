import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';
import fetchRequest from '../fetchRequest';

const Toolbar = () => {
  const { state, setState } = useContext(mainContext);
  const navigate = useNavigate();
  const { currentUser } = state;

  function logout() {
    fetchRequest('/logout', { method: 'POST', credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          document.cookie =
            'connect.sid=aaa; Max-Age=0;path=/;expires=Thu, 18 Dec 2013 12:00:00 UTC;domain=http://localhost:3000';

          setState({ ...state, currentUser: {}, autoLogin: false });
          navigate('/');
        }
      });
  }

  return (
    <div className="toolbar d-flex space-btw">
      {currentUser?.userId && (
        <div className="d-flex align-center">
          <img
            alt="profile"
            src={
              currentUser?.photos.length === 0
                ? '/profile_picture.png'
                : currentUser?.photos[0]
            }
            height={30}
            className="mr-10"
          />
          <h3>{currentUser?.username}</h3>
        </div>
      )}

      {!currentUser?.userId ? (
        <div>
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      ) : (
        <div>
          <Link to={`/user/${currentUser?.userId}`}>My profile</Link>
          {state.currentUser?.photos?.length >= 2 && (
            <>
              <Link to="/all-users">All users</Link>
              <Link to="/filter">
                Filter
                {(state.filter.age ||
                  state.filter.gender ||
                  state.filter.city) && <span> (ON)</span>}
              </Link>
            </>
          )}
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
