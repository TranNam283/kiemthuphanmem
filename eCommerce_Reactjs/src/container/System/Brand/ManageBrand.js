import React, { useCallback, useEffect, useState } from 'react';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from 'react-router-dom';

const ManageBrand = () => {
    const [keyword, setKeyword] = useState('');
    const [dataBrand, setDataBrand] = useState([]);
    const [count, setCount] = useState(0);
    const [numberPage, setNumberPage] = useState(0);

    const fetchData = useCallback(async (searchKeyword, offset = 0) => {
        const response = await getListAllCodeService({
            type: 'BRAND',
            limit: PAGINATION.pagerow,
            offset,
            keyword: searchKeyword,
        });
        if (response && response.errCode === 0) {
            setDataBrand(response.data);
            setCount(Math.ceil(response.count / PAGINATION.pagerow));
        }
    }, []);

    useEffect(() => {
        const loadInitial = async () => {
            try {
                await fetchData('');
            } catch (error) {
                console.log(error);
            }
        };
        loadInitial();
    }, [fetchData]);

    const handleDeleteBrand = async (id) => {
        const res = await DeleteAllcodeService(id);
        if (res && res.errCode === 0) {
            toast.success('Xóa nhãn hàng thành công');
            await fetchData(keyword, numberPage * PAGINATION.pagerow);
        } else {
            toast.error('Xóa nhãn hàng thất bại');
        }
    };

    const handleChangePage = async (page) => {
        const selectedPage = page.selected;
        setNumberPage(selectedPage);
        await fetchData(keyword, selectedPage * PAGINATION.pagerow);
    };

    const handleSearchBrand = (searchKeyword) => {
        setKeyword(searchKeyword);
        setNumberPage(0);
        fetchData(searchKeyword);
    };

    const handleOnchangeSearch = (searchKeyword) => {
        if (searchKeyword === '') {
            setKeyword(searchKeyword);
            setNumberPage(0);
            fetchData(searchKeyword);
        }
    };

    const handleOnClickExport = async () => {
        const res = await getListAllCodeService({
            type: 'BRAND',
            limit: '',
            offset: '',
            keyword: '',
        });
        if (res && res.errCode === 0) {
            await CommonUtils.exportExcel(res.data, 'Danh sách nhãn hàng', 'ListBrand');
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhãn hàng</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhãn hàng sản phẩm
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <FormSearch title={"tên nhãn hàng"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBrand} />
                        </div>
                        <div className="col-8">
                            <button style={{ float: 'right' }} onClick={handleOnClickExport} className="btn btn-success">Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>mã code</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataBrand && dataBrand.length > 0 &&
                                    dataBrand.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    <Link to={`/admin/edit-Brand/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <button type="button" className="btn btn-link p-0" onClick={() => handleDeleteBrand(item.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ReactPaginate
                previousLabel={'Quay lại'}
                nextLabel={'Tiếp'}
                breakLabel={'...'}
                pageCount={count}
                marginPagesDisplayed={3}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakLinkClassName={'page-link'}
                breakClassName={'page-item'}
                activeClassName={'active'}
                onPageChange={handleChangePage}
            />
        </div>
    );
};

export default ManageBrand;