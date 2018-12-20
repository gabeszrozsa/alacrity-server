import Http from '../services/HttpService';

const BASE_URL = 'http://localhost:5000/api/event';

class EventService {
  addNewEvent(data) {
    return Http.post(BASE_URL, data)
    .then(res => res)
    .catch(error => console.error('EventService -> addNewEvent:', error));
  }

  getAllEvents() {
    return Http.get(BASE_URL)
    .then(res => res)
    .catch(error => console.error('EventService -> getAllEvents:', error));
  }

  getRecentEvents() {
    return Http.get(`${BASE_URL}/recent`)
    .then(res => res)
    .catch(error => console.error('EventService -> getRecentEvents:', error));
  }

  getEvent(id) {
    return Http.get(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('EventService -> getAllEvent:', error));
  }

  deleteEvent(id) {
    return Http.delete(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('EventService -> deleteEvent:', error));
  }

  updateEvent(id, data) {
    return Http.patch(`${BASE_URL}/${id}`, data)
    .then(res => res)
    .catch(error => console.error('EventService -> updateEvent:', error));
  }

  inviteUsers(id, data) {
    return Http.post(`${BASE_URL}/${id}/invite`, data)
    .then(res => res)
    .catch(error => console.error('EventService -> inviteUsers:', error));
  }

  getAttendees(id) {
    return Http.get(`${BASE_URL}/${id}/attendees`)
    .then(res => res)
    .catch(error => console.error('EventService -> getAttendees:', error));
  }

  cancelEvent(id, data) {
    return Http.post(`${BASE_URL}/${id}/cancel`, data)
    .then(res => res)
    .catch(error => console.error('EventService -> inviteUsers:', error));
  }
}

const instance = new EventService();
export default instance;
