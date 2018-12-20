class LocalStorageService {
  storeToken(token) {
    localStorage.setItem('alacrity-token', token);
  }

  getToken() {
    return localStorage.getItem('alacrity-token');
  }

  clear() {
    localStorage.clear();
  }
}

const instance = new LocalStorageService();
export default instance;
