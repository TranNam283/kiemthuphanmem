import React, { useCallback, useEffect, useState } from 'react';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';

const ManageCategory = () => {

    const [dataCategory, setdataCategory] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [keyword, setkeyword] = useState('')
    const fetchData = useCallback(async (searchKeyword, offset = 0) => {
        const arrData = await getListAllCodeService({
            type: 'CATEGORY',
            limit: PAGINATION.pagerow,
            offset,
            keyword: searchKeyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataCategory(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }, [])
    useEffect(() => {
        const loadInitial = async () => {
            await fetchData('')
        }
        loadInitial()
    }, [fetchData])
    let handleDeleteCategory = async (id) => {
        const res = await DeleteAllcodeService(id)
        if (res && res.errCode === 0) {
            toast.success("Xóa danh mục thành công")
            await fetchData(keyword, numberPage * PAGINATION.pagerow)

        } else toast.error("Xóa danh mục thất bại")
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        await fetchData(keyword, number.selected * PAGINATION.pagerow)
    }
    let handleSearchCategory = (keyword) =>{
        setkeyword(keyword)
        setnumberPage(0)
        fetchData(keyword)
    }
    let handleOnchangeSearch = (keyword) =>{
        if(keyword === ''){
            setkeyword(keyword)
            setnumberPage(0)
            fetchData(keyword)
        }
    }
    let handleOnClickExport =async () =>{
        let res = await getListAllCodeService({
            type: 'CATEGORY',
            limit: '',
            offset: '',
            keyword:''
        })
        if(res && res.errCode === 0){
            await CommonUtils.exportExcel(res.data,"Danh sách danh mục","ListCategory")
        }
       
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý danh mục</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách danh mục sản phẩm
                </div>
                <div className="card-body">
                
                    <div className='row'>
                    <div  className='col-4'>
                    <FormSearch title={"tên danh mục"}  handleOnchange={handleOnchangeSearch} handleSearch={handleSearchCategory} />
                    </div>
                    <div className='col-8'>
                    <button  style={{float:'right'}} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                    </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>mã code</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataCategory && dataCategory.length > 0 &&
                                    dataCategory.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    <Link to={`/admin/edit-category/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <button type="button" className="btn btn-link p-0" onClick={() => handleDeleteCategory(item.id)} >Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'Quay lại'}
                            nextLabel={'Tiếp'}
                            breakLabel={'...'}
                            pageCount={count}
                            marginPagesDisplayed={3}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            activeClassName={"active"}
                            onPageChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageCategory;