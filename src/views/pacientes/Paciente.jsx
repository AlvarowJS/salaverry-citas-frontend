import React, { useEffect, useState } from 'react'
import TablaPaciente from './TablaPaciente'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import bdCitas from '../../api/bdCitas'
import { useForm } from 'react-hook-form'
import FormPaciente from './FormPaciente'

const Paciente = () => {

  const token = localStorage.getItem('token')
  const [data, setData] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0)
  const [search, setSearch] = useState()
  const [filter, setFilter] = useState()
  const [modal, setModal] = useState(false)
  const { handleSubmit, register, reset } = useForm()
  const defaulValuesForm = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
    status: '',
  }

  const toggle = () => {
    setModal(!modal)
  }
  useEffect(() => {
    bdCitas.get(`/v1/pacientes?page=${currentPage}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then(res => {
        setData(res.data.data)
        setTotalRows(res.data.total)
      })
      .catch(err => {

      })
  }, [currentPage, perPage])

  const handleFilter = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setFilter(data?.filter(e =>
      (e.nombre && e.apellido_paterno &&
        (e.nombre.toLowerCase() + ' ' + e.apellido_paterno.toLowerCase()).indexOf(search?.toLowerCase()) !== -1) ||
      (e.nombre && e.nombre.toLowerCase().indexOf(search?.toLowerCase()) !== -1) ||
      (e.apellido_paterno && e.apellido_paterno.toLowerCase().indexOf(search?.toLowerCase()) !== -1)
    ))
  }, [search])

  // Crear Paciente
  const crearPaciente = () => {

  }

  const submit = (data) => {

  }

  return (
    <>
      <Row>
        <Col sm='6'>
          <Label className='me-1' for='search-input'>
            Buscar
          </Label>
          <Input
            className='dataTable-filter'
            type='text'
            bsSize='sm'
            id='search-input'
            placeholder='buscar por nombre y apellidos'
            onChange={handleFilter}
          />
        </Col>
        <Col sm='4'></Col>
        <Col sm='2' className='mt-2'>

          <Button onClick={toggle}>
            + Agregar
          </Button>
        </Col>
      </Row>
      <TablaPaciente
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        data={data}
        setPerPage={setPerPage}
        perPage={perPage}
        totalRows={totalRows}
        filter={filter}
        search={search}        
      />
      <FormPaciente
        toggle={toggle}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
      />
    </>
  )
}

export default Paciente