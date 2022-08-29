const API_URL = 'http://localhost:4000';

function fetchRequest(location, options) {
  return fetch(`${API_URL}${location}`, options);
}

export default fetchRequest;
