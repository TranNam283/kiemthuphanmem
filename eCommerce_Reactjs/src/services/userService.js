import axios from "../axios";

// Utility to build query strings with optional params.
const buildQueryString = (params = {}) => {
  const query = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    );
  return query.length ? `?${query.join("&")}` : "";
};

//==================USER==========================//
const getAllUsers = (data) => {
  return axios.get(
    `/api/get-all-user?limit=${data.limit}&offset=${data.offset}&keyword=${data.keyword}`
  );
};
const createNewUser = (data) => {
  return axios.post(`/api/create-new-user`, data);
};
const UpdateUserService = (data) => {
  return axios.put(`/api/update-user`, data);
};
const DeleteUserService = (userId) => {
  return axios.delete(`/api/delete-user`, {
    data: {
      id: userId,
    },
  });
};
const getDetailUserById = (id) => {
  return axios.get(`/api/get-detail-user-by-id?id=${id}`);
};
const getDetailUserByEmail = (email) => {
  return axios.get(`/api/get-detail-user-by-email?email=${email}`);
};
const handleLoginService = (data) => {
  return axios.post(`/api/login`, data);
};
const handleSendVerifyEmail = (data) => {
  return axios.post(`/api/send-verify-email`, data);
};
const handleVerifyEmail = (data) => {
  return axios.post(`/api/verify-email`, data);
};
const handleChangePassword = (data) => {
  return axios.post(`/api/changepassword`, data);
};
const checkPhonenumberEmail = (data) => {
  return axios.get(
    `/api/check-phonenumber-email?phonenumber=${data.phonenumber}&email=${data.email}`
  );
};
//===============ALL CODE========================//
const getAllCodeService = (type) => {
  return axios.get(`/api/get-all-code?type=${type}`);
};
const getListAllCodeService = (data) => {
  return axios.get(
    `/api/get-list-allcode?type=${data.type}&limit=${data.limit}&offset=${data.offset}&keyword=${data.keyword}`
  );
};
const createAllCodeService = (data) => {
  return axios.post(`/api/create-new-all-code`, data);
};

