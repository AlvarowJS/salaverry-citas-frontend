import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import bdCitas from '../../api/bdCitas'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TablaCitas from './TablaCitas'
import TablaMultiusos from './TablaMultiusos'
import { Search } from 'react-feather'
const MySwal = withReactContent(Swal)
const URL = '/v1/citas'
const URLUSO = '/v1/multiusos'
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const Citas = () => {
  const token = localStorage.getItem('token')
  const [handleDate, setHandleDate] = useState([])
  const [dateChange, setDateChange] = useState()
  const [citas, setCitas] = useState()
  const [multiusos, setMultiusos] = useState()
  const [montoTotal, setMontoTotal] = useState()
  const [search, setSearch] = useState()
  const [filterCitas, setFilterCitas] = useState()

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


  const dateNow = () => {

    let fechaActual = new Date();
    let year = fechaActual.getFullYear()
    let month = meses[fechaActual.getMonth()];
    let monthActual = fechaActual.getMonth();
    let day = fechaActual.getDate()
    let dayWeek = diasSemana[fechaActual.getDay()]
    let fechaFormateada = `${dayWeek} ${day} ${month} ${year}`
    let fechaIndex = `${year}-${monthActual + 1}-${day}`
    return [fechaFormateada, fechaIndex]
  }

  const cambiarFecha = (e) => {
    setDateChange(e.target.value)
    let fechaActual = e.target.value
    fechaActual = new Date(fechaActual)
    let year = fechaActual.getFullYear()
    let month = meses[fechaActual.getMonth()];
    let day = fechaActual.getDate()
    let dayWeek = diasSemana[fechaActual.getDay()]
    let fechaFormateada = `${dayWeek} ${day + 1} ${month} ${year}`
    setHandleDate(fechaFormateada)

  }

  useEffect(() => {
    let fechaFormateada = dateNow()
    console.log(fechaFormateada, "???")
    setHandleDate(fechaFormateada[0])
  }, [])

  useEffect(() => {

    let fechaFilter
    if (dateChange) {
      fechaFilter = dateChange
    } else {
      fechaFilter = dateNow()
      fechaFilter = fechaFilter[1]
    }
    // fechaFilter ? fechaFilter = dateChange : fechaFilter = handleDate[1]
    bdCitas.get(`${URL}?date=${fechaFilter}`, getAuthHeaders())
      .then(res => {
        setCitas(res?.data)
        setFilterCitas(res?.data)
      })
      .catch(err => {
      })
  }, [refresh, handleDate, dateChange])


  useEffect(() => {

    let fechaFilter
    if (dateChange) {
      fechaFilter = dateChange
    } else {
      fechaFilter = dateNow()
      fechaFilter = fechaFilter[1]
    }
    // fechaFilter ? fechaFilter = dateChange : fechaFilter = handleDate[1]
    bdCitas.get(`${URLUSO}?date=${fechaFilter}`, getAuthHeaders())
      .then(res => {
        setMultiusos(res?.data)
      })
      .catch(err => {
      })
  }, [refresh, handleDate, dateChange])



  const buscarNombre = (e) => {
    let nombreMedicos = e.target.value;
    let citaBusqueda = citas.filter(cita =>
      cita.nombre.toLowerCase().includes(nombreMedicos.toLowerCase())
    )
    setFilterCitas(citaBusqueda)
  };



  return (
    <>
      <Row>
        <Col sm="3">
          <h2>{handleDate}</h2>

        </Col>
        <Col sm="3">
        </Col>
        <Col sm="3">

          <input type="text"
            className='form-control'
            placeholder='Buscar por nombre'
            onChange={buscarNombre}
          />

        </Col>
        <Col sm="3">
          <input type="date"
            className='form-control'
            onChange={cambiarFecha}
          />
        </Col>
      </Row>
      {
        multiusos?.map(multiuso => (
          <TablaMultiusos
            key={multiuso.id}
            multiuso={multiuso}
            dateChange={dateChange}
            handleDate={handleDate}
            montoTotal={montoTotal}
            refresh={refresh}
            setRefresh={setRefresh}

            URL={URLUSO}
            getAuthHeaders={getAuthHeaders}
          />
        ))
      }
      {
        filterCitas ?
          filterCitas?.map(filterCita => (
            <TablaCitas
              key={filterCita.id}
              cita={filterCita}
              dateChange={dateChange}
              handleDate={handleDate}
              montoTotal={montoTotal}
              refresh={refresh}
              setRefresh={setRefresh}

              URL={URL}
              getAuthHeaders={getAuthHeaders}
            />
          ))
          :
          citas?.map(cita => (
            <TablaCitas
              key={cita.id}
              cita={cita}
              dateChange={dateChange}
              handleDate={handleDate}
              montoTotal={montoTotal}
              refresh={refresh}
              setRefresh={setRefresh}

              URL={URL}
              getAuthHeaders={getAuthHeaders}
            />
          ))
      }

    </>
  )
}

export default Citas