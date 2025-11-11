import React, { useCallback, useEffect, useState } from 'react';
import ItemBlog from '../../component/Blog/ItemBlog';
import RightBlog from '../../component/Blog/RightBlog';
import { PAGINATION } from '../../utils/constant'
import { getAllBlog } from '../../services/userService'
import ReactPaginate from 'react-paginate';
import {getAllCategoryBlogService,getFeatureBlog} from '../../services/userService'
import { Link } from 'react-router-dom';
function BlogPage(props) {
  const [dataBlog, setdataBlog] = useState([])
  const [dataFeatureBlog, setdataFeatureBlog] = useState([])
  const [dataSubject, setdataSubject] = useState([])
  const [count, setCount] = useState('')
  const [subjectId,setsubjectId] = useState('')
  const [keyword, setkeyword] = useState('')
  const fetchData = useCallback(async ({ subject = '', search = '', page = 0 } = {}) => {
    const arrData = await getAllBlog({
      subjectId: subject,
      limit: PAGINATION.pagerow,
      offset: page * PAGINATION.pagerow,
      keyword: search
    })
    if (arrData && arrData.errCode === 0) {
      setdataBlog(arrData.data)
      setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
    }
  }, [])
  const loadFeatureBlog = useCallback(async () =>{
    const res = await getFeatureBlog(6)
    if(res && res.errCode === 0){
      setdataFeatureBlog(res.data)
    }
  },[])
  const loadCategoryBlog = useCallback( async() =>{
    const res = await getAllCategoryBlogService('SUBJECT')
    if(res && res.errCode === 0){
        setdataSubject(res.data)
    }
  },[])
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      loadCategoryBlog()
      fetchData()
      loadFeatureBlog()
    } catch (error) {
        console.log(error)
    }

}, [fetchData, loadCategoryBlog, loadFeatureBlog])

let handleChangePage = async (number) => {
  await fetchData({ subject: subjectId, search: keyword, page: number.selected })
}
let handleClickCategory = (code) =>{
  setsubjectId(code)
  fetchData({ subject: code, search: '' })

}
let handleSearchBlog = (text) =>{
  fetchData({ subject: '', search: text })
  setkeyword(text)
}
let handleOnchangeSearch = (value) =>{
  if(value === ''){
    fetchData({ subject: '', search: '' })
      setkeyword('')
   }
  
}
    return (
        <>
        <section className="banner_area">
      <div className="banner_inner d-flex align-items-center">
        <div className="container">
          <div className="banner_content d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h2>Tin tức</h2>
              <p>Hãy theo dõi những bài viết để nhận được thông tin mới nhất</p>
            </div>
            <div className="page_link">
            <Link to={"/"}>Trang chủ</Link>
             <Link to={"/blog"}>Tin tức</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="blog_area section_gap">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mb-5 mb-lg-0">
                        <div className="blog_left_sidebar">
                           {dataBlog && dataBlog.length > 0 && 
                           dataBlog.map((item,index) =>{
                            return(
                              <ItemBlog key={index} data={item}></ItemBlog>
                            )
                           })
                           }
                     
                       
                          
                        </div>
                    
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
                    <RightBlog handleOnchangeSearch={handleOnchangeSearch} handleSearchBlog={handleSearchBlog} dataFeatureBlog={dataFeatureBlog} isPage={true} handleClickCategory={handleClickCategory} data={dataSubject} />
                </div>
            </div>
        </section>
        
        </>
      

    );
}

export default BlogPage;