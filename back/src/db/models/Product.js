import { ProductModel } from "../schemas/product.js";

class Product { 
  /** 상품 오브젝트 생성 함수
   * 
   * @param {Object} newProduct- 생성될 상품 Object 
   * @return {Object} createdNewProduct
   */
  static async create({ newProduct }) { 
    const createdNewProduct = await ProductModel.create(newProduct);
    return createdNewProduct;
  }

  /** 상품 id로 상품 정보를 얻는 함수
   * 
   * @param {uuid} id - 상품 id 
   * @returns 
   */
   static async findProduct({ id }) { 
    const product = await ProductModel.findOne({ id });
    return product;
  }

  /** 상품 오브젝트 수정 함수
   * 
   * @param {Object} newProduct- 수정할 상품 Object 
   * @return {Object} updatedProduct
   */
  static async update({ id, toUpdate }) { 
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: id },
      { $set: toUpdate },
      { returnOriginal: false },
    );
    return updatedProduct;
  }

  /** 전체 상품 반환 함수
   * 
   * @returns productList
   */
  static async findProductList() { 
    const productList = await ProductModel.find();
    return productList;
  }

  //! 카테고리 한글로 지원하는 부분 추가 필요!!
  /** 카테고리별 상품 반환 함수
   * 
   * @returns productList
   */
  static async findProductCategoryList({ category }) { 
    const productList = await ProductModel.find({ category: category }); 
    return productList;
  }

  static async deleteProduct({ id }) { 
    const product = await ProductModel.deleteOne({ id });
    return product;
  }

  /** 유저가 판매하는 상품 리스트 반환 함수
   * 
   * @param {uuid} userId - 유저 id 
   * @returns productList
   */
  static async findUserProduct({ userId }) { 
    const productList = await ProductModel.find({ userId: userId });
    return productList;
  }
}

export { Product };