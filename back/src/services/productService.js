import { Product } from "../db/index.js";
import { User } from "../db/index.js";
import { Post } from "../db/index.js";
import { Group } from "../db/index.js";
import crypto from "crypto";
import { getRequiredInfoFromProductData } from "../utils/product";
import { ToggleModel } from "../db/schemas/toggle.js";
import { productsWithToggleInfo } from "../utils/productsWithToggleInfo";

class ProductService {
  /** 판매 상품 생성 함수
   * 
   * @param {Strings} userId - 유저 Id
   * @param {Strings} images - 이미지
   * @param {Strings} category - 상품 카테고리
   * @param {Strings} name - 상품 이름
   * @param {Strings} description - 상품 설명
   * @param {Strings} descriptionImg - 상품 설명 사진
   * @param {Number} price - 상품 원가
   * @param {Number} salePrice - 판매 가격
   * @param {Number} minPurchaseQty - 공동구매 최소 인원
   * @param {Number} maxPurchaseQty - 유저가 가진 상품 재고
   * @param {Number} shippingFee - 배송비
   * @param {Number} shippingFeeCon - 무료 배송 조건
   * @param {Strings} detail - 상품 상세 설명
   * @param {Strings} detailImg - 상품 상세 설명 사진
   * @param {Strings} shippingInfo - 배송 안내
   * @return {Object} 생성된 상품 정보 
   
  static async addProduct({
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
    shippingInfo
  }) { 
    const id = crypto.randomUUID();
    const discountRate = Math.ceil(((price - salePrice) / price) * 100);
    const user = await User.findById({ userId });
    const userInfo = user._id;

    const newProduct = {
      id,
      userId,
      userInfo,
      images,
      category,
      name,
      description,
      descriptionImg,
      price,
      salePrice,
      discountRate,
      minPurchaseQty,
      maxPurchaseQty,
      shippingFee,
      shippingFeeCon,
      detail,
      detailImg,
      shippingInfo,
    };

    let product = await Product.create({ newProduct });
    product = await Product.findProduct({ id });
    const resultProduct = getRequiredInfoFromProductData(product);

    return { resultProduct };
  }

  /** 상품 정보 수정 함수
   * @param {uuid} id - 상품 id
   * @param {Object} toUpdate - 수정할 상품 내용
   * @return {Object} 수정된 상품 정보
   */
  static async setProduct({ userId, id, toUpdate }) {
    let product = await Product.findProduct({ id });

    if (!product) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (product.userId !== userId) {
      const errorMessage = "해당 상품을 판매하는 유저만 수정이 가능합니다.";
      return { errorMessage };
    }

    Object.keys(toUpdate).forEach((key) => {
      if (toUpdate[key] === undefined || toUpdate[key] === null) {
        delete toUpdate[key];
      }
    });

    const updatedProduct = await Product.update({ id, toUpdate });
    product = await Product.findProduct({ id });
    const resultProduct = getRequiredInfoFromProductData(product);

    return { resultProduct };
  }

  /** 상품 전체를 반환하는 함수
   *
   * @returns 상품 전체 Object List
   */
  static async getProductList({ userId, page, perPage }) {
    const resultList = await Product.findProductList({ page, perPage });

    resultList = await productsWithToggleInfo(userId, productList.resultList);

    return resultList;
  }

  /** 공구 상품 top 10을 반환하는 함수
   *
   * @returns 상품 전체 Object List
   */
  static async getProductTopList(userId) {
    const top = 10;
    const groupList = await Group.findProductSortByGroups();
    const products = await Product.findProductListNoPage();
    let resultList = [];
    console.log("groupList :", groupList);
    for (let i = 0; i < groupList.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (groupList[i].id === products[j].id) {
          resultList.push(products[j]);
          delete products[j];
        }
      }
    }

    for (let i = 0; i < products.length; i++) {
      resultList.push(products[i]);
    }

    resultList = resultList.slice(0, top);

    resultList = await productsWithToggleInfo(userId, resultList);

