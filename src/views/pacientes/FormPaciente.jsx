import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const FormPaciente = ({
    modal, toggle, handleSubmit, register,submit
}) => {
    return (
        <Modal isOpen={modal} toggle={toggle} size='lg'>
            <ModalHeader>
                Registrar Paciente
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>
                    <div className='form-group'>
                        <label htmlFor="">
                            Nombre
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese nombre'
                            {...register('nombre')}
                        />
                    </div>
                    <button className='btn btn-primary mx-4 mb-2'>Enviar</button>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FormPaciente