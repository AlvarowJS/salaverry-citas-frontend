import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Check, Edit, Trash, X } from 'react-feather'
import { Row, Badge, Button, Card, Col } from 'reactstrap'
import FormCita from './FormCita'
import { useForm } from 'react-hook-form'
import bdCitas from '../../api/bdCitas'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
const TablaCitas = ({
    cita, dateChange, handleDate,
    getAuthHeaders, URL, refresh, setRefresh

}) => {
    const [modal, setModal] = useState(false)
    const [montoTotal, setMontoTotal] = useState()
    const { handleSubmit, register, reset } = useForm()
    const [actualizacion, setActualizacion] = useState(false)
    const [paciente, setPaciente] = useState()

    const defaulValuesForm = {
        confirmar: '',
        entro: '',
        fecha: '',
        hora: '',
        llego: '',
        observacion: '',
        paciente_id: '',
        pago: '',
        pago_tipo_id: '',
        silla: '',
        status: '',
    }
    const calcularSuma = () => {
        const suma = cita?.citas.reduce((total, objeto) => {
            return total + objeto?.pago;
        }, 0);
        return suma
    }

    const crearCita = (data) => {
        bdCitas.post(URL, data, getAuthHeaders())
            .then(res => {
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
                console.log(err.response.status)
                if (err.response && err.response.status === 409) {
                    // Error 409: Conflicto, manejar de manera diferente
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'El horario seleccionado ya se encuentra ocupado.',
                        showConfirmButton: false,
                    })
                } else {
                    // Otros errores, mensaje genérico
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Contacte con soporte',
                        showConfirmButton: false,
                    })
                }
            });
    }
    const toggle = () => {
        setActualizacion(false)
        reset(defaulValuesForm)
        setModal(!modal)
    }

    const toggleActualizacion = () => {
        setActualizacion(true)
        setModal(!modal)
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
                console.log(err.response.status)
                if (err.response && err.response.status === 409) {
                    // Error 409: Conflicto, manejar de manera diferente
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'El horario seleccionado ya se encuentra ocupado.',
                        showConfirmButton: false,
                    })
                } else {
                    // Otros errores, mensaje genérico
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Contacte con soporte',
                        showConfirmButton: false,
                    })
                }
            });
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
                            title: 'Cita Eliminada',
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

    const actualizarCitaId = (id) => {
        toggleActualizacion.call()
        setActualizacion(true)

        bdCitas.get(`${URL}/${id}`, getAuthHeaders())
            .then(res => {
                reset(res.data)
                setPaciente({
                    'value': res.data.paciente.id,
                    'label': res.data.paciente.nombre + ' ' + res.data.paciente.apellido_paterno + ' ' + res.data.paciente.apellido_materno
                })

            })
            .catch(err => null)
    }

    const submit = (data) => {
        data.silla = data.silla == "" ? false : true
        data.confirmar = data.confirmar == "" ? false : true
        data.paciente_id = paciente.value
        data.medico_id = cita.id

        if (actualizacion) {
            actualizarCita(data.id, data)
        } else {
            crearCita(data)
        }
    }

    const columns = [
        {
            sortable: true,
            name: 'Conf',
            minWidth: '25px',
            maxWidth: '80px',
            selector: row => {
                return (
                    <>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel"
                            value=""
                            aria-label="..."
                            checked={row?.confirmar}
                        />
                    </>
                )
            }
        },
        {
            sortable: true,
            name: 'Hora',
            minWidth: '25px',
            maxWidth: '100px',
            selector: row => row?.hora
        },
        {
            sortable: true,
            name: 'Paciente',
            minWidth: '25px',
            maxWidth: '180px',
            selector: row => row?.paciente?.nombre + ' ' + row?.paciente?.apellido_paterno + ' ' + row?.paciente?.apellido_materno
        },
        {
            sortable: true,
            name: 'Silla',
            minWidth: '25px',
            maxWidth: '100px',
            selector: row => {
                return (
                    <>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel"
                            value=""
                            aria-label="..."
                            checked={row?.silla}
                        />
                    </>
                )
            }
        },
        {
            sortable: true,
            name: 'Llego',
            minWidth: '25px',
            maxWidth: '200px',
            selector: row => {
                return (
                    <>
                        <Badge color='light-success'>
                            {row?.llego}
                        </Badge>
                    </>
                )
            }
        },
        {
            sortable: true,
            name: 'Entro',
            minWidth: '25px',
            maxWidth: '200px',
            selector: row => {
                return (
                    <>
                        <Badge color='light-warning'>
                            {row?.entro}
                        </Badge>
                    </>
                )
            }
        },
        {
            sortable: true,
            name: 'Pago',
            minWidth: '25px',
            maxWidth: '100px',
            selector: row => row?.pago
        },
        {
            sortable: true,
            name: 'Tipo de pago',
            minWidth: '25px',
            maxWidth: '150px',
            selector: row => row?.pagotipo?.tipoPago
        },

        {
            name: 'Acciones',
            sortable: true,
            allowOverflow: true,
            minWidth: '200px',
            maxWidth: '400px',
            cell: row => {
                return (
                    <div className='d-flex gap-1 my-1'>

                        <button className='btn btn-warning' style={{ fontSize: '12px', padding: '5px 10px' }}
                            onClick={() => actualizarCitaId(row?.id)}
                        >
                            <Edit />
                        </button>
                        <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white', fontSize: '12px', padding: '5px 10px' }}
                            onClick={() => eliminarCita(row?.id)}
                        >
                            <Trash />
                        </button>
                    </div>
                )
            }
        }

    ]
    return (
        <>
            <Card className='mt-2'>
                <Row className='p-2'>
                    <Col>
                        <h4>Dr {cita?.nombre} {cita?.apellido_paterno} {cita?.apellido_materno}</h4>
                    </Col>
                    <Col>
                        <h4>Pago Total: $ {calcularSuma()}</h4>
                    </Col>
                    <Col>
                        <Button color='info'
                            onClick={toggle}
                        >
                            + Asignar Cita
                        </Button>
                    </Col>
                </Row>
                <DataTable
                    noHeader
                    pagination
                    className='react-datatable'
                    columns={columns}
                    data={cita.citas}

                />
            </Card>

            <FormCita
                toggle={toggle}
                toggleActualizacion={toggleActualizacion}
                modal={modal}
                handleSubmit={handleSubmit}
                submit={submit}
                register={register}
                reset={reset}
                getAuthHeaders={getAuthHeaders}

                paciente={paciente}
                setPaciente={setPaciente}
            />

        </>
    )
}

export default TablaCitas