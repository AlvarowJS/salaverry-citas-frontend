import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import bdCitas from '../../api/bdCitas'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TablaCitas from './TablaCitas'
const MySwal = withReactContent(Swal)
const URL = '/v1/citas'

const Citas = () => {
  const token = localStorage.getItem('token')
  const [handleDate, setHandleDate] = useState()
  const [citas, setCitas] = useState()
  const [search, setSearch] = useState()
  const [filter, setFilter] = useState()
  const [modal, setModal] = useState(false)
  const [modalUbicacion, setModalUbicacion] = useState(false)
  const [actualizacion, setActualizacion] = useState(false)
  const { handleSubmit, register, reset } = useForm()
  const [refresh, setRefresh] = useState(false)
  const defaulValuesForm = {
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    status: '',
  }
  const getAuthHeaders = () => ({
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  const toggle = () => {
    setActualizacion(false)
    reset(defaulValuesForm)
    setModal(!modal)
  }

  const toggleActualizacion = () => {
    setModal(!modal)
  }

  const dateNow = () => {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let fechaActual = new Date();
    let year = fechaActual.getFullYear()
    let month = meses[fechaActual.getMonth()];
    let monthActual = fechaActual.getMonth();
    let day = fechaActual.getDate()
    let dayWeek = diasSemana[fechaActual.getDay()]
    let fechaFormateada = `${dayWeek} ${day} ${month} ${year}`
    let fechaIndex = `${year}-${monthActual+1}-${day}`
    return [fechaFormateada, fechaIndex]
  }

  useEffect(() => {
    let fechaFormateada = dateNow()    
    setHandleDate(fechaFormateada)
  }, [])

  useEffect(() => {
    
    bdCitas.get(`${URL}?date=${handleDate[1]}`, getAuthHeaders())
      .then(res => {
        setCitas(res?.data)
        console.log(res?.data)
      })
      .catch(err => {

      })
  }, [refresh, handleDate])
  const handleFilter = (e) => {
    setSearch(e.target.value);
  };
  const crearCita = (data) => {
    bdCitas.post(URL, data, getAuthHeaders())
      .then(res => {
        console.log(res.data)
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario creado',
          showConfirmButton: false,
          timer: 1500
        })
      })
      .catch(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Contacte con soporte',
          showConfirmButton: false,
        })
      })
  }

  // Actualiza Consultorio (PUT)
  const actualizarCita = (id, data) => {
    bdCitas.put(`${URL}/${id}`, data, getAuthHeaders())
      .then(res => {
        console.log(res.data)
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario Actualizado',
          showConfirmButton: false,
          timer: 1500
        })
      })
      .catch(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Contacte con soporte',
          showConfirmButton: false,
        })
      })
  }
  const eliminarCita = (id) => {
    return MySwal.fire({
      title: '¿Estás seguro de eliminar?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        bdCitas.delete(`${URL}/${id}`, getAuthHeaders())
          .then(res => {
            setRefresh(!refresh)
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Consultorio Eliminado',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(err => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Contacte con soporte',
              showConfirmButton: false,
            })
          })
      }
    })


  }

  // Tomara los datos que tiene un registro
  const actualizarCitaId = (id) => {
    toggleActualizacion.call()
    setActualizacion(true)
    bdCitas.get(`${URL}/${id}`, getAuthHeaders())
      .then(res => {
        reset(res.data)
      })
      .catch(err => null)
  }

  // Si es actualizacion llamara a actualizarPaciente pero si es false crear un Consultorio
  const submit = (data) => {
    if (actualizacion) {
      actualizarCita(data.id, data)
    } else {
      crearUsuario(data)
    }
  }
  return (
    <>
      <h2>{handleDate[0]}</h2>
      {
        citas?.map(cita => (
          <TablaCitas
            key={cita.id}
            cita={[cita]}
            actualizarCitaId={actualizarCitaId}
            eliminarCita={eliminarCita}
          />
        ))
      }

    </>
  )
}

export default Citas