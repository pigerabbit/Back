import { Product } from "../db/index.js";
import { User } from "../db/index.js";
import crypto from "crypto";
import { getRequiredInfoFromProductData } from "../utils/product";

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
   */
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
    
    const newProduct = {
      id,
      userId,
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

    const product = await Product.create({ newProduct });
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
    const resultProduct = getRequiredInfoFromProductData(updatedProduct);

    return { resultProduct };
  }

  /** 상품 전체를 반환하는 함수
   * 
   * @returns 상품 전체 Object List
   */
  static async getProductList({ page, perPage }) { 
    const productList = await Product.findProductList({ page, perPage });
    return productList;
  }

  /** 카테고리별 상품을 반환하는 함수
   * 
   * @returns 카테고리별 상품 Object List
   */
  static async getProductCategoryList({
    category,
    option,
    page,
    perPage,
  }) { 
    const productList = await Product.findProductCategoryList({ category, option, page, perPage });

    if (productList.len === 0) { 
      const errorMessage = "해당 카테고리 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    if (option === "groups") {
      const productList = await Product.findProductSortByGroups({ category, page, perPage });
      if (productList)
      return productList;
    } else if (option === "reviews") {
      const productList = await Product.findProductSortByReviews({ category, page, perPage });
      return productList;
    } else if (option === "views") {
      const productList = await Product.findProductSortByViews({ category, page, perPage });
      return productList;
    } else if (option === "salePrice") {
      const productList = await Product.findProductSortByPrice({ category, page, perPage });
      return productList;
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
    const productList = await Product.findProductSearch({ search, page, perPage });
  
    if (productList.len === 0) { 
      const errorMessage = "검색한 상품이 존재하지 않습니다";
      return { errorMessage };
    }
  
    return productList;
  }

  /** 검색어 + 옵션별로 상품을 반환하는 함수
   * 
   * optionField = ["salePrice", "reviews", "views", "likes"]
   * @returns 검색어 + 옵션 상품 Object List
   */
  static async getProductSearchSortByOption({ search, option, page, perPage }) { 

    // 검색어에 해당하는 상품이 존재하는지 확인
    const product = await Product.findProductSearch({ search, page, perPage });

    if (product.len === 0) { 
      const errorMessage = "검색한 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    if (option === "groups") {
      const productList = await Product.findProductSearchSortByGroups({ search, page, perPage });
      if (productList)
      return productList;
    } else if (option === "reviews") {
      const productList = await Product.findProductSearchSortByReviews({ search, page, perPage });
      return productList;
    } else if (option === "views") {
      const productList = await Product.findProductSearchSortByViews({ search, page, perPage });
      return productList;
    } else if (option === "salePrice") {
      const productList = await Product.findProductSearchSortByPrice({ search, page, perPage });
      return productList;
    } else {
      const errorMessage = "존재하지 않는 옵션입니다.";
      return { errorMessage };
    }
  }

  /** 상품 id와 일치하는 상품을 삭제하는 함수
   * 
   * @param {Strings} id - 상품 id 
   * @returns 상품 Object
   */
  static async getProduct({ id }) { 
    const product = await Product.findProduct({ id });

    if (!product) {
      const errorMessage = "해당 상품이 존재하지 않습니다.";
      return { errorMessage };
    }

    const toUpdate = {
      views: product.views + 1,
    };

    const updatedProduct = await Product.update({ id, toUpdate });
    const resultProduct = getRequiredInfoFromProductData(updatedProduct);

    return { resultProduct };
  }

  static async deleteProduct({ userId, id }) { 
    const product = await Product.findProduct({ id });

    if (product.userId !== userId) { 
      const errorMessage = "다른 유저의 상품을 삭제할 수 없습니다.";
      return { errorMessage };
    }
    
    await Product.deleteProduct({ id });

    return product;
  }
  
  
  /** 유저가 파는 상품 리스트 반환하는 함수
   * 
   * @param {Strings} userId - 유저 id 
   * @returns 상품 Object
   */
  static async getUserProduct({ userId }) { 
    const product = await Product.findUserProduct({ userId });

    if (product.length === 0) {
      const errorMessage = "해당 유저의 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    return product;
  }
}

export { ProductService };