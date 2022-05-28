import { Router } from "express";
import { ProductService } from "../services/productService";
import { validate, notFoundValidate } from "../middlewares/validator";
import { check, body, query } from "express-validator";
import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";

const { productImgUpload } = require("../utils/s3");

const productRouter = Router();

/**
 * @swagger
 * /products:
 *   post:
 *    summary: 상품 생성 API
 *    description: 상품을 생성할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    requestBody:
 *      x-name: body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *            - images
 *            - name
 *            - description
 *            - price
 *            - maxPurchaseQty
 *            properties:
 *              images:
 *                type: string
 *                example: 사진
 *              category:
 *                type: string
 *                example: 과일
 *              name:
 *                type: string
 *                example: 사과
 *              description:
 *                type: string
 *                example: 아주 맛있는 사과
 *              price: 
 *                type: number
 *                example: 1000
 *              salePrice: 
 *                type: number
 *                example: 500
 *              minPurchaseQty:
 *                type: number
 *                example: 5
 *              maxPurchaseQty:
 *                type: number
 *                example: 5
 *              views:
 *                type: number
 *                example: 0
 *    responses:
 *      201:
 *        description: 상품 생성
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                payload:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      description: 유저 id
 *                      example: 12341234
 *                    id:
 *                      type: string
 *                      description: 상품 id
 *                      example: 00001
 *                    images:
 *                      type: string
 *                      description: 상품 이미지
 *                      example: 이미지
 *                    category:
 *                      type: string
 *                      description: 상품 카테고리
 *                      example: 과일
 *                    name:
 *                      type: string
 *                      description: 상품명
 *                      example: 사과
 *                    description:
 *                      type: string
 *                      description: 상품 상세 설명
 *                      example: 아주 맛있는 사과
 *                    price:
 *                      type: number
 *                      description: 상품 원가
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 판매 가격
 *                      example: 10000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 유저가 가진 상품 재고수
 *                      example: 20
 *                    maxPurchaseQty:
 *                      type: number
 *                      description: 유저가 가진 상품 재고수
 *                      example: 20
 *                    views:
 *                      type: number
 *                      description: 조회수
 *                      example: 3
 *      400:
 *        description: 상품 생성 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    code:
 *                      type: integer
 *                      description: http status
 *                      example: 400
 *                    message:
 *                      type: string
 *                      description: 오류 내용
 *                      example: 상품명을 입력해주세요.
 *                    detail:
 *                      type: object
 *                      description: 오류 세부 사항
 *                      properties:
 *                        msg:
 *                          type: string
 *                          description: 오류 내용
 *                          example: 상품명을 입력해주세요.
 *                        body:
 *                          type: string
 *                          description: 입력하지 않은 파라미터
 *                          example: name
 */
