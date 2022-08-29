import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';

const Photos = ({ photos }) => {
  const { state, setState } = useContext(mainContext);
  const navigate = useNavigate();
  const { currentUser } = state;

  const [photoIndex, setPhotoIndex] = useState(0);

  function changeIndex(value) {
    if (value === 'add') {
      if (photoIndex >= photos.length - 1) {
        setPhotoIndex(0);
      } else {
        setPhotoIndex(photoIndex + 1);
      }
    }

    if (value === 'remove') {
      if (photoIndex === 0) {
        setPhotoIndex(photos.length - 1);
      } else {
        setPhotoIndex(photoIndex - 1);
      }
    }
  }
  return (
    <div className="d-flex align-center full-width justify-center">
      <div>
        <button onClick={() => changeIndex('remove')} className="arrow-button">
          ◄
        </button>
      </div>
      <div className="d-flex p-10 justify-center photo-square mb-10">
        <img
          src={
            photos.length === 0 ? '/profile_picture.png' : photos[photoIndex]
          }
          alt="profile"
          height={250}
          className="profile-photo "
        />
      </div>
      <div>
        <button onClick={() => changeIndex('add')} className="arrow-button">
          ►
        </button>
      </div>
    </div>
  );
};

export default Photos;