const getDetailAllcodeById = (id) => {
  return axios.get(`/api/get-detail-all-code-by-id?id=${id}`);
};
const UpdateAllcodeService = (data) => {
  return axios.put(`/api/update-all-code`, data);
};
const DeleteAllcodeService = (allcodeId) => {
  return axios.delete(`/api/delete-all-code`, {
    data: {
      id: allcodeId,
    },
  });
};
//==================PRODUCT======================//
const CreateNewProduct = (data) => {
  return axios.post(`/api/create-new-product`, data);
};
const getAllProductUser = (data) => {
  return axios.get(
    `/api/get-all-product-user?limit=${data.limit}&offset=${
      data.offset
    }&sortPrice=${data.sortPrice}&sortName=${data.sortName}&categoryId=${
      data.categoryId
    }&brandId=${data.brandId}&keyword=${encodeURIComponent(data.keyword ?? "")}`
  );
};
const getAllProductAdmin = (data) => {
  return axios.get(
    `/api/get-all-product-admin?limit=${data.limit}&offset=${
      data.offset
    }&sortPrice=${data.sortPrice}&sortName=${data.sortName}&categoryId=${
      data.categoryId
    }&brandId=${data.brandId}&keyword=${encodeURIComponent(data.keyword ?? "")}`
  );
};
const getAllProductService = (data) => {
  return axios.get(
    `/api/get-all-product-admin?limit=${data.limit || ""}&offset=${
      data.offset || ""
    }&sortPrice=${data.sortPrice || ""}&sortName=${
      data.sortName || ""
    }&categoryId=${data.categoryId || ""}&brandId=${
      data.brandId || ""
    }&keyword=${data.keyword || ""}`
  );
};
const handleBanProductService = (data) => {
  return axios.post(`/api/unactive-product`, data);
};
const handleActiveProductService = (data) => {
  return axios.post(`/api/active-product`, data);
};
const getDetailProductByIdService = (id) => {
  return axios.get(`/api/get-detail-product-by-id?id=${id}`);
};
const UpdateProductService = (data) => {
  return axios.put(`/api/update-product`, data);
};
const getAllProductDetailByIdService = (data) => {
  return axios.get(
    `/api/get-all-product-detail-by-id?id=${data.id}&limit=${data.limit}&offset=${data.offset}`
  );
};
const getAllProductDetailImageByIdService = (data) => {
  return axios.get(
    `/api/get-all-product-detail-image-by-id?id=${data.id}&limit=${data.limit}&offset=${data.offset}`
  );
};
const getAllProductDetailSizeByIdService = (data) => {
  return axios.get(
    `/api/get-all-product-detail-size-by-id?id=${data.id}&limit=${data.limit}&offset=${data.offset}`
  );
};
const CreateNewProductDetailService = (data) => {
  return axios.post(`/api/create-new-product-detail`, data);
};
const getProductDetailByIdService = (id) => {
  return axios.get(`/api/get-product-detail-by-id?id=${id}`);
};
const UpdateProductDetailService = (data) => {
  return axios.put(`/api/update-product-detail`, data);
};
const createNewProductImageService = (data) => {
  return axios.post(`/api/create-product-detail-image`, data);
};
const getProductDetailImageByIdService = (id) => {
  return axios.get(`/api/get-product-detail-image-by-id?id=${id}`);
};
const UpdateProductDetailImageService = (data) => {
  return axios.put(`/api/update-product-detail-image`, data);
};
const DeleteProductDetailImageService = (data) => {
  return axios.delete(`/api/delete-product-detail-image`, { data: data });
};
const DeleteProductDetailService = (data) => {
  return axios.delete(`/api/delete-product-detail`, { data: data });
};
const createNewProductSizeService = (data) => {
  return axios.post(`/api/create-product-detail-size`, data);
};
const getProductDetailSizeByIdService = (id) => {
  return axios.get(`/api/get-detail-product-detail-size-by-id?id=${id}`);
};
const UpdateProductDetailSizeService = (data) => {
  return axios.put(`/api/update-product-detail-size`, data);
};
const DeleteProductDetailSizeService = (data) => {
  return axios.delete(`/api/delete-product-detail-size`, { data: data });
};
const getProductFeatureService = (limit) => {
  return axios.get(`/api/get-product-feature?limit=${limit}`);
};
const getProductNewService = (limit) => {
  return axios.get(`/api/get-product-new?limit=${limit}`);
};
const getProductShopcartService = (data) => {
  return axios.get(
    `/api/get-product-shopcart?userId=${data.userId}&limit=${data.limit}`
  );
};

//===============BANNER======================//
const createNewBannerService = (data) => {
  return axios.post(`/api/create-new-banner`, data);
};
const updateBannerService = (data) => {
  return axios.put(`/api/update-banner`, data);
};
const deleteBannerService = (data) => {
  return axios.delete(`/api/delete-banner`, { data: data });
};
const getDetailBannerByIdService = (id) => {
  return axios.get(`/api/get-detail-banner?id=${id}`);
};
const getAllBanner = (data) => {
  return axios.get(
    `/api/get-all-banner?limit=${data.limit}&offset=${data.offset}&keyword=${data.keyword}`
  );
};
//===================TYPESHIP=====================//
const createNewTypeShipService = (data) => {
  return axios.post(`/api/create-new-typeship`, data);
};
const updateTypeShipService = (data) => {
  return axios.put(`/api/update-typeship`, data);
};
const deleteTypeShipService = (data) => {
  return axios.delete(`/api/delete-typeship`, { data: data });
};
const getDetailTypeShipByIdService = (id) => {
  return axios.get(`/api/get-detail-typeship?id=${id}`);
};
const getAllTypeShip = (data) => {
  return axios.get(
    `/api/get-all-typeship?limit=${data.limit}&offset=${data.offset}&keyword=${data.keyword}`
  );
};
//========================REVIEW======================//
const createNewReviewService = (data) => {
  return axios.post(`/api/create-new-review`, data);
};
const getAllReviewByProductIdService = (id) => {
  return axios.get(`/api/get-all-review-by-productId?id=${id}`);
};
const ReplyReviewService = (data) => {
  return axios.post(`/api/reply-review`, data);
};
const deleteReviewService = (data) => {
  return axios.delete(`/api/delete-review`, { data: data });
};
//========================SHOPCART===================//
const addShopCartService = (data) => {
  return axios.post(`/api/add-shopcart`, data);
};
const getAllShopCartByUserIdService = (id) => {
  return axios.get(`/api/get-all-shopcart-by-userId?id=${id}`);
};
const deleteItemShopCartService = (data) => {
  return axios.delete(`/api/delete-item-shopcart`, { data: data });
};
//==========================ORDER====================//
const createNewOrderService = (data) => {
  return axios.post(`/api/create-new-order`, data);
};
const getAllOrder = (data) => {
  return axios.get(
    `/api/get-all-order?limit=${data.limit}&offset=${data.offset}&statusId=${data.statusId}`
  );
};
const getDetailOrder = (id) => {
  return axios.get(`/api/get-detail-order?id=${id}`);
};
const updateStatusOrderService = (data) => {
  return axios.put(`/api/update-status-order`, data);
};
const updateShippingInfoService = (data) => {
  return axios.put(`/api/update-shipping-info`, data);
};