productRouter.post(
  "/products",
  login_required,
  // express-validator로 작동되지 않는,,, => try-catch로 변경
  //   body("category")
  //     .exists()
  //     .withMessage("카테고리를 입력해주세요.")
  //     .bail(),
  //   body("name")
  //     .exists()
  //     .withMessage("상품명을 입력해주세요.")
  //     .bail(),
  //   body("description")
  //     .exists()
  //     .withMessage("설명을 입력해주세요.")
  //     .bail(),
  //   body("price")
  //     .exists()
  //     .withMessage("가격을 입력해주세요.")
  //     .bail(),
  //   body("maxPurchaseQty")
  //     .exists()
  //     .withMessage("최소 수량을 입력해주세요.")
  //     .bail(),
  //   validate,
  // ],
  productImgUpload.fields([
    { name: "images", maxCount: 1 },
    { name: "descriptionImg", maxCount: 1 },
    { name: "detailImg", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const images = req.files["images"]?.[0].location ?? null;
      const descriptionImg = req.files["descriptionImg"]?.[0].location ?? null;
      const detailImg = req.files["detailImg"]?.[0].location ?? null;

      const {
        category,
        name,
        description,
        price,
        salePrice,
        minPurchaseQty,
        maxPurchaseQty,
        shippingFee,
        shippingFeeCon,
        detail,
        shippingInfo,
      } = req.body;

      const newProduct = await ProductService.addProduct({
        userId,
        images,
        category,
        name,
        description,
        descriptionImg,
        price,
        salePrice,
        minPurchaseQty,
        maxPurchaseQty,
        shippingFee,
        shippingFeeCon,
        detail,
        detailImg,
        shippingInfo,
      });

      const body = {
        success: true,
        payload: newProduct,
      };
  
      return res.status(201).json(body);
    } catch (err) { 
      next(err);
    }
  }
);

/**
 * @swagger
 * /products?category={category}:
 *   get:
 *    summary: 상품 조회 API
 *    description: 모든 상품 정보를 조회할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: query
 *        name: category
 *        schema:
 *          type: string
 *        required: true
 *        description: 쿼리가 없다면 모든 상품을 반환합니다.
 *    responses:
 *      200:
 *        description: 상품 조회 완료
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                payload:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      description: 유저 id
 *                      example: 12341234
 *                    id:
 *                      type: string
 *                      description: 상품 id
 *                      example: 00001
 *                    images:
 *                      type: string
 *                      description: 상품 이미지
 *                      example: 이미지
 *                    category:
 *                      type: string
 *                      description: 상품 카테고리
 *                      example: 과일
 *                    name:
 *                      type: string
 *                      description: 상품명
 *                      example: 사과
 *                    description:
 *                      type: string
 *                      description: 상품 상세 설명
 *                      example: 아주 맛있는 사과
 *                    price:
 *                      type: number
 *                      description: 상품 원가
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 판매 가격 
 *                      example: 5000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매 인원수
 *                      example: 5
 *                    maxPurchaseQty:
 *                      type: number
 *                      description: 유저가 가진 상품 재고수
 *                      example: 20
 *                    views:
 *                      type: number
 *                      example: 30
 */
// query : page, perPage, category, option(groups, salePrice, reviews, views)
productRouter.get(
  "/products",
  [
    query("page")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 page를 입력해주세요.")
      .bail(),
    query("perPage")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 perPage를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  async (req, res, next) => {
    const { page, perPage, category, option } = req.query;

    if (page <= 0 || perPage <= 0) { 
      const body = {
        success: false,
        errorMessage: "잘못된 페이지를 입력하셨습니다.",
      }
      
      return res.status(400).send(body);
    }

    // 카테고리 쿼리가 존재한다면 카테고리별 상품 조회
    if (category !== undefined) { 
      const productList = await ProductService.getProductCategoryList({
        category,
        option,
        page,
        perPage,
      });

    // 카테고리 이름이 존재하지 않는다면
    if (productList.errorMessage) { 
      const body = {
        success: false,
        error: productList.errorMessage,
      }

      return res.status(400).send(body);
    }

      // const body = {
      //   success: true,
      //   productList,
      // };
      
      return res.status(200).send(productList);
    } 

    // 카테고리 쿼리가 없다면 전체 상품 조회
    const productList = await ProductService.getProductList({ page, perPage });
    return res.status(200).send(productList);
  }
);

// query : page, perPage, search(검색어), option(groups, salePrice, reviews, views)
productRouter.get(
  "/products/search",
  // [ express-validator 왜 작동을 안할까,,?
  //   query("page")
  //     .trim()
  //     .isLength()
  //     .exists()
  //     .withMessage("query 값으로 page를 입력해주세요.")
  //     .bail(),
  //   query("perPage")
  //     .trim()
  //     .isLength()
  //     .exists()
  //     .withMessage("query 값으로 perPage를 입력해주세요.")
  //     .bail(),
  //   query("search")
  //     .trim()
  //     .isLength()
  //     .exists()
  //     .withMessage("query 값으로 search를 입력해주세요.")
  //     .bail(),
  //   notFoundValidate,
  //   validate,
  // ],
  async (req, res, next) => {
    try {
      const { page, perPage, search, option } = req.query;

      if (page <= 0 || perPage <= 0) {
        const body = {
          success: false,
          errorMessage: "잘못된 페이지를 입력하셨습니다.",
        }
        
        return res.status(400).send(body);
      }
      // search 쿼리가 없다면 오류
      if (!search) {
        const body = {
          success: false,
          errorMessage: "검색어를 입력해주세요",
        };
        
        return res.status(400).send(body);
      }

      // option 쿼리가 존재한다면 옵션에 맞게 상품 조회
      if (option !== undefined) {
        const productList = await ProductService.getProductSearchSortByOption({ search, option, page, perPage });
        
        // 맞지 않는 option이 들어왔다면
        if (productList.errorMessage) {
          const body = {
            success: false,
            errorMessage: productList.errorMessage,
          }
    
          return res.status(400).send(body);
        }

        return res.status(200).send(productList);
      } else { // 아니라면 최신순 정렬
        const productList = await ProductService.getProductSearch({ search, page, perPage });
        return res.status(200).send(productList);
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /products:
 *   put:
 *    summary: 상품 정보 수정 API
 *    description: 상품 정보를 수정할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    requestBody:
 *      x-name: body
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *            - images
 *            - name
 *            - description
 *            - price
 *            - salePrice
 *            - minPurchaseQty
 *            - maxPurchaseQty
 *            properties:
 *              images:
 *                type: string
 *                example: 사진
 *              category:
 *                type: string
 *                example: 과일
 *              name:
 *                type: string
 *                example: 사과
 *              description:
 *                type: string
 *                example: 아주 맛있는 사과
 *              price: 
 *                type: number
 *                example: 10000000
 *              salePrice:
 *                type: number
 *                description: 판매 가격
 *                example: 50000000
 *              minPurchaseQty:
 *                type: number
 *                example: 5
 *              maxPurchaseQty:
 *                type: number
 *                example: 2
 *    responses:
 *      200:
 *        description: 상품 수정 완료
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                payload:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      description: 유저 id
 *                      example: 12341234
 *                    id:
 *                      type: string
 *                      description: 상품 id
 *                      example: 00001
 *                    images:
 *                      type: string
 *                      description: 상품 이미지
 *                      example: 이미지
 *                    category:
 *                      type: string
 *                      description: 상품 카테고리
 *                      example: 과일
 *                    name:
 *                      type: string
 *                      description: 상품명
 *                      example: 사과
 *                    description:
 *                      type: string
 *                      description: 상품 상세 설명
 *                      example: 아주 맛있는 사과
 *                    price:
 *                      type: number
 *                      description: 상품 원가
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 판매 가격
 *                      example: 50000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공구 최소 인원
 *                      example: 5
 *                    maxPurchaseQty:
 *                      type: number
 *                      description: 유저가 가진 상품 재고수
 *                      example: 2
 *                    views:
 *                      type: number
 *                      example: 20
 *      400:
 *        description: 상품 수정 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    code:
 *                      type: integer
 *                      description: http status
 *                      example: 400
 *                    message:
 *                      type: string
 *                      description: 오류 내용
 *                      example: 상품명을 입력해주세요.
 *                    detail:
 *                      type: object
 *                      description: 오류 세부 사항
 *                      properties:
 *                        msg:
 *                          type: string
 *                          description: 오류 내용
 *                          example: 상품명을 입력해주세요.
 *                        body:
 *                          type: string
 *                          description: 입력하지 않은 파라미터
 *                          example: name
 */
productRouter.put(
  "/products/:id",
  login_required,
  [
    check("id")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 상품의 아이디를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  productImgUpload.fields([
    { name: "images", maxCount: 1 },
    { name: "descriptionImg", maxCount: 1 },
    { name: "detailImg", maxCount: 1 },
  ]),
  async (req, res, next) => {
    const userId = req.currentUserId;
    const id = req.params.id;
    const category = req.body.category ?? null;
    const name = req.body.name ?? null;
    const description = req.body.description ?? null;
    const price = req.body.price ?? null;
    const salePrice = req.body.salePrice ?? null;
    const minPurchaseQty = req.body.minPurchaseQty ?? null;
    const maxPurchaseQty = req.body.maxPurchaseQty ?? null;
    const shippingFee = req.body.shippingFee ?? null;
    const shippingFeeCon = req.body.shippingFeeCon ?? null;
    const detail = req.body.detail ?? null;
    const shippingInfo = req.body.shippingInfo ?? null;

    const images = req.files["images"]?.[0].location ?? null;
    const descriptionImg = req.files["descriptionImg"]?.[0].location ?? null;
    const detailImg = req.files["detailImg"]?.[0].location ?? null;

    const toUpdate = {
      category,
      images,
      name,
      description,
      descriptionImg,
      price,
      salePrice,
      minPurchaseQty,
      maxPurchaseQty,
      shippingFee,
      shippingFeeCon,
      detail,
      detailImg,
      shippingInfo,
    };

    const updatedProduct = await ProductService.setProduct({ userId, id, toUpdate });

    if (updatedProduct.errorMessage) { 
      const body = {
        success: false,
        error: updatedProduct.errorMessage,
      }

      return res.status(400).send(body);
    }

    const body = {
      success: true,
      payload: updatedProduct,
    }
    
    return res.status(200).send(body);
  }
);


/**
 * @swagger
 * /products/:id:
 *   get:
 *    summary: 상품 상세페이지 조회 API
 *    description: 상품 정보를 조회할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: 상품 글을 반환합니다.
 *    responses:
 *      200:
 *        description: 상품 조회
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                payload:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      description: 유저 id
 *                      example: 12341234
 *                    id:
 *                      type: string
 *                      description: 상품 id
 *                      example: 00001
 *                    images:
 *                      type: string
 *                      description: 상품 이미지
 *                      example: 이미지
 *                    category:
 *                      type: string
 *                      description: 상품 카테고리
 *                      example: 과일
 *                    name:
 *                      type: string
 *                      description: 상품명
 *                      example: 사과
 *                    description:
 *                      type: string
 *                      description: 상품 상세 설명
 *                      example: 아주 맛있는 사과
 *                    price:
 *                      type: number
 *                      description: 상품 원가
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 판매 가격
 *                      example: 5000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매 최소 인원
 *                      example: 5
 *                    maxPurchaseQty:
 *                      type: number
 *                      description: 유저가 가진 상품 재고수
 *                      example: 2
 *                    views:
 *                      type: number
 *                      description: 조회수
 *                      example: 20
 *      400:
 *        description: 상품 조회 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    code:
 *                      type: integer
 *                      description: http status
 *                      example: 400
 *                    errorMessage:
 *                      type: string
 *                      description: 오류 내용
 *                      example: id가 존재하지 않습니다.
 *
 */
productRouter.get(
  "/products/:id",
  [
    check("id")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 상품의 아이디를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  async (req, res, next) => { 
    const id = req.params.id;
    const product = await ProductService.getProduct({ id });

    // 아이디가 존재하지 않음
    if (product.errorMessage) {
      const body = {
        success: false,
        error: product.errorMessage,
      };
  
      return res.status(400).send(body);
    }

    const body = {
      success: true,
      payload: product,
    };

    return res.status(200).send(body);
  }
);

/**
 * @swagger
 * /products/:id:
 *   delete:
 *    summary: 상품 삭제 API
 *    description: 상품 정보를 삭제할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: 상품 글을 반환합니다.
 *    responses:
 *      200:
 *        description: 상품 삭제 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                payload:
 *                  type: string
 *                  example: 상품 삭제를 성공했습니다.
 *      400:
 *        description: 해당 상품이 존재하지 않을 경우
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    errorMessage:
 *                      type: string
 *                      description: 오류 내용
 *                      example: 해당 상품이 존재하지 않습니다.
 *      403:
 *        description: 다른 유저의 상품을 삭제할 때
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    errorMessage:
 *                      type: string
 *                      description: 오류 내용
 *                      example: 다른 유저의 상품을 삭제할 수 없습니다.
 * 
 */
productRouter.delete(
  "/products/:id",
  login_required,
  [
    check("id")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 상품의 아이디를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  async (req, res, next) => {
    const id = req.params.id;
    const userId = req.currentUserId;
    const product = await ProductService.getProduct({ id });
    
    // 해당 제품이 존재하지 않음
    if (product.errorMessage) {
      const body = {
        success: false,
        error: product.errorMessage,
      };
      
      return res.status(400).send(body);
    }
    
    const deletedProduct = await ProductService.deleteProduct({ userId, id });

    if (deletedProduct.errorMessage) {
      const body = {
        success: false,
        error: deletedProduct.errorMessage,
      };

      return res.status(403).send(body);
    }

    const body = {
      success: true,
      payload: "상품 삭제를 성공했습니다.",
    }

    return res.status(200).send(body);
  }
);

/**
 * @swagger
 * /markets/:userId:
 *   get:
 *    summary: 마트 API
 *    description: 유저가 가진 전체 상품 정보를 조회할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: 상품 리스트를 반환합니다.
 *    responses:
 *      200:
 *        description: 유저 상품 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                payload:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      description: 유저 id
 *                      example: 12341234
 *                    id:
 *                      type: string
 *                      description: 상품 id
 *                      example: 00001
 *                    images:
 *                      type: string
 *                      description: 상품 이미지
 *                      example: 이미지
 *                    category:
 *                      type: string
 *                      description: 상품 카테고리
 *                      example: 과일
 *                    name:
 *                      type: string
 *                      description: 상품명
 *                      example: 사과
 *                    description:
 *                      type: string
 *                      description: 상품 상세 설명
 *                      example: 아주 맛있는 사과
 *                    price:
 *                      type: number
 *                      description: 상품 원가
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 판매 가격
 *                      example: 50000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매 최소 인원
 *                      example: 5
 *                    maxPurchaseQty:
 *                      type: number
 *                      description: 유저가 가진 상품 재고수
 *                      example: 2
 *                    views:
 *                      type: number
 *                      description: 조회수
 *                      example: 20
 *      400:
 *        description: 상품 조회 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                error:
 *                  type: object
 *                  properties:
 *                    code:
 *                      type: integer
 *                      description: http status
 *                      example: 400
 *                    errorMessage:
 *                      type: string
 *                      description: 오류 내용
 *                      example: id가 존재하지 않습니다.
 *
 */
productRouter.get(
  "/markets/:userId",
  [
    check("userId")
      .trim()
      .isLength()
      .exists()
      .withMessage("parameter 값으로 유저의 아이디를 입력해주세요.")
      .bail(),
    notFoundValidate,
    validate,
  ],
  async (req, res, next) => { 
    const userId = req.params.userId;

    // 유저가 존재하는지 확인
    const user = await userAuthService.getUserInfo({ user_id: userId });

    // 유저가 존재하지 않는다면 에러
    if (user.errorMessage) { 
      const body = {
        success: false,
        error: user.errorMessage,
      };

      return res.status(400).send(body); 
    }

    // 존재한다면 유저가 판매하는 상품 목록 조회
    // 유저가 판매하는 상품이 없을 때는 에러메시지로 "해당 유저의 상품이 존재하지 않습니다"를 전달
    const productList = await ProductService.getUserProduct({ userId });

    const body = {
      success: true,
      payload: productList,
    };

    return res.status(200).send(body);
  }
);


export { productRouter };