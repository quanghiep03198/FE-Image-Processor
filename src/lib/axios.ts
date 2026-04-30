import axios from 'redaxios'
import env from './utils'

export default axios.create({
  baseURL: env('VITE_API_URL'),
})
