import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class API {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 90000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new Error('Request timeout. Please check your connection.'));
        }
        if (!error.response) {
          return Promise.reject(new Error('Network error. Unable to reach server.'));
        }
        const message = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(message));
      }
    );
  }

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('tradexpert_token');
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradexpert_token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tradexpert_token');
    }
  }

  // Auth endpoints
  async signup(name, email, password) {
    return this.client.post('/auth/signup', { name, email, password });
  }

  async verifyOTP(email, otp) {
    const data = await this.client.post('/auth/verify-otp', { email, otp });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async resendOTP(email) {
    return this.client.post('/auth/resend-otp', { email });
  }

  async login(email, password) {
    const data = await this.client.post('/auth/login', { email, password });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async demoLogin() {
    const data = await this.client.post('/auth/demo-login');
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getMe() {
    return this.client.get('/auth/me');
  }

  logout() {
    this.removeToken();
  }

  // Trading endpoints
  async getPortfolio() {
    return this.client.get('/trading/portfolio');
  }

  async placeOrder(orderData) {
    return this.client.post('/trading/place-order', orderData);
  }

  async getTradingOrders(limit = 50, page = 1) {
    return this.client.get(`/trading/orders?limit=${limit}&page=${page}`);
  }

  async getPositions() {
    return this.client.get('/trading/positions');
  }

  async depositFunds(amount = 50000) {
    return this.client.post('/trading/portfolio/deposit', { amount });
  }

  async closePosition(symbol, currentPrice) {
    return this.client.post('/trading/positions/close', { symbol, currentPrice });
  }

  // Products & Orders endpoints
  async getProducts() {
    return this.client.get('/products');
  }

  async getOrders() {
    return this.client.get('/orders');
  }
}

const apiInstance = new API();
export default apiInstance;
