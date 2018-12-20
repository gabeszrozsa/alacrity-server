import Http from '../services/HttpService';

const BASE_URL = 'http://localhost:5000/api/activity';

class ActivityService {
  addNewActivity(data) {
    return Http.post(BASE_URL, data)
    .then(res => res)
    .catch(error => console.error('ActivityService -> addNewActivity:', error));
  }

  getAllActivities() {
    return Http.get(BASE_URL)
    .then(res => res)
    .catch(error => console.error('ActivityService -> getAllActivities:', error));
  }

  getMyActivities() {
    return Http.get(`${BASE_URL}/my`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> getMyActivities:', error));
  }

  getActivity(id) {
    return Http.get(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> getAllActivity:', error));
  }

  deleteActivity(id) {
    return Http.delete(`${BASE_URL}/${id}`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> deleteActivity:', error));
  }

  updateActivity(id, data) {
    return Http.patch(`${BASE_URL}/${id}`, data)
    .then(res => res)
    .catch(error => console.error('ActivityService -> updateActivity:', error));
  }

  getComments(id) {
    return Http.get(`${BASE_URL}/${id}/comment`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> getComments:', error));
  }

  deleteComment(id, commentId) {
    return Http.delete(`${BASE_URL}/${id}/comment/${commentId}`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> deleteComment:', error));
  }

  addNewComment(id, data) {
    return Http.post(`${BASE_URL}/${id}/comment`, data)
    .then(res => res)
    .catch(error => console.error('ActivityService -> addNewComment:', error));
  }

  getLikes(id) {
    return Http.get(`${BASE_URL}/${id}/like`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> getLikes:', error));
  }

  deleteLike(id, likeId) {
    return Http.delete(`${BASE_URL}/${id}/like/${likeId}`)
    .then(res => res)
    .catch(error => console.error('ActivityService -> deleteLike:', error));
  }

  addLike(id) {
    return Http.post(`${BASE_URL}/${id}/like`, {})
    .then(res => res)
    .catch(error => console.error('ActivityService -> addLike:', error));
  }
}

const instance = new ActivityService();
export default instance;
