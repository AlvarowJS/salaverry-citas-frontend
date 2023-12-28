import React, { useEffect, useState } from 'react'
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import bdCitas from '../../api/bdCitas'
import Select from 'react-select'


const FormCita = ({
  modal, toggle, handleSubmit, register, submit,
  toggleActualizacion, getAuthHeaders,
  paciente, setPaciente
}) => {
  // const [options, setOptions] = useState()
  const [pacientes, setPacientes] = useState()
  const [tipoPagos, setTipoPagos] = useState()
  const [consultorios, setConsultorios] = useState()

  useEffect(() => {
    bdCitas.get(`/v1/pacientes`, getAuthHeaders())
      .then(res => {
        setPacientes(res.data.data)
        console.log(res.data.data)

      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    bdCitas.get(`/v1/consultorio`, getAuthHeaders())
      .then(res => {
        setConsultorios(res.data)

      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    bdCitas.get(`/v1/pagos`, getAuthHeaders())
      .then(res => {
        setTipoPagos(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  const handleChangePaciente = (selected) => {
    setPaciente(selected);
  };


  const optionsPacientes = pacientes?.map(optionPaciente => ({
    value: optionPaciente?.id,
    label: optionPaciente?.nombre + " " + optionPaciente?.apellido_paterno + " " + optionPaciente?.apellido_materno
  }));

  return (
    <>
      <Modal isOpen={modal} toggle={toggle} size='lg'>
        <ModalHeader>
          Registrar Cita
        </ModalHeader>
        <ModalBody style={{ paddingInline: 100 }}>
          <form onSubmit={handleSubmit(submit)}>
            <Row>
              <Col>
                <div className='form-group my-2'>
                  <label htmlFor="paciente">
                    Paciente
                  </label>
                  <Select
                    id="paciente"
                    value={paciente}
                    onChange={handleChangePaciente}
                    options={optionsPacientes}
                    isSearchable={true}
                    placeholder="No especifica"
                  />
                </div>
              </Col>
              <Col>
                <div className='form-group my-2'>
                  <label htmlFor="pago_tipo_id">
                    Consultorio
                  </label>
                  <select
                    className="form-select"
                    id="consultorio_id"
                    {...register("consultorio_id")}
                  >
                    {consultorios?.map((consultorio) => (
                      <option key={consultorio.id} value={consultorio.id}>
                        {consultorio.numero_consultorio} - {consultorio?.ubicacion?.nombre_ubicacion}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='form-group my-2'>
                  <label htmlFor="fecha">
                    Prox. cita
                  </label>
                  <input type="date"
                    className='form-control'
                    id='fecha'
                    {...register("fecha")}
                  />
                </div>
              </Col>
              <Col>
                <div className='form-group my-2'>
                  <label htmlFor="hora">
                    Hora
                  </label>
                  <input type="time"
                    className='form-control'
                    id='hora'
                    {...register("hora")}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className='form-group my-2'>
                  <label htmlFor="pago">
                    Pago
                  </label>
                  <input type="text"
                    className='form-control'
                    id='pago'
                    {...register("pago")}
                  />
                </div>
              </Col>
              <Col>
                <div className='form-group my-2'>
                  <label htmlFor="pago_tipo_id">
                    Tipo de Pago
                  </label>
                  <select
                    className="form-select"
                    id="pago_tipo_id"
                    {...register("pago_tipo_id")}
                  >
                    {tipoPagos?.map((tipoPago) => (
                      <option key={tipoPago.id} value={tipoPago.id}>
                        {tipoPago.tipoPago}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 50 }}>
              <div>
                <label htmlFor="confirmar">Confirmar</label>
                <div class="form-check form-switch">
                  <input class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="confirmar"
                    {...register("confirmar")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="llego">Llego</label>
                <div class="form-check form-switch">
                  <input class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="llego"
                    {...register("llego")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="entro">Entro</label>
                <div class="form-check form-switch">
                  <input class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="entro"
                    {...register("entro")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="silla">Silla</label>
                <div class="form-check form-switch">
                  <input class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="silla"
                    {...register("silla")}
                  />
                </div>
              </div>

            </div>

            <div className='form-group my-2'>
              <label htmlFor="observacion">
                Observación
              </label>
              <textarea
                className='form-control'
                id='observacion'
                {...register("observacion")}
              />
            </div>
            <button className='btn btn-primary mb-2'>Enviar</button>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default FormCita