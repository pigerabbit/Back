import { userService } from "../services/userService";
import { ProductService } from "../services/productService";
import { groupService } from "../services/groupService";
import { toggleService } from "../services/toggleService";
import { TopicService } from "../services/topicService";

const productController = {
  createProduct: async (req, res, next) => { 
    try {
      const userId = req.currentUserId;

      const {
        productType,
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
        dueDate,
      } = req.body;

      const newProduct = await ProductService.addProduct({
        userId,
        productType,
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
        dueDate,
      });

      const body = {
        success: true,
        payload: newProduct,
      };

      return res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  },

  getProductList: async (req, res, next) => { 
    const userId = req.currentUserId;

    const { page, perPage, category, option } = req.query;

    if (page <= 0 || perPage <= 0) {
      const body = {
        success: false,
        errorMessage: "잘못된 페이지를 입력하셨습니다.",
      };

      return res.status(400).send(body);
    }

    // 카테고리 쿼리가 존재한다면 카테고리별 상품 조회
    if (category !== undefined) {
      const resultList = await ProductService.getProductCategoryList({
        userId,
        category,
        option,
        page,
        perPage,
      });

      // 카테고리 이름이 존재하지 않는다면
      if (resultList.errorMessage) {
        const body = {
          success: false,
          error: resultList.errorMessage,
        };

        return res.status(400).send(body);
      }

      const body = {
        success: true,
        payload: resultList,
      };

      return res.status(200).send(body);
    }

    // 카테고리 쿼리가 없다면 전체 상품 조회

    const resultList = await ProductService.getProductList({
      userId,
      page,
      perPage,
    });

    const body = {
      success: true,
      payload: resultList,
    };

    return res.status(200).send(body);
  },

  getSearchProduct: async (req, res, next) => { 
    try {
      const userId = req.currentUserId;
      const { page, perPage, option } = req.query;
      let search = decodeURIComponent(req.query.search);

      if (page <= 0 || perPage <= 0) {
        const body = {
          success: false,
          errorMessage: "잘못된 페이지를 입력하셨습니다.",
        };

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

      await toggleService.setToggleSearchWord({ userId, toUpdate: { searchWord: search } });
      await TopicService.addTopic({ word: search });

      // option 쿼리가 존재한다면 옵션에 맞게 상품 조회
      if (option !== undefined) {
        let resultList = await ProductService.getProductSearchSortByOption({
          search,
          option,
          page,
          perPage,
          userId,
        });

        // 맞지 않는 option이 들어왔다면
        if (resultList.errorMessage) {
          const body = {
            success: false,
            errorMessage: resultList.errorMessage,
          };

          return res.status(400).send(body);
        }

        const body = {
          success: true,
          payload: resultList,
        };

        return res.status(200).send(body);
      } else {
        // 아니라면 최신순 정렬
        const resultList = await ProductService.getProductSearch({
          search,
          page,
          perPage,
        });
        const body = {
          success: true,
          payload: resultList,
        };

        return res.status(200).send(body);
      }
    } catch (err) {
      next(err);
    }
  },

  editProduct: async (req, res, next) => { 
    const userId = req.currentUserId;
    const id = req.params.id;
    const productType = req.body.productType ?? null;
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
    const dueDate = req.body.dueDate ?? null;

    const toUpdate = {
      productType,
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
      dueDate,
    };

    const updatedProduct = await ProductService.setProduct({
      userId,
      id,
      toUpdate,
    });

    if (updatedProduct.errorMessage) {
      const body = {
        success: false,
        error: updatedProduct.errorMessage,
      };

      return res.status(400).send(body);
    }

    const body = {
      success: true,
      payload: updatedProduct,
    };

    return res.status(200).send(body);
  },

  addProductImg: async (req, res, next) => { 
    try {
      const userId = req.currentUserId;
      const id = req.params.id;
      const images = req.file?.location ?? null;

      const toUpdate = {
        images,
      };

      const updatedProduct = await ProductService.setProduct({
        userId,
        id,
        toUpdate,
      });

      if (updatedProduct.errorMessage) {
        const body = {
          success: false,
          error: updatedProduct.errorMessage,
        };

        return res.status(updatedProduct.status).send(body);
      }

      const body = {
        success: true,
        payload: updatedProduct,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  addProductDescriptionImg: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const id = req.params.id;
      const descriptionImg = req.file?.location ?? null;

      const toUpdate = {
        descriptionImg,
      };

      const updatedProduct = await ProductService.setProduct({
        userId,
        id,
        toUpdate,
      });

      if (updatedProduct.errorMessage) {
        const body = {
          success: false,
          error: updatedProduct.errorMessage,
        };

        return res.status(updatedProduct.status).send(body);
      }

      const body = {
        success: true,
        payload: updatedProduct,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  addProductDetailImg: async (req, res, next) => {
    try {
      const userId = req.currentUserId;
      const id = req.params.id;
      const detailImg = req.file?.location ?? null;

      const toUpdate = {
        detailImg,
      };

      const updatedProduct = await ProductService.setProduct({
        userId,
        id,
        toUpdate,
      });

      if (updatedProduct.errorMessage) {
        const body = {
          success: false,
          error: updatedProduct.errorMessage,
        };

        return res.status(updatedProduct.status).send(body);
      }

      const body = {
        success: true,
        payload: updatedProduct,
      };

      return res.status(200).send(body);
    } catch (err) {
      next(err);
    }
  },

  getProduct: async (req, res, next) => {
    const userId = req.currentUserId;
    const id = req.params.id;
    const product = await ProductService.getProduct({ id, userId });

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
  },

  deleteProduct: async (req, res, next) => {
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

    await groupService.deleteProduct({ id, product });

    const body = {
      success: true,
      payload: "상품 삭제를 성공했습니다.",
    };

    return res.status(200).send(body);
  },

  getUserProducts: async (req, res, next) => { 
    const userId = req.params.userId;

    // 유저가 존재하는지 확인
    const user = await userService.getUserInfo({ userId });

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
    const resultList = await ProductService.getUserProduct({ userId });

    const body = {
      success: true,
      payload: resultList,
    };

    return res.status(200).send(body);
  },
};


export { productController };