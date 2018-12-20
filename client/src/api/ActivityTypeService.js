import Http from '../services/HttpService';

const BASE_URL = 'http://localhost:5000/api/activity-type';

class ActivityTypeService {
  addNewActivityType(data) {
    return Http.post(BASE_URL, data)
    .then(res => res)
    .catch(error => console.error('ActivityTypeService -> addNewActivityType:', error));
  }

  getAllActivityTypes() {
    return Http.get(BASE_URL)
    .then(res => res)
    .catch(error => console.error('ActivityTypeService -> getAllActivityTypes:', error));
  }

  getActivityType(id) {
    return Http.get(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('ActivityTypeService -> getAllActivityType:', error));
  }

  deleteActivityType(id) {
    return Http.delete(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('ActivityTypeService -> deleteActivityType:', error));
  }

  updateActivityType(id, data) {
    return Http.patch(`${BASE_URL}/${id}`, data)
    .then(res => res)
    .catch(error => console.error('ActivityTypeService -> updateActivityType:', error));
  }
}

const instance = new ActivityTypeService();
export default instance;
