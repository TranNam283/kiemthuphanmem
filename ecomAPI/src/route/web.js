import express from "express";
import userController from "../controllers/userController";
import allcodeController from "../controllers/allcodeController";
import productController from "../controllers/productController";
import bannerController from "../controllers/bannerController";
import typeshipController from "../controllers/typeshipController";
import commentController from "../controllers/commentController";
import shopCartController from "../controllers/shopCartController";
import orderController from "../controllers/orderController";
import addressUserController from "../controllers/addressUserController";
import messageController from "../controllers/messageController";
import statisticController from "../controllers/statisticController";
import middlewareControllers from "../middlewares/jwtVerify";
import supplierController from "../controllers/supplierController";
import externalController from "../controllers/externalController";
import receiptController from "../controllers/receiptController";
import blogController from "../controllers/blogController";
import voucherController from "../controllers/voucherController";
let router = express.Router();

let initwebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("hello");
  });

  // Debug endpoint - check DB config
  router.get("/api/debug-db", async (req, res) => {
    return res.json({
      DB_HOST: process.env.DB_HOST || "not set",
      DB_PORT: process.env.DB_PORT || "not set",
      DB_NAME: process.env.DB_NAME || "not set",
      DB_USER: process.env.DB_USER || "not set",
      DB_PASSWORD: process.env.DB_PASSWORD ? "***set***" : "not set",
    });
  });

  //=====================API USER==========================//
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put(
    "/api/update-user",
    middlewareControllers.verifyTokenUser,
    userController.handleUpdateUser
  );
  router.delete(
    "/api/delete-user",
    middlewareControllers.verifyTokenAdmin,
    userController.handleDeleteUser
  );
  router.post("/api/login", userController.handleLogin);
  router.post(
    "/api/changepassword",
    middlewareControllers.verifyTokenUser,
    userController.handleChangePassword
  );
  router.get(
    "/api/get-all-user",
    middlewareControllers.verifyTokenAdmin,
    userController.getAllUser
  );
  router.get("/api/get-detail-user-by-id", userController.getDetailUserById);
  router.post(
    "/api/send-verify-email",
    middlewareControllers.verifyTokenUser,
    userController.handleSendVerifyEmailUser
  );
  router.post(
    "/api/verify-email",
    middlewareControllers.verifyTokenUser,
    userController.handleVerifyEmailUser
  );
  router.post(
    "/api/send-forgotpassword-email",
    userController.handleSendEmailForgotPassword
  );
  router.post("/api/forgotpassword-email", userController.handleForgotPassword);
  router.get(
    "/api/check-phonenumber-email",
    userController.checkPhonenumberEmail
  );
  router.get(
    "/api/get-detail-user-by-email",
    userController.getDetailUserByEmail
  );
  //===================API ALLCODE========================//
  router.post(
    "/api/create-new-all-code",
    middlewareControllers.verifyTokenAdmin,
    allcodeController.handleCreateNewAllCode
  );
  router.put(
    "/api/update-all-code",
    middlewareControllers.verifyTokenAdmin,
    allcodeController.handleUpdateAllCode
  );
  router.delete(
    "/api/delete-all-code",
    middlewareControllers.verifyTokenAdmin,
    allcodeController.handleDeleteAllCode
  );
  router.get("/api/get-all-code", allcodeController.getAllCodeService);
  router.get("/api/get-list-allcode", allcodeController.getListAllCodeService);
  router.get(
    "/api/get-detail-all-code-by-id",
    allcodeController.getDetailAllCodeById
  );

  //==================API PRODUCT=========================//
  router.post(
    "/api/create-new-product",
    middlewareControllers.verifyTokenAdmin,
    productController.createNewProduct
  );
  router.put(
    "/api/update-product",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProduct
  );
  router.get(
    "/api/get-all-product-admin",
    middlewareControllers.verifyTokenAdmin,
    productController.getAllProductAdmin
  );
  router.get("/api/get-all-product-user", productController.getAllProductUser);
  router.post(
    "/api/unactive-product",
    middlewareControllers.verifyTokenAdmin,
    productController.UnactiveProduct
  );
  router.post(
    "/api/active-product",
    middlewareControllers.verifyTokenAdmin,
    productController.ActiveProduct
  );
  router.get(
    "/api/get-detail-product-by-id",
    productController.getDetailProductById
  );
  router.get(
    "/api/get-all-product-detail-by-id",
    productController.getAllProductDetailById
  );
  router.get(
    "/api/get-all-product-detail-image-by-id",
    productController.getAllProductDetailImageById
  );
  router.post(
    "/api/create-new-product-detail",
    middlewareControllers.verifyTokenAdmin,
    productController.createNewProductDetail
  );
  router.put(
    "/api/update-product-detail",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductDetail
  );
  router.get(
    "/api/get-product-detail-by-id",
    productController.getDetailProductDetailById
  );
  router.post(
    "/api/create-product-detail-image",
    middlewareControllers.verifyTokenAdmin,
    productController.createNewProductDetailImage
  );
  router.get(
    "/api/get-product-detail-image-by-id",
    productController.getDetailProductImageById
  );
  router.put(
    "/api/update-product-detail-image",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductDetailImage
  );
  router.delete(
    "/api/delete-product-detail-image",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductDetailImage
  );
  router.delete(
    "/api/delete-product-detail",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductDetail
  );
  router.get(
    "/api/get-all-product-detail-size-by-id",
    productController.getAllProductDetailSizeById
  );
  router.post(
    "/api/create-product-detail-size",
    middlewareControllers.verifyTokenAdmin,
    productController.createNewProductDetailSize
  );
  router.get(
    "/api/get-detail-product-detail-size-by-id",
    productController.getDetailProductDetailSizeById
  );
  router.put(
    "/api/update-product-detail-size",
    middlewareControllers.verifyTokenAdmin,
    productController.updateProductDetailSize
  );
  router.delete(
    "/api/delete-product-detail-size",
    middlewareControllers.verifyTokenAdmin,
    productController.deleteProductDetailSize
  );
  router.get("/api/get-product-feature", productController.getProductFeature);
  router.get("/api/get-product-new", productController.getProductNew);
  router.get("/api/get-product-shopcart", productController.getProductShopCart);
  //==================API BANNER=============================//
  router.post(
    "/api/create-new-banner",
    middlewareControllers.verifyTokenAdmin,
    bannerController.createNewBanner
  );
  router.get("/api/get-detail-banner", bannerController.getDetailBanner);
  router.get("/api/get-all-banner", bannerController.getAllBanner);
  router.put(
    "/api/update-banner",
    middlewareControllers.verifyTokenAdmin,
    bannerController.updateBanner
  );
  router.delete(
    "/api/delete-banner",
    middlewareControllers.verifyTokenAdmin,
    bannerController.deleteBanner
  );

  //=================API TYPESHIP =======================//
  router.post(
    "/api/create-new-typeship",
    middlewareControllers.verifyTokenAdmin,
    typeshipController.createNewTypeShip
  );
  router.get(
    "/api/get-detail-typeship",
    typeshipController.getDetailTypeshipById
  );
  router.get("/api/get-all-typeship", typeshipController.getAllTypeship);
  router.put(
    "/api/update-typeship",
    middlewareControllers.verifyTokenAdmin,
    typeshipController.updateTypeship
  );
  router.delete(
    "/api/delete-typeship",
    middlewareControllers.verifyTokenAdmin,
    typeshipController.deleteTypeship
  );

  //=================API REVIEW=============================//
  router.post(
    "/api/create-new-review",
    middlewareControllers.verifyTokenUser,
    commentController.createNewReview
  );
  router.post(
    "/api/reply-review",
    middlewareControllers.verifyTokenAdmin,
    commentController.ReplyReview
  );
  router.get(
    "/api/get-all-review-by-productId",
    commentController.getAllReviewByProductId
  );
  router.delete(
    "/api/delete-review",
    middlewareControllers.verifyTokenUser,
    commentController.deleteReview
  );

  //=================API COMMENT BLOG=======================//
  router.post(
    "/api/create-new-comment-blog",
    middlewareControllers.verifyTokenUser,
    commentController.createNewCommentBlog
  );
  router.get(
    "/api/get-all-comment-by-blogId",
    commentController.getAllCommentByBlogId
  );

  //=================API SHOPCART==========================//
  router.post(
    "/api/add-shopcart",
    middlewareControllers.verifyTokenUser,
    shopCartController.addShopCart
  );
  router.get(
    "/api/get-all-shopcart-by-userId",
    middlewareControllers.verifyTokenUser,
    shopCartController.getAllShopCartByUserId
  );
  router.delete(
    "/api/delete-item-shopcart",
    middlewareControllers.verifyTokenUser,
    shopCartController.deleteItemShopCart
  );

  //=================API ORDER=============================//
  router.post(
    "/api/create-new-order",
    middlewareControllers.verifyTokenUser,
    orderController.createNewOrder
  );
  router.get("/api/get-all-order", orderController.getAllOrders);
  router.get("/api/get-detail-order", orderController.getDetailOrderById);
  router.put(
    "/api/update-status-order",
    middlewareControllers.verifyTokenUser,
    orderController.updateStatusOrder
  );
  router.put(
    "/api/update-shipping-info",
    middlewareControllers.verifyTokenAdminOrUser,
    orderController.updateShippingInfo
  );
  router.put(
    "/api/update-refund-status",
    middlewareControllers.verifyTokenAdmin,
    orderController.updateRefundStatus
  );
  router.get(
    "/api/get-all-order-by-user",
    middlewareControllers.verifyTokenUser,
    orderController.getAllOrdersByUser
  );
  router.post(
    "/api/payment-order",
    middlewareControllers.verifyTokenUser,
    orderController.paymentOrder
  );
  router.post(
    "/api/payment-order-success",
    middlewareControllers.verifyTokenUser,
    orderController.paymentOrderSuccess
  );
  router.post(
    "/api/payment-order-vnpay-success",
    middlewareControllers.verifyTokenUser,
    orderController.paymentOrderVnpaySuccess
  );
  router.put("/api/confirm-order", orderController.confirmOrder);
  // router.get('/api/get-all-order-by-shipper') - removed, using GHN third-party shipping
  router.post(
    "/api/payment-order-vnpay",
    middlewareControllers.verifyTokenUser,
    orderController.paymentOrderVnpay
  );
  router.post("/api/vnpay_return", orderController.confirmOrderVnpay);
  router.put("/api/update-image-order", orderController.updateImageOrder);
  router.post("/api/webhook/ghn", orderController.handleGHNWebhook);
  //=================API ADDRESS USER ======================//
  router.post(
    "/api/create-new-address-user",
    middlewareControllers.verifyTokenUser,
    addressUserController.createNewAddressUser
  );
  router.get(
    "/api/get-all-address-user",
    middlewareControllers.verifyTokenUser,
    addressUserController.getAllAddressUserByUserId
  );
  router.delete(
    "/api/delete-address-user",
    middlewareControllers.verifyTokenUser,
    addressUserController.deleteAddressUser
  );
  router.put(
    "/api/edit-address-user",
    middlewareControllers.verifyTokenUser,
    addressUserController.editAddressUser
  );
  router.get(
    "/api/get-detail-address-user-by-id",
    middlewareControllers.verifyTokenUser,
    addressUserController.getDetailAddressUserById
  );
  //=================API MESSAGE============================//
  router.post(
    "/api/create-new-room",
    middlewareControllers.verifyTokenUser,
    messageController.createNewRoom
  );
  router.post(
    "/api/sendMessage",
    middlewareControllers.verifyTokenUser,
    messageController.sendMessage
  );
  router.get(
    "/api/loadMessage",
    middlewareControllers.verifyTokenUser,
    messageController.loadMessage
  );
  router.get(
    "/api/listRoomOfUser",
    middlewareControllers.verifyTokenUser,
    messageController.listRoomOfUser
  );
  router.get(
    "/api/listRoomOfAdmin",
    middlewareControllers.verifyTokenAdmin,
    messageController.listRoomOfAdmin
  );

  //=================API STATISTIC==============================//
  router.get(
    "/api/get-count-card-statistic",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getCountCardStatistic
  );
  router.get(
    "/api/get-count-status-order",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getCountStatusOrder
  );
  router.get(
    "/api/get-statistic-by-month",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getStatisticByMonth
  );
  router.get(
    "/api/get-statistic-by-day",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getStatisticByDay
  );
  router.get(
    "/api/get-statistic-overturn",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getStatisticOverturn
  );
  router.get(
    "/api/get-statistic-profit",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getStatisticProfit
  );
  router.get(
    "/api/get-statistic-stock-product",
    middlewareControllers.verifyTokenAdmin,
    statisticController.getStatisticStockProduct
  );
  //=================API SUPPLIER================================//
  router.post(
    "/api/create-new-supplier",
    middlewareControllers.verifyTokenAdmin,
    supplierController.createNewSupplier
  );
  router.get(
    "/api/get-detail-supplier",
    supplierController.getDetailSupplierById
  );
  router.get("/api/get-all-supplier", supplierController.getAllSupplier);
  router.put(
    "/api/update-supplier",
    middlewareControllers.verifyTokenAdmin,
    supplierController.updateSupplier
  );
  router.delete(
    "/api/delete-supplier",
    middlewareControllers.verifyTokenAdmin,
    supplierController.deleteSupplier
  );

  //=================API RECEIPT================================//
  router.post(
    "/api/create-new-receipt",
    middlewareControllers.verifyTokenAdmin,
    receiptController.createNewReceipt
  );
  router.get("/api/get-detail-receipt", receiptController.getDetailReceiptById);
  router.get("/api/get-all-receipt", receiptController.getAllReceipt);
  router.put(
    "/api/update-receipt",
    middlewareControllers.verifyTokenAdmin,
    receiptController.updateReceipt
  );
  router.delete(
    "/api/delete-receipt",
    middlewareControllers.verifyTokenAdmin,
    receiptController.deleteReceipt
  );
  router.post(
    "/api/create-new-detail-receipt",
    middlewareControllers.verifyTokenAdmin,
    receiptController.createNewReceiptDetail
  );

  //=================API BLOG===============================//
  router.post(
    "/api/create-new-blog",
    middlewareControllers.verifyTokenAdmin,
    blogController.createNewBlog
  );
  router.get("/api/get-detail-blog", blogController.getDetailBlogById);
  router.get("/api/get-all-blog", blogController.getAllBlog);
  router.put(
    "/api/update-blog",
    middlewareControllers.verifyTokenAdmin,
    blogController.updateBlog
  );
  router.delete(
    "/api/delete-blog",
    middlewareControllers.verifyTokenAdmin,
    blogController.deleteBlog
  );
  router.get("/api/get-feature-blog", blogController.getFeatureBlog);
  router.get("/api/get-new-blog", blogController.getNewBlog);

  //=================API VOUCHER===============================//
  router.get("/api/get-all-type-voucher", voucherController.getAllTypeVoucher);
  router.post(
    "/api/create-new-type-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.createNewTypeVoucher
  );
  router.put(
    "/api/update-type-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.updateTypeVoucher
  );
  router.delete(
    "/api/delete-type-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.deleteTypeVoucher
  );

  router.get(
    "/api/get-all-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.getAllVoucher
  );
  router.get(
    "/api/get-detail-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.getDetailVoucher
  );
  router.post(
    "/api/create-new-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.createNewVoucher
  );
  router.put(
    "/api/update-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.updateVoucher
  );
  router.delete(
    "/api/delete-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.deleteVoucher
  );

  router.get(
    "/api/get-voucher-store",
    middlewareControllers.verifyTokenUser,
    voucherController.getVoucherStore
  );
  router.post(
    "/api/claim-voucher",
    middlewareControllers.verifyTokenUser,
    voucherController.claimVoucher
  );
  router.get(
    "/api/get-voucher-wallet",
    middlewareControllers.verifyTokenUser,
    voucherController.getVoucherWallet
  );
  router.put(
    "/api/revoke-voucher",
    middlewareControllers.verifyTokenAdmin,
    voucherController.revokeVoucher
  );

  // External proxied endpoints (avoid CORS on client)
  router.get("/api/get-exchange-rate", externalController.getExchangeRate);
  return app.use("/", router);
};

module.exports = initwebRoutes;
