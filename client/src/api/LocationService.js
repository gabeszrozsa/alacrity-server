import Http from '../services/HttpService';

const BASE_URL = 'http://localhost:5000/api/location';

class LocationService {
  addNewLocation(data) {
    return Http.post(BASE_URL, data)
    .then(res => res)
    .catch(error => console.error('LocationService -> addNewLocation:', error));
  }

  getAllLocations() {
    return Http.get(BASE_URL)
    .then(res => res)
    .catch(error => console.error('LocationService -> getAllLocations:', error));
  }

  getLocation(id) {
    return Http.get(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('LocationService -> getAllLocation:', error));
  }

  deleteLocation(id) {
    return Http.delete(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('LocationService -> deleteLocation:', error));
  }

  updateLocation(id, data) {
    return Http.patch(`${BASE_URL}/${id}`, data)
    .then(res => res)
    .catch(error => console.error('LocationService -> updateLocation:', error));
  }
}

const instance = new LocationService();
export default instance;
