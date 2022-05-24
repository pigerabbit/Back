import { Router } from "express";
import { ProductService } from "../services/productService";
import { validate, notFoundValidate } from "../middlewares/validator";
import { check, body } from "express-validator";

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
 *                example: 굉장나 엄청해
 *              name:
 *                type: string
 *                example: 징
 *              description:
 *                type: string
 *                example: 굉장나 엄청해 징
 *              price: 
 *                type: number
 *                example: 10000000
 *              minPurchaseQty:
 *                type: number
 *                example: 2
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
 *                      example: 굉장나 엄청해
 *                    name:
 *                      type: string
 *                      description: 상품명
 *                      example: 징
 *                    description:
 *                      type: string
 *                      description: 상품 상세 설명
 *                      example: 굉장나 엄청해 징
 *                    price:
 *                      type: number
 *                      description: 상품 가격
 *                      example: 10000000
 *                    minPurchaseQty:
 *                      type: number
 *                      description: 공동구매가 진행될 최소 인원
 *                      example: 2
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
  upload.array("images", 3),
  [
    body("content")
      .exists()
      .withMessage("")
  ],
  async (req, res, next) => { 
    const userId = req.current.userId;
    const { category, name, description, price, minPurchaseQty } = req.body;
    // 이미지 const images = 

    const newProduct = await ProductService.addProduct({
      userId,
      images,
      category,
      name,
      description,
      price,
      minPurchaseQty,
    });

    const body = {
      success: true,
      payload: newProduct,
    };

    return res.status(201).json(body);
  }
);

productRouter.put(
  "/products/:id",
  login_required,
  upload.array("images", 3),
  [],
  async (req, res, next) => {
    const id = req.params.id;
    // 사진 const images = 
    const category = req.body.category ?? null;
    const name = req.body.name ?? null;
    const description = req.body.description ?? null;
    const price = req.body.price ?? null;
    const minPurchaseQty = req.body.minPurchaseQty ?? null;

    const toUpdate = { category, name, description, price, minPurchaseQty };

    const product = await ProductService.setProduct({ id, toUpdate });
    
    res.status(200).send(product);
  }
);

productRoutet.get(
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

    const body = {
      success: true,
      payload: product,
    };

    return res.status(200).send(body);
  }
);

productRoutet.get(
  "/products",
  async (req, res, next) => {
    const category = req.query.category;
    const products = await ProductService.getProductList({ category });

    const body = {
      success: true,
      payload: products,
    };
    
    return res.status(200).send(body);
  }
);