    return resultList;
  }

  /** 카테고리별 상품을 반환하는 함수
   *
   * @returns 카테고리별 상품 Object List
   */
  static async getProductCategoryList({
    userId,
    category,
    option,
    page,
    perPage,
  }) {
    const productList = await Product.findProductCategoryList({
      category,
      option,
      page,
      perPage,
    });

    if (productList.len === 0) {
      const errorMessage = "해당 카테고리 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    if (option === "groups") {
      const groupList = await Group.findProductSortByGroups();
      const productList = await Product.findProductSortByReviews({
        category,
        page,
        perPage,
      });
      let resultList = [];

      for (let i = 0; i < groupList.length; i++) {
        for (let j = 0; j < productList.resultList.length; j++) {
          if (groupList[i].id === productList.resultList[j].id) {
            resultList.push(productList.resultList[j]);
            delete productList.resultList[j];
          }
        }
      }

      for (let i = 0; i < productList.resultList.length; i++) {
        if (productList.resultList[i] !== undefined) {
          resultList.push(productList.resultList[i]);
        }
      }

      const totalPage = productList.totalPage;
      const len = productList.len;

      resultList = await productsWithToggleInfo(userId, productList.resultList);

      return { resultList, totalPage, len };
    } else if (option === "reviews") {
      const reviewList = await Post.findProductSortByReviews();
      let productList = await Product.findProductSortByReviews({
        category,
        page,
        perPage,
      });

      let resultList = [];

      for (let i = 0; i < reviewList.length; i++) {
        for (let j = 0; j < productList.resultList.length; j++) {
          if (reviewList[i].id === productList.resultList[j].id) {
            resultList.push(productList.resultList[j]);
            delete productList.resultList[j];
          }
        }
      }

      for (let i = 0; i < productList.resultList.length; i++) {
        if (productList.resultList[i] !== undefined) {
          resultList.push(productList.resultList[i]);
        }
      }
      const totalPage = productList.totalPage;
      const len = productList.len;

      resultList = await productsWithToggleInfo(userId, productList.resultList);

      return { resultList, totalPage, len };
    } else if (option === "views") {
      let resultList = await Product.findProductSortByViews({
        category,
        page,
        perPage,
      });

      resultList = await productsWithToggleInfo(userId, productList.resultList);

      return { resultList };
    } else if (option === "salePrice") {
      let resultList = await Product.findProductSortByPrice({
        category,
        page,
        perPage,
      });

      resultList = await productsWithToggleInfo(userId, productList.resultList);

      return { resultList };
    } else {
      const errorMessage = "존재하지 않는 옵션입니다.";
      return { errorMessage };
    }
  }

  /** 검색어로 상품을 반환하는 함수
   *
   * @returns 검색어 상품 Object List
   */
  static async getProductSearch({ search, page, perPage }) {
    let resultList = await Product.findProductSearch({
      search,
      page,
      perPage,
    });

    if (resultList.len === 0) {
      const errorMessage = "검색한 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    resultList = await productsWithToggleInfo(userId, productList.resultList);

    return resultList;
  }

  /** 검색어 + 옵션별로 상품을 반환하는 함수
   *
   * optionField = ["salePrice", "reviews", "views", "likes"]
   * @returns 검색어 + 옵션 상품 Object List
   */
  static async getProductSearchSortByOption({
    search,
    option,
    page,
    perPage,
    userId,
  }) {
    // 검색어에 해당하는 상품이 존재하는지 확인
    const product = await Product.findProductSearch({ search, page, perPage });

    if (product.len === 0) {
      const errorMessage = "검색한 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    if (option === "groups") {
      const reviewList = await Group.findProductSortByGroups();
      const productList = await Product.findProductSearchSortByGroups({
        search,
        page,
        perPage,
      });
      let resultList = [];

      for (let i = 0; i < reviewList.length; i++) {
        for (let j = 0; j < productList.resultList.length; j++) {
          if (reviewList[i].id === productList.resultList[j].id) {
            resultList.push(productList.resultList[j]);
            delete productList.resultList[j];
          }
        }
      }

      for (let i = 0; i < productList.resultList.length; i++) {
        if (productList.resultList[i] !== undefined) {
          resultList.push(productList.resultList[i]);
        }
      }

      const totalPage = productList.totalPage;
      const len = productList.len;

      resultList = await productsWithToggleInfo(userId, productList.resultList);

      return { resultList, totalPage, len };
    } else if (option === "reviews") {
      const reviewList = await Post.findProductSortByReviews();
      const productList = await Product.findProductSearchSortByReviews({
        search,
        page,
        perPage,
      });
      let resultList = [];

      for (let i = 0; i < reviewList.length; i++) {
        for (let j = 0; j < productList.resultList.length; j++) {
          if (reviewList[i].id === productList.resultList[j].id) {
            resultList.push(productList.resultList[j]);
            delete productList.resultList[j];
          }
        }
      }

      for (let i = 0; i < productList.resultList.length; i++) {
        if (productList.resultList[i] !== undefined) {
          resultList.push(productList.resultList[i]);
        }
      }

      const totalPage = productList.totalPage;
      const len = productList.len;

      resultList = await productsWithToggleInfo(userId, productList.resultList);

      return { resultList, totalPage, len };
    } else if (option === "views") {
      let resultList = await Product.findProductSearchSortByViews({
        search,
        page,
        perPage,
      });
      console.log("resultList:", resultList);
      resultList = await productsWithToggleInfo(userId, resultList.resultList);

      return resultList;
    } else if (option === "salePrice") {
      let resultList = await Product.findProductSearchSortByPrice({
        search,
        page,
        perPage,
      });
      console.log("resultList:", resultList);
      resultList = await productsWithToggleInfo(userId, resultList.resultList);

      return resultList;
    } else {
      const errorMessage = "존재하지 않는 옵션입니다.";
      return { errorMessage };
    }
  }

  /** 상품 id와 일치하는 상품을 조회하는 함수
   *
   * @param {Strings} id - 상품 id
   * @returns 상품 Object
   */
  static async getProduct({ id, userId }) {
    let product = await Product.findProduct({ id });

    if (!product) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    if (product.removed) {
      const errorMessage = "삭제된 상품입니다.";
      return { errorMessage };
    }

    const toUpdate = {
      views: product.views + 1,
    };

    await Product.update({ id, toUpdate });
    product = await Product.findProduct({ id });
    let resultProduct = getRequiredInfoFromProductData(product);

    const resultList = await productsWithToggleInfo(userId, [resultProduct]);

    return resultProduct;
  }

  /** 상품 id와 일치하는 상품을 삭제하는 함수
   *
   * @param {Strings} id - 상품 id
   * @returns 상품 Object
   */
  static async deleteProduct({ userId, id }) {
    const product = await Product.findProduct({ id });

    if (product.userId !== userId) {
      const errorMessage = "다른 유저의 상품을 삭제할 수 없습니다.";
      return { errorMessage };
    }

    const toUpdate = {
      removed: true,
    };

    await Product.update({ id, toUpdate });

    return product;
  }

  /** 유저가 파는 상품 리스트 반환하는 함수
   *
   * @param {Strings} userId - 유저 id
   * @returns 상품 Object
   */
  static async getUserProduct({ userId }) {
    const resultList = await Product.findUserProduct({ userId });

    resultList = await productsWithToggleInfo(userId, productList.resultList);

    return resultList;
  }
}

export { ProductService };
