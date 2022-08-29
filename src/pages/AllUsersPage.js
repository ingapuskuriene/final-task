import { useContext, useState, useEffect } from 'react';
import mainContext from '../context/mainContext';
import Photos from '../components/Photos';
import fetchRequest from '../fetchRequest';

const AllUsersPage = () => {
  const { state, setState } = useContext(mainContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    const filteredUsersArray = state.users
      .filter((user) => user.userId !== state.currentUser.userId)
      .filter((user) => {
        if (!state.filter.city) {
          return true;
        } else {
          return user.city === state.filter.city;
        }
      })
      .filter((user) => {
        if (!state.filter.age) {
          return true;
        } else {
          return user.age === state.filter.age;
        }
      })
      .filter((user) => {
        if (!state.filter.gender) {
          return true;
        } else {
          return user.gender === state.filter.gender;
        }
      })
      .filter((user) => {
        if (!state.filter.liked_by_me) {
          return true;
        } else {
          return state.currentUser.liked_profiles.includes(user.userId);
        }
      })
      .filter((user) => {
        if (!state.filter.who_liked_me) {
          return true;
        } else {
          return user.liked_profiles.includes(state.currentUser.userId);
        }
      });
    setFilteredUsers(filteredUsersArray);
  }, [state]);

  const changeLikeStatus = ({ id }) => {
    // ID of the liked one?
    let likedProfiles = [];
    let newUsers = [...state.users];
    let shouldNotify = false;
    if (state.currentUser.liked_profiles.includes(id)) {
      likedProfiles = [...state.currentUser.liked_profiles].filter(
        (userId) => userId !== id
      );
    } else {
      shouldNotify = true;
      newUsers = [...state.users].map((user) => {
        if (user.userId === state.currentUser.userId) {
          user.liked_profiles.push(id);
        }
        return user;
      });
      likedProfiles = [...state.currentUser.liked_profiles];
      likedProfiles.push(id);
    }

    fetchRequest('/update-likes', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        userId: state.currentUser.userId,
        single_profile: id,
        liked_profiles: [...new Set(likedProfiles)],
        shouldNotify,
        users: newUsers,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setState({
            ...state,
            currentUser: {
              ...state.currentUser,
              liked_profiles: [...new Set(likedProfiles)],
            },
            users: newUsers,
          });
          // send the liked one a notification
        } else {
          alert(res.error);
        }
      });
  };

  const filterLikedByMe = () => {
    setState({
      ...state,
      filter: { ...state.filter, who_liked_me: false, liked_by_me: true },
    });
  };
  const filterWhoLikedMe = () => {
    setState({
      ...state,
      filter: { ...state.filter, liked_by_me: false, who_liked_me: true },
    });
  };

  const resetLikeFilter = () => {
    setState({
      ...state,
      filter: { ...state.filter, liked_by_me: false, who_liked_me: false },
    });
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex space-btw">
        <h1>All users</h1>
        <div>
          <button
            disabled={state.filter.liked_by_me && !state.filter.who_liked_me}
            onClick={filterLikedByMe}
            className="mr-10"
          >
            People I liked
          </button>
          <button
            disabled={!state.filter.liked_by_me && state.filter.who_liked_me}
            className="mr-10"
            onClick={filterWhoLikedMe}
          >
            People who liked me
          </button>
          <button
            disabled={!state.filter.liked_by_me && !state.filter.who_liked_me}
            onClick={resetLikeFilter}
          >
            Show All
          </button>
        </div>
      </div>
      <hr className="mb-10 full-width" />
      <div className="d-flex flex-wrap">
        {filteredUsers.length === 0 ? (
          <div>No users, change filter</div>
        ) : (
          filteredUsers.map((user) => {
            const profileLiked = state.currentUser.liked_profiles.includes(
              user.userId
            );
            return (
              <div
                key={user.userId}
                className="d-flex justify-center text-center column flex-column mb-10"
              >
                <div className="d-flex align-center justify-center text-red">
                  <h1>{user.username}</h1>
                  {profileLiked && (
                    <img
                      className="ml-10"
                      src="/like.svg"
                      height={25}
                      width={25}
                      alt="Like"
                    />
                  )}
                </div>
                <Photos photos={user.photos} />
                <div className="d-flex justify-center p-10">
                  <button
                    key={user.userId}
                    onClick={() => changeLikeStatus({ id: user.userId })}
                    className="mb-10"
                  >
                    {profileLiked ? 'DISLIKE' : 'LIKE'}
                  </button>
                </div>
                <hr className="mb-10 full-width" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
