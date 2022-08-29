import { useRef, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';
import fetchRequest from '../fetchRequest';

import socketIOClient from 'socket.io-client';

const SingleUserPage = () => {
  const socket = socketIOClient('http://localhost:4000');
  const { state, setState } = useContext(mainContext);
  const [message, setMessage] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [userPhotos, setUserPhotos] = useState([]);
  const photoRef = useRef(null);

  const { id } = useParams();

  const [user] = state.users.filter((user) => user.id === id);

  const { userId, username, photos = [] } = state.currentUser;
  const isMyPage = user && user.userId === userId; // read all users first

  const validUrlFormat = (url) => {
    return url.match(/^(http|https):\/\/[^ "]+$/);
  };

  useEffect(() => {
    setUserPhotos(photos);
  }, [photos]);

  const [photoIndex, setPhotoIndex] = useState(0);

  const addPhoto = () => {
    const photoUrl = photoRef.current.value;
    if (!validUrlFormat(photoUrl)) {
      return setPhotoError('Invalid image URL');
    }
    const newPhotos = [photoUrl, ...userPhotos];

    fetchRequest('/add-photo', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userId, photos: newPhotos }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserPhotos(newPhotos);
          const [thisUser] = state.users.filter(
            (user) => user.userId === userId
          );
          thisUser.photos = newPhotos;
          setState({
            ...state,
            users: [...state.users, thisUser],
            currentUser: thisUser,
          });
          setPhotoIndex(0);
          photoRef.current.value = '';
        } else {
          return setPhotoError(res.error);
        }
      });
  };

  function changeIndex(value) {
    if (value === 'add') {
      if (photoIndex >= userPhotos.length - 1) {
        setPhotoIndex(0);
      } else {
        setPhotoIndex(photoIndex + 1);
      }
    }

    if (value === 'remove') {
      if (photoIndex === 0) {
        setPhotoIndex(userPhotos.length - 1);
      } else {
        setPhotoIndex(photoIndex - 1);
      }
    }
  }

  return (
    <div>
      {message && (
        <div className="full-width p-10 items-list mb-10">
          <strong>{message}</strong>
        </div>
      )}
      <div>
        <h1>Profile of {username}</h1>
      </div>
      <hr className="mb-10" />

      <div className="d-flex align-center full-width justify-center">
        <div>
          <button
            onClick={() => changeIndex('remove')}
            className="arrow-button"
          >
            ◄
          </button>
        </div>
        <div className="d-flex p-10 justify-center photo-square mb-10">
          <img
            height={250}
            src={
              userPhotos.length === 0
                ? '/profile_picture.png'
                : userPhotos[photoIndex]
            }
            alt="profile"
          />
        </div>
        <div>
          <button onClick={() => changeIndex('add')} className="arrow-button">
            ►
          </button>
        </div>
      </div>
      <div>
        <h1>Add a photo</h1>
      </div>
      <hr className="mb-10" />
      <div className="d-flex flex-column">
        {photoError && <h3 className="text-red mb-10">{photoError}</h3>}
        <div className="mr-10">
          <input
            ref={photoRef}
            type="text"
            placeholder="Photo URL"
            className="mr-10"
          />
          <button onClick={addPhoto}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
