import { useRef, useState, useContext } from 'react';
import fetchRequest from '../fetchRequest';
import { useNavigate } from 'react-router-dom';
import mainContext from '../context/mainContext';

const RegisterPage = () => {
  const { state, setState } = useContext(mainContext);
  const userRef = useRef(null);
  const passOneRef = useRef(null);
  const passTwoRef = useRef(null);
  const genderRef = useRef(null);
  const ageRef = useRef(null);
  const cityRef = useRef(null);

  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const validateUsername = (username) => {
    return String(username).match(/(.*[A-Z].*)/);
  };

  const validPasswordFormat = (password) => {
    return String(password).match(
      /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^&*_+]).{4,20}$/
    );
  };

  const isEmpty = (value) => {
    return value.trim().length === 0;
  };

  function registerUser() {
    let invalid = false;

    const user = {
      username: userRef.current.value,
      passOne: passOneRef.current.value,
      passTwo: passTwoRef.current.value,
      gender: genderRef.current.value,
      age: ageRef.current.value,
      city: cityRef.current.value,
    };

    if (isEmpty(user.city)) invalid = 'Invalid city value';
    if (user.age <= 0 || isEmpty(user.age)) invalid = 'Invalid age';
    if (user.passOne !== user.passTwo) invalid = 'Passwords do not match';
    if (!validPasswordFormat(user.passOne))
      invalid = 'Incorrect password format';
    if (!validateUsername(user.username))
      invalid = 'Incorrect user name format';

    if (invalid) {
      return setError(invalid);
    }

    fetchRequest('/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const newUsers = [...state.users];
          newUsers.push(data.user);
          setState({ ...state, users: newUsers });
          navigate('/');
        } else {
          setError(data.error);
        }
      });
  }

  return (
    <div className="d-flex flex-column">
      {error && <h3 className="text-red">{error}</h3>}
      <p>Username:</p>
      <input ref={userRef} type="text" placeholder="Username" />
      <p>Password:</p>
      <input ref={passOneRef} type="password" placeholder="Password" />
      <input ref={passTwoRef} type="password" placeholder="Repeat password" />
      <p>Gender:</p>
      <select ref={genderRef}>
        <option>Male</option>
        <option>Female</option>
      </select>
      <p>Age:</p>
      <input ref={ageRef} type="number" placeholder="Your age" />
      <p>City:</p>
      <input ref={cityRef} type="text" placeholder="Your city" />
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default RegisterPage;
