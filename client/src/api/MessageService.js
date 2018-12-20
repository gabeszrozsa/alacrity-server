import Http from '../services/HttpService';

const BASE_URL = 'http://localhost:5000/api/messages';

class MessageService {
  sendMessage(data) {
    return Http.post(BASE_URL, data)
    .then(res => res)
    .catch(error => console.error('MessageService -> sendMessage:', error));
  }

  getMyMessages() {
    return Http.get(BASE_URL)
    .then(res => res)
    .catch(error => console.error('MessageService -> getMyMessages:', error));
  }
}

const instance = new MessageService();
export default instance;
