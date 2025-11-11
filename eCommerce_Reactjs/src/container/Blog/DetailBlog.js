import React, { useCallback, useEffect, useState } from 'react';
import CommentBlog from '../../component/Blog/CommentBlog';
import CommentFormBlog from '../../component/Blog/CommentFormBlog';
import RightBlog from '../../component/Blog/RightBlog';
import {
  getDetailBlogByIdService, getAllCategoryBlogService, createNewcommentService,
  getAllcommentByBlogIdService, getFeatureBlog
} from '../../services/userService'
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import moment from 'moment';
function DetailBlog(props) {
  const [dataSubject, setdataSubject] = useState([])
  const [dataComment, setdataComment] = useState([])
  const [dataBlog, setdataBlog] = useState({})
  const { id } = useParams();
  const [user, setUser] = useState({})
  const [dataFeatureBlog, setdataFeatureBlog] = useState([])
  const loadComment = useCallback(async (blogId) => {
    const res = await getAllcommentByBlogIdService(blogId)
    if (res && res.errCode === 0) {

      setdataComment(res.data)
    }
  }, [])
  const loadFeatureBlog = useCallback(async () => {
    const res = await getFeatureBlog(6)
    if (res && res.errCode === 0) {
      setdataFeatureBlog(res.data)
    }
  }, [])
  const loadCategoryBlog = useCallback(async () => {
    const res = await getAllCategoryBlogService('SUBJECT')
    if (res && res.errCode === 0) {
      setdataSubject(res.data)
    }
  }, [])
  const loadDataBlog = useCallback(async (blogId) => {
    const res = await getDetailBlogByIdService(blogId)
    if (res && res.errCode === 0) {
      setdataBlog(res.data)
    }
  }, [])
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      loadCategoryBlog()
      loadFeatureBlog()
      if (id) {
        loadDataBlog(id)
        loadComment(id)
      }
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setUser(userData)
      }

    } catch (error) {
      console.log(error)
    }

  }, [id, loadCategoryBlog, loadComment, loadDataBlog, loadFeatureBlog])
  let handleAddComment = async (content) => {
    if (user && user.id) {
      let res = await createNewcommentService({
        content: content,
        blogId: id,
        userId: user.id,
      })
      if (res && res.errCode === 0) {
        toast.success('Đăng bình luận thành công')
        loadComment(id)
      } else {
        toast.error(res.errMessage)
      }
    } else {
      toast.error("Hãy đăng nhập để bình luận")
    }
  }
  return (
    <>
      <section className="banner_area">
        <div className="banner_inner d-flex align-items-center">
          <div className="container">
            <div className="banner_content d-md-flex justify-content-between align-items-center">
              <div className="mb-3 mb-md-0">
                <h2>Chi tiết bài đăng</h2>
                <p>Theo dõi bài đăng để nhận thông tin mới nhất</p>
              </div>
              <div className="page_link">
                <Link to={"/"}>Trang chủ</Link>
                <Link to={"/blog"}>Tin tức</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="blog_area single-post-area section_gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 posts-list">
              <div className="single-post">
                <div className="feature-img">
                  <img style={{ width: '100%', height: '514px', objectFit: 'cover' }} className="img-fluid" src={dataBlog.image} alt="" />
                </div>
                <div className="blog_details">
                  <h2>{dataBlog.title}</h2>
                  <ul className="blog-info-link mt-3 mb-4">
                    <li><a href="/" onClick={(event) => event.preventDefault()}><i className="ti-user" /> {dataBlog.userData && dataBlog.userData.firstName + " " + dataBlog.userData.lastName}</a></li>
                    <li><a href="/" onClick={(event) => event.preventDefault()}><i className="ti-comments" /> {dataComment.length} Bình luận</a></li>
                  </ul>
                  <div className="quote-wrapper">
                    <div className="quotes">
                      {dataBlog.shortdescription}
                    </div>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: dataBlog.contentHTML }} className="excert">

                  </p>

                </div>
              </div>

              <div className="comments-area">
                <h4>{dataComment.length} Bình luận</h4>
                {dataComment && dataComment.length > 0 &&
                  dataComment.map((item, index) => {
                    if (item.user) {
                      let name = item.user.firstName + " " + item.user.lastName
                      return (
                        <CommentBlog img={item.user.image} name={name} content={item.content} key={index}
                          date={moment(item.createdAt).fromNow()}
                        />
                      )
                    }

                    return null

                  })
                }


              </div>
              <CommentFormBlog handleAddComment={handleAddComment} />
            </div>
            <RightBlog dataFeatureBlog={dataFeatureBlog} isPage={false} data={dataSubject}></RightBlog>
          </div>
        </div>
      </section>
    </>


  );
}

export default DetailBlog;