const updateRefundStatusService = (data) => {
  return axios.put(`/api/update-refund-status`, data);
};

const getAllOrdersByUser = (userId) => {
  return axios.get(`/api/get-all-order-by-user?userId=${userId}`);
};
const paymentOrderService = (data) => {
  return axios.post(`/api/payment-order`, data);
};
const paymentOrderSuccessService = (data) => {
  return axios.post(`/api/payment-order-success`, data);
};
const paymentOrderVnpaySuccessService = (data) => {
  return axios.post(`/api/payment-order-vnpay-success`, data);
};
const paymentOrderVnpayService = (data) => {
  return axios.post(`/api/payment-order-vnpay`, data);
};
const confirmOrderVnpay = (data) => {
  return axios.post(`/api/vnpay_return`, data);
};
//=========================ADDRESS USER==============//
const createNewAddressUserrService = (data) => {
  return axios.post(`/api/create-new-address-user`, data);
};
const deleteAddressUserService = (data) => {
  return axios.delete(`/api/delete-address-user`, { data: data });
};
const editAddressUserService = (data) => {
  return axios.put(`/api/edit-address-user`, data);
};
const getAllAddressUserByUserIdService = (userId) => {
  return axios.get(`/api/get-all-address-user?userId=${userId}`);
};
const getDetailAddressUserByIdService = (id) => {
  return axios.get(`/api/get-detail-address-user-by-id?id=${id}`);
};
//======================MESSSAGE==========================//
const createNewRoom = (data) => {
  return axios.post(`/api/create-new-room`, data);
};
const sendMessage = (data) => {
  return axios.post(`/api/sendMessage`, data);
};
const loadMessage = (roomId, userId) => {
  return axios.get(`/api/loadMessage?roomId=${roomId}&userId=${userId}`);
};
const listRoomOfUser = (userId) => {
  return axios.get(`/api/listRoomOfUser?userId=${userId}`);
};
const listRoomOfAdmin = () => {
  return axios.get(`/api/listRoomOfAdmin`);
};
//========================COMMENT=======================
const getAllcommentByBlogIdService = (id) => {
  return axios.get(`/api/get-all-comment-by-blogId?id=${id}`);
};
const createNewcommentService = (data) => {
  return axios.post(`/api/create-new-comment-blog`, data);
};
//=================BLOG=========================//
const getAllCategoryBlogService = (type) => {
  return axios.get(`/api/get-all-code?type=${type}`);
};
const createNewBlogrService = (data) => {
  return axios.post(`/api/create-new-blog`, data);
};
const updateBlogService = (data) => {
  return axios.put(`/api/update-blog`, data);
};
const deleteBlogService = (data) => {
  return axios.delete(`/api/delete-blog`, { data: data });
};
const getDetailBlogByIdService = (id) => {
  return axios.get(`/api/get-detail-blog?id=${id}`);
};
const getAllBlog = (data) => {
  return axios.get(
    `/api/get-all-blog?limit=${data.limit}&offset=${data.offset}&subjectId=${data.subjectId}&keyword=${data.keyword}`
  );
};
const getFeatureBlog = (limit) => {
  return axios.get(`/api/get-feature-blog?limit=${limit}`);
};
const getNewBlog = (limit) => {
  return axios.get(`/api/get-new-blog?limit=${limit}`);
};
//======================STATISTIC========================//
const getCountCardStatistic = () => {
  return axios.get(`/api/get-count-card-statistic`);
};
const getCountStatusOrder = (data) => {
  return axios.get(
    `/api/get-count-status-order?oneDate=${data.oneDate}&twoDate=${data.twoDate}&type=${data.type}`
  );
};
const getStatisticByMonth = (year) => {
  return axios.get(`/api/get-statistic-by-month?year=${year}`);
};
const getStatisticByDay = (data) => {
  return axios.get(
    `/api/get-statistic-by-day?year=${data.year}&month=${data.month}`
  );
};
const getStatisticOverturn = (data) => {
  return axios.get(
    `/api/get-statistic-overturn?oneDate=${data.oneDate}&twoDate=${data.twoDate}&type=${data.type}`
  );
};
const getStatisticProfit = (data) => {
  return axios.get(
    `/api/get-statistic-profit?oneDate=${data.oneDate}&twoDate=${data.twoDate}&type=${data.type}`
  );
};
const getStatisticStockProduct = (data) => {
  return axios.get(
    `/api/get-statistic-stock-product?limit=${data.limit}&offset=${data.offset}`
  );
};
//=======================VOUCHER===========================//
const getAllTypeVoucherService = (params = {}) => {
  const query = buildQueryString({
    limit: params.limit,
    offset: params.offset,
    keyword: params.keyword,
  });
  return axios.get(`/api/get-all-type-voucher${query}`);
};
const createNewTypeVoucherService = (data) => {
  return axios.post(`/api/create-new-type-voucher`, data);
};
const updateTypeVoucherService = (data) => {
  return axios.put(`/api/update-type-voucher`, data);
};
const deleteTypeVoucherService = (data) => {
  return axios.delete(`/api/delete-type-voucher`, { data });
};

