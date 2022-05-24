import { Product } from "../db/index.js";
import crypto from "crypto";

class ProductService { 
  /** 판매 상품 생성 함수
   * 
   * @param {Strings} userId - 유저 Id
   * @param {Strings} images - 이미지
   * @param {Strings} category - 상품 카테고리
   * @param {Strings} name - 상품 이름
   * @param {Strings} description - 상품 설명
   * @param {Number} price - 가격
   * @param {Number} minPurchaseQty - 최소 수량
   * @return {Object} 생성된 상품 정보 
   */
  static async addProduct({ userId, images, category, name, description, price, salePrice, minPurchaseQty, dueDate }) { 
    const id = crypto.randomUUID();
    
    const newProduct = {
      userId,
      id,
      category,
      images,
      name,
      description,
      price,
      salePrice,
      minPurchaseQty,
      dueDate,
    };

    const product = await Product.create({ newProduct });
    return product;
  }

  /** 상품 정보 수정 함수
   * @param {uuid} id - 상품 id
   * @param {Object} toUpdate - 수정할 상품 내용
   * @return {Object} 수정된 상품 정보
   */
  static async setProduct({ userId, id, toUpdate }) { 
    let product = await Product.findProduct({ id });

    if (!product) {
      const errorMessage = "해당 제품이 존재하지 않습니다.";
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

    return updatedProduct;
  }

  /** 상품 전체를 반환하는 함수
   * 
   * @returns 상품 전체 Object List
   */
  static async getProductList() { 
    const productList = await Product.findProductList();
    return productList;
  }

  /** 카테고리별 상품을 반환하는 함수
   * 
   * @returns 카테고리별 상품 Object List
   */
  static async getProductCategoryList({ category }) { 
    const productList = await Product.findProductCategoryList({ category });

    if (productList.length === 0) { 
      const errorMessage = "해당 카테고리 상품이 존재하지 않습니다";
      return { errorMessage };
    }

    return productList;
  }

  /** 상품 id와 일치하는 상품을 반환하는 함수
   * 
   * @param {Strings} id - 상품 id 
   * @returns 상품 Object
   */
  static async getProduct({ id }) { 
    const product = await Product.findProduct({ id });

    if (!product) {
      const errorMessage = "해당 제품이 존재하지 않습니다.";
      return { errorMessage };
    }

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