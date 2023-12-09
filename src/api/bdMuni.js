import axios from 'axios'

const bdMuni = axios.create({
    // baseURL: 'https://sv-yptplguxwm.cloud.elastika.pe/api'
    baseURL: 'http://127.0.0.1:8000/api'
})

export default bdMuni