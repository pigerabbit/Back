import { Router } from "express";
import { ProductService } from "../services/productService";
import { validate, notFoundValidate } from "../middlewares/validator";
import { check, body } from "express-validator";
import { login_required } from "../middlewares/login_required";
import { upload } from "../middlewares/multerMiddleware.js";
import { userAuthService } from "../services/userService";

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
  // express-validator가 있으면 작동되지 않는,,, => try-catch로 변경
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
  upload.array("images", 3),
  async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const { category, name, description, price, salePrice, minPurchaseQty, maxPurchaseQty } = req.body;
      
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
          maxPurchaseQty,
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
          maxPurchaseQty,
          views,
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

    const productList = await ProductService.getProductList();

    if (productList.errorMessage) { 
      const body = {
        success: true,
        payload: productList,
      };
      
      return res.status(200).send(body);
    }

    const body = {
      success: true,
      payload: productList,
    };
    
    return res.status(200).send(body);
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
  upload.array("images", 3),
  [],
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

    if (req.files != null) { // 변경 이미지가 존재하면
      const images = req.files.map((file) => file.filename);
      const toUpdate = { category, images, name, description, price, salePrice, minPurchaseQty, maxPurchaseQty };

      const product = await ProductService.setProduct({ userId, id, toUpdate });
      
      res.status(200).send(product);
    } else { // 변경 이미지가 존재하지 않는다면
      const toUpdate = { category, name, description, price, salePrice, minPurchaseQty, maxPurchaseQty };

      const updatedProduct = await ProductService.setProduct({ userId, id, toUpdate });

      const body = {
        success: true,
        payload: updatedProduct,
      }
      
      return res.status(200).send(body);
    }
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
        error: product,
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
        error: product,
      };
      
      return res.status(400).send(body);
    }
    
    const deletedProduct = await ProductService.deleteProduct({ userId, id });

    if (deletedProduct.errorMessage) {
      const body = {
        success: false,
        error: deletedProduct,
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
        error: user,
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