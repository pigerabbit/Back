import { Router } from "express";
import { ProductService } from "../services/productService";
import { validate, notFoundValidate } from "../middlewares/validator";
import { check, body } from "express-validator";
import { login_required } from "../middlewares/login_required";
import { upload } from "../middlewares/multerMiddleware.js";
import { userAuthService } from "../services/userService";

const productRouter = Router();

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: Products MVP.
 */
/**
 * @swagger
 * /products:
 *   post:
 *    summary: 상품 API
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
 *            - minPurchaseQty
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
 *              dueDate:
 *                type: Date
 *                example: 2022-05-24
 *    responses:
 *      201:
 *        description: 상품 생성
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      description: 상품 가격
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 할인된 상품 가격
 *                      example: 10000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매가 진행될 최소 인원
 *                      example: 2
 *                    dueDate:
 *                      type: Date
 *                      example: 2022-05-24
 *      400:
 *        description: 상품 생성 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      example: 이름을 입력해주세요.
 *                    detail:
 *                      type: object
 *                      description: 오류 세부 사항
 *                      properties:
 *                        msg:
 *                          type: string
 *                          description: 오류 내용
 *                          example: 이름을 입력해주세요.
 *                        body:
 *                          type: string
 *                          description: 입력하지 않은 파라미터
 *                          example: name
 */
productRouter.post(
  "/products",
  login_required,
  // [ express-validator가 있으면 작동되지 않는,,, => try-catch로 변경
  //   body("category")
  //     .exists()
  //     .withMessage("카테고리를 입력해주세요.")
  //     .bail(),
  //   body("name")
  //     .exists()
  //     .withMessage("이름을 입력해주세요.")
  //     .bail(),
  //   body("description")
  //     .exists()
  //     .withMessage("설명을 입력해주세요.")
  //     .bail(),
  //   body("price")
  //     .exists()
  //     .withMessage("가격을 입력해주세요.")
  //     .bail(),
  //   body("minPurchaseQty")
  //     .exists()
  //     .withMessage("최소 수량을 입력해주세요.")
  //     .bail(),
  //   validate,
  // ],
  upload.array("images", 3),
  async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { category, name, description, price, salePrice, minPurchaseQty, dueDate } = req.body;
      
      if (req.files != null) { // 이미지 파일이 존재하면
        const images = req.files.map((file) => file.filename);

        const newProduct = await ProductService.addProduct({
          userId,
          images,
          category,
          name,
          description,
          price,
          salePrice,
          minPurchaseQty,
          dueDate,
        });

        const body = {
          success: true,
          payload: newProduct,
        };
    
        return res.status(201).json(body);

      } else { // 이미지 파일이 존재하지 않는다면
        const newProduct = await ProductService.addProduct({
          userId,
          category,
          name,
          description,
          price,
          salePrice,
          minPurchaseQty,
          dueDate,
        });

        const body = {
          success: true,
          payload: newProduct,
        };
    
        return res.status(201).json(body);
      }
    } catch (err) { 
      next(err);
    }
  }
);

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: Products MVP.
 */
/**
 * @swagger
 * /products:
 *   put:
 *    summary: 상품 API
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
 *            - minPurchaseQty
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
 *                description: 할인된 상품 가격
 *                example: 50000000
 *              minPurchaseQty:
 *                type: number
 *                example: 2
 *              dueDate:
 *                type: Date
 *                example: 2022-05-24
 *    responses:
 *      200:
 *        description: 상품 수정 완료
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      description: 원래 상품 가격
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 할인된 상품 가격
 *                      example: 50000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매가 진행될 최소 인원
 *                      example: 2
 *                    dueDate:
 *                      type: Date,
 *                      example: 2022-05-24
 *      400:
 *        description: 상품 수정 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      example: 이름을 입력해주세요.
 *                    detail:
 *                      type: object
 *                      description: 오류 세부 사항
 *                      properties:
 *                        msg:
 *                          type: string
 *                          description: 오류 내용
 *                          example: 이름을 입력해주세요.
 *                        body:
 *                          type: string
 *                          description: 입력하지 않은 파라미터
 *                          example: name
 */
