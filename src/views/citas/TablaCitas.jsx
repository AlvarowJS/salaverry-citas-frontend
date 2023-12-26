import React from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Badge, Card } from 'reactstrap'

const TablaCitas = ({
    cita,
    actualizarCitaId, eliminarCita
}) => {    

    const columns = [
        // {
        //     sortable: true,
        //     name: 'Conf',
        //     minWidth: '25px',
        //     maxWidth: '80px',
        //     selector: row => row?.
        // },
        {
            sortable: true,
            name: 'Conf',
            minWidth: '25px',
            maxWidth: '80px',
            selector: row => row?.id
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

                        <button className='btn btn-warning'
                            onClick={() => actualizarCitaId(row?.id)}
                        >
                            <Edit />
                        </button>
                        <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
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
                <DataTable
                    noHeader
                    pagination
                    className='react-datatable'
                    columns={columns}
                    data={cita}

                />
            </Card>

        </>
    )
}

export default TablaCitas