const getAllVoucherService = (params = {}) => {
  const query = buildQueryString({
    limit: params.limit,
    offset: params.offset,
    status: params.status,
    typeVoucherId: params.typeVoucherId,
    keyword: params.keyword,
  });
  return axios.get(`/api/get-all-voucher${query}`);
};
const getDetailVoucherService = (id) => {
  return axios.get(`/api/get-detail-voucher?id=${id}`);
};
const createNewVoucherService = (data) => {
  return axios.post(`/api/create-new-voucher`, data);
};
const updateVoucherService = (data) => {
  return axios.put(`/api/update-voucher`, data);
};
const deleteVoucherService = (data) => {
  return axios.delete(`/api/delete-voucher`, { data });
};
const getVoucherStoreService = (params = {}) => {
  const query = buildQueryString({
    userId: params.userId,
    typeVoucherId: params.typeVoucherId,
    keyword: params.keyword,
  });
  return axios.get(`/api/get-voucher-store${query}`);
};
const claimVoucherService = (data) => {
  return axios.post(`/api/claim-voucher`, data);
};
const getVoucherWalletService = (userId) => {
  const query = buildQueryString({ userId });
  return axios.get(`/api/get-voucher-wallet${query}`);
};
const revokeVoucherService = (data) => {
  return axios.put(`/api/revoke-voucher`, data);
};
//=======================SUPPLIER==========================//
const createNewSupplierService = (data) => {
  return axios.post(`/api/create-new-supplier`, data);
};
const updateSupplierService = (data) => {
  return axios.put(`/api/update-supplier`, data);
};
const deleteSupplierService = (data) => {
  return axios.delete(`/api/delete-supplier`, { data: data });
};
const getDetailSupplierByIdService = (id) => {
  return axios.get(`/api/get-detail-supplier?id=${id}`);
};
const getAllSupplier = (data) => {
  return axios.get(
    `/api/get-all-supplier?limit=${data.limit}&offset=${data.offset}&keyword=${data.keyword}`
  );
};
//=======================RECEIPT==========================//
const createNewReceiptService = (data) => {
  return axios.post(`/api/create-new-receipt`, data);
};
const updateReceiptService = (data) => {
  return axios.put(`/api/update-receipt`, data);
};
const deleteReceiptService = (data) => {
  return axios.delete(`/api/delete-receipt`, { data: data });
};
const getDetailReceiptByIdService = (id) => {
  return axios.get(`/api/get-detail-receipt?id=${id}`);
};
const getAllReceipt = (data) => {
  return axios.get(
    `/api/get-all-receipt?limit=${data.limit}&offset=${data.offset}`
  );
};
const createNewReceiptDetailService = (data) => {
  return axios.post(`/api/create-new-detail-receipt`, data);
};
//======================THIRTY SERVICE==========================//
const getExchangeRate = () => {
  return axios.get(`/api/get-exchange-rate`);
};
export {
  getAllUsers,
  getAllCodeService,
  createNewUser,
  DeleteUserService,
  getDetailUserById,
  UpdateUserService,
  createAllCodeService,
  getDetailAllcodeById,
  UpdateAllcodeService,
  DeleteAllcodeService,
  handleLoginService,
  handleSendVerifyEmail,
  handleVerifyEmail,
  handleChangePassword,
  CreateNewProduct,
  getAllProductUser,
  getAllProductAdmin,
  getAllProductService,
  handleBanProductService,
  handleActiveProductService,
  getDetailProductByIdService,
  UpdateProductService,
  getAllProductDetailByIdService,
  getAllProductDetailImageByIdService,
  CreateNewProductDetailService,
  getProductDetailByIdService,
  UpdateProductDetailService,
  createNewProductImageService,
  getProductDetailImageByIdService,
  UpdateProductDetailImageService,
  DeleteProductDetailImageService,
  DeleteProductDetailService,
  createNewBannerService,
  updateBannerService,
  deleteBannerService,
  getDetailBannerByIdService,
  getAllBanner,
  getListAllCodeService,
  createNewTypeShipService,
  updateTypeShipService,
  deleteTypeShipService,
  getDetailTypeShipByIdService,
  getAllTypeShip,
  getAllProductDetailSizeByIdService,
  createNewProductSizeService,
  getProductDetailSizeByIdService,
  UpdateProductDetailSizeService,
  DeleteProductDetailSizeService,
  createNewReviewService,
  getAllReviewByProductIdService,
  ReplyReviewService,
  deleteReviewService,
  getProductFeatureService,
  getProductNewService,
  addShopCartService,
  getAllShopCartByUserIdService,
  deleteItemShopCartService,
  createNewOrderService,
  createNewAddressUserrService,
  getAllAddressUserByUserIdService,
  deleteAddressUserService,
  editAddressUserService,
  getDetailAddressUserByIdService,
  getAllOrder,
  getDetailOrder,
  updateStatusOrderService,
  updateShippingInfoService,
  updateRefundStatusService,
  getAllOrdersByUser,
  paymentOrderService,
  paymentOrderSuccessService,
  createNewRoom,
  sendMessage,
  loadMessage,
  listRoomOfUser,
  listRoomOfAdmin,
  getAllCategoryBlogService,
  createNewBlogrService,
  updateBlogService,
  deleteBlogService,
  getDetailBlogByIdService,
  getAllBlog,
  getFeatureBlog,
  getNewBlog,
  getAllcommentByBlogIdService,
  createNewcommentService,
  getCountCardStatistic,
  getCountStatusOrder,
  getStatisticByMonth,
  getStatisticByDay,
  checkPhonenumberEmail,
  createNewSupplierService,
  updateSupplierService,
  deleteSupplierService,
  getDetailSupplierByIdService,
  getAllSupplier,
  createNewReceiptService,
  getAllReceipt,
  getDetailReceiptByIdService,
  deleteReceiptService,
  updateReceiptService,
  createNewReceiptDetailService,
  getStatisticOverturn,
  getStatisticProfit,
  getProductShopcartService,
  getDetailUserByEmail,
  getStatisticStockProduct,
  getExchangeRate,
  paymentOrderVnpayService,
  confirmOrderVnpay,
  paymentOrderVnpaySuccessService,
  getAllTypeVoucherService,
  createNewTypeVoucherService,
  updateTypeVoucherService,
  deleteTypeVoucherService,
  getAllVoucherService,
  getDetailVoucherService,
  createNewVoucherService,
  updateVoucherService,
  deleteVoucherService,
  getVoucherStoreService,
  claimVoucherService,
  getVoucherWalletService,
  revokeVoucherService,
};
