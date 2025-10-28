import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('API URL configured as:', API_URL)

class API {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        console.log('Making API request to:', config.baseURL + config.url)
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log('API response received:', response.status)
        return response.data
      },
      (error) => {
        console.error('API Error Details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        })
        
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new Error('Request timeout. Please check your connection.'))
        }
        
        if (!error.response) {
          return Promise.reject(new Error('Network error. Unable to reach server.'))
        }
        
        const message = error.response?.data?.message || error.message || 'An error occurred'
        return Promise.reject(error)
      }
    )
  }

  getToken() {
    return localStorage.getItem('tradexpert_token')
  }

  setToken(token) {
    localStorage.setItem('tradexpert_token', token)
  }

  removeToken() {
    localStorage.removeItem('tradexpert_token')
  }

  // Auth endpoints
  async signup(name, email, password) {
    const data = await this.client.post('/auth/signup', { name, email, password })
    // Don't set token on signup - need OTP verification first
    return data
  }

  async verifyOTP(email, otp) {
    const data = await this.client.post('/auth/verify-otp', { email, otp })
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  async resendOTP(email) {
    return this.client.post('/auth/resend-otp', { email })
  }

  async login(email, password) {
    const data = await this.client.post('/auth/login', { email, password })
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  async getMe() {
    return this.client.get('/auth/me')
  }

  logout() {
    this.removeToken()
  }

  // Products endpoints
  async getProducts() {
    return this.client.get('/products')
  }

  async getProductById(id) {
    return this.client.get(`/products/${id}`)
  }

  async createProduct(productData) {
    return this.client.post('/products', productData)
  }

  async updateProduct(id, productData) {
    return this.client.put(`/products/${id}`, productData)
  }

  async deleteProduct(id) {
    return this.client.delete(`/products/${id}`)
  }

  // Orders endpoints
  async getOrders() {
    return this.client.get('/orders')
  }

  async getOrderById(id) {
    return this.client.get(`/orders/${id}`)
  }

  async createOrder(orderData) {
    return this.client.post('/orders', orderData)
  }

  async updateOrder(id, orderData) {
    return this.client.put(`/orders/${id}`, orderData)
  }

  async deleteOrder(id) {
    return this.client.delete(`/orders/${id}`)
  }
}

export default new API()
