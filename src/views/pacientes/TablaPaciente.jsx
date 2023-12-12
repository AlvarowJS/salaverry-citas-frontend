import React from 'react'
import DataTable from 'react-data-table-component'
import { Delete, Edit, Trash } from 'react-feather'
import { Card, CardBody, CardHeader } from 'reactstrap'

const TablaPaciente = ({
    data, setCurrentPage, setPerPage, totalRows, filter, search,
    actualizarNoriciaId, eliminarPaciente
}) => {
    const columns = [
        {
            sortable: true,
            name: 'ID',
            minWidth: '25px',
            maxWidth: '80px',
            selector: row => row?.id
        },
        {
            sortable: true,
            name: 'Nombres',
            minWidth: '25px',
            selector: row => row?.nombre
        },
        {
            sortable: true,
            name: 'Apellido Paterno',
            minWidth: '50px',
            selector: row => row?.apellido_paterno
        },
        {
            sortable: true,
            name: 'Apellido Materno',
            minWidth: '50px',
            selector: row => row?.apellido_materno
        },
        {
            sortable: true,
            name: 'Telefono',
            minWidth: '25px',
            selector: row => row?.telefono
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
                            onClick={() => actualizarNoriciaId(row?.id)}
                        >
                            <Edit />
                        </button>
                        <button className='btn' style={{backgroundColor: '#DC3545', color: 'white'}}
                            onClick={() => eliminarPaciente(row?.id)}
                        >
                            <Trash />
                        </button>
                    </div>
                )
            }
        }

    ]

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage)
        setCurrentPage(page)
    }
    return (
        <Card className='mt-2'>
            <DataTable
                noHeader
                pagination
                paginationServer
                className='react-datatable'
                columns={columns}
                data={search ? filter : data}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}

            />
        </Card>
    )
}

export default TablaPaciente