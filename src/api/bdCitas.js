import axios from 'axios'

const bdCitas = axios.create({
    baseURL: 'https://backend.tms2.nuvola7.com.mx/api'
    // baseURL: 'http://127.0.0.1:8000/api'
})

export default bdCitas