productRouter.put(
  "/products/:id",
  login_required,
  upload.array("images", 3),
  [],
  async (req, res, next) => {
    const id = req.params.id;
    const category = req.body.category ?? null;
    const name = req.body.name ?? null;
    const description = req.body.description ?? null;
    const price = req.body.price ?? null;
    const salePrice = req.body.salePrice ?? null;
    const minPurchaseQty = req.body.minPurchaseQty ?? null;
    const dueDate = req.body.dueDate ?? null;

    if (req.files != null) {
      const images = req.files.map((file) => file.filename);
      const toUpdate = { category, images, name, description, price, salePrice, minPurchaseQty, dueDate };

      const product = await ProductService.setProduct({ id, toUpdate });
      
      res.status(200).send(product);
    } else { 
      const toUpdate = { category, images, name, description, price, salePrice, minPurchaseQty, dueDate };

      const product = await ProductService.setProduct({ id, toUpdate });
      
      res.status(200).send(product);
    }
  }
);

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: Products MVP.
 */
/**
 * @swagger
 * /products?category={category}:
 *   get:
 *    summary: 상품 API
 *    description: 모든 상품 정보를 조회할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: query
 *        name: category
 *        schema:
 *          type: string
 *        required: true
 *        description: 모든 상품을 반환합니다.
 *    responses:
 *      200:
 *        description: 상품 조회 완료
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      description: 상품 가격
 *                      example: 10000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매가 진행될 최소 인원
 *                      example: 2
 *                    dueDate:
 *                      type: Date,
 *                      example: 2022-05-24
 */
productRouter.get(
  "/products",
  async (req, res, next) => {
    const category = req.query.category;

    if (category !== undefined) { // 쿼리가 없다면 전체 상품 조회
      const products = await ProductService.getProductCategoryList({ category });

      const body = {
        success: true,
        payload: products,
      };
      
      return res.status(200).send(body);
    } 

    const products = await ProductService.getProductList();

    const body = {
      success: true,
      payload: products,
    };
    
    return res.status(200).send(body);
  }
);

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: Products MVP.
 */
/**
 * @swagger
 * /products/:id:
 *   get:
 *    summary: 상품 API
 *    description: 상품 정보를 조회할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: query
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
 *                  type: string
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
 *                      description: 상품 가격
 *                      example: 10000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매가 진행될 최소 인원
 *                      example: 2
 *                    dueDate:
 *                      type: Date
 *                      description: 공동구매 마감일
 *                      example: 2022-05-24
 *      400:
 *        description: 상품 조회 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      example: id가 존재하지 않습니다.
 *                    detail:
 *                      type: string
 *                      description: id가 존재하지 않습니다.
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

    if (product.errorMessage) {
      const body = {
        success: false,
        payload: product,
      };
  
      return res.status(200).send(body);
    }

    const body = {
      success: true,
      payload: product,
    };

    return res.status(200).send(body);
  }
);

//! 삭제 만듭시다아!
// DELETE /products/:id

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: Products MVP.
 */
/**
 * @swagger
 * /markets/:userId:
 *   get:
 *    summary: 마트 API
 *    description: 유저가 가진 전체 상품 정보를 조회할 때 사용하는 API 입니다.
 *    tags: [Products]
 *    parameters:
 *      - in: query
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
 *                  type: string
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
 *                      description: 상품 가격
 *                      example: 10000000
 *                    salePrice:
 *                      type: number
 *                      description: 상품 가격
 *                      example: 50000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매가 진행될 최소 인원
 *                      example: 2
 *                    dueDate:
 *                      type: Date
 *                      description: 공동구매 마감 인원
 *      400:
 *        description: 상품 조회 오류
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: string
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
 *                      example: id가 존재하지 않습니다.
 *                    detail:
 *                      type: string
 *                      description: id가 존재하지 않습니다.
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

    // 존재하지 않는다면 에러
    if (user.errorMessage) { 
      const body = {
        success: false,
        message: "존재하지 않는 유저입니다.",
      };

      return res.status(400).send(body); 
    }

    // 존재한다면 유저가 판매하는 상품 목록 조회 : 빈 배열일 때는 상품을 팔지 X
    const productList = await ProductService.getUserProduct({ userId });

    const body = {
      success: true,
      payload: productList,
    };

    return res.status(200).send(body);
  }
);


export { productRouter };