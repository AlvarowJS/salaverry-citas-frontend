import axios from 'axios'

const bdCitas = axios.create({
    // baseURL: 'https://backend.tms2.nuvola7.com.mx/api'
    baseURL: 'https://backend.tms2.nuvola7.com.mx/api'
})

export default bdCitas