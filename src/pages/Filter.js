import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import mainContext from '../context/mainContext';

const Filter = () => {
  const navigate = useNavigate();
  const { state, setState } = useContext(mainContext);

  const cityRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);

  const cities = [...new Set(state.users.map((user) => user.city))];
  const ages = [...new Set(state.users.map((user) => user.age).sort())];
  const genders = [...new Set(state.users.map((user) => user.gender))];

  const [ageValue, setAgeValue] = useState(state.filter.age);

  const resetFilter = () => {
    setState({
      ...state,
      filter: {},
    });
    setAgeValue(0);
    navigate('/all-users');
  };
  const saveFilter = () => {
    setState({
      ...state,
      filter: {
        city: cityRef.current.value,
        age: ageValue,
        gender: genderRef.current.value,
      },
    });
    navigate('/all-users');
  };

  const changeCity = (e) => {
    setState({ ...state, filter: { ...state.filter, city: e.target.value } });
  };

  const changeGender = (e) => {
    setState({ ...state, filter: { ...state.filter, gender: e.target.value } });
  };

  return (
    <div>
      <h1>Filter</h1>

      {(state.filter.age || state.filter.gender || state.filter.city) && (
        <div>
          <hr className="mb-10 full-width" />
          <p>Current filter: </p>
          <ul>
            <li>City: {!state.filter.city ? 'all' : state.filter.city}</li>
            <li>
              Gender: {!state.filter.gender ? 'all' : state.filter.gender}
            </li>
            <li>Age: {state.filter.age === 0 ? 'all' : state.filter.age}</li>
          </ul>
        </div>
      )}
      <hr className="mb-10 full-width" />
      <div className="d-flex flex-column">
        <p>City:</p>
        <select ref={cityRef} value={state.filter.city} onChange={changeCity}>
          <option></option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <p>Gender:</p>
        <select
          ref={genderRef}
          value={state.filter.gender}
          onChange={changeGender}
        >
          <option></option>
          {genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        <p>Age: {ageValue} (0 for all)</p>
        <div>
          <input
            type="range"
            min={0}
            max={ages[ages.length - 1]}
            ref={ageRef}
            className="slider"
            id="age"
            value={ageValue || 0}
            onChange={() => setAgeValue(ageRef.current.value)}
          />
        </div>
        <div className="d-flex">
          <button onClick={saveFilter} className="mr-10">
            Save
          </button>
          <button onClick={resetFilter}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
