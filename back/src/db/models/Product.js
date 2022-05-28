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
  static async findProductList({ page, perPage }) { 
    const len = await ProductModel.countDocuments();
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
    
    return { productList, totalPage, len };
  }

  /** 카테고리별 상품 반환 함수
   * 
   * @returns productList
   */
  static async findProductCategoryList({ category, page, perPage }) { 
    const len = await ProductModel.countDocuments({ category });
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({ category })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();
    
    return { productList, totalPage, len };
  }

  static async deleteProduct({ id }) { 
    const product = await ProductModel.deleteOne({ id });
    return product;
  }
  
  /** 상품 id 반환 함수 for 쨍
   * 
   * @returns productIdList
   */
  static async findProductIdList() { 
    const productList = await ProductModel.find();
    const productIdList = productList.map(obj => obj.id)
    return productIdList;
  }

  /** 검색어별 상품 반환 함수
   * 
   * @returns productList
   */
   static async findProductSearch({ search, page, perPage }) { 
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({ name: { $regex: search } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
    
    return { productList, totalPage, len };
  }

  /** 검색어 + 열린 공동 구매 많은순 상품 반환 함수 (default)
   * 
   * @returns productList
   */
   static async findProductSearchSortByGroups({ search, page, perPage }) { 
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({ name: { $regex: search } })
      .sort({ groups: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
   
    return { productList, totalPage, len };
  }
  
  /** 검색어 + 낮은 가격순 상품 반환 함수
   * 
   * @returns productList
   */
  static async findProductSearchSortByPrice({ search, page, perPage }) { 
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({ name: { $regex: search } })
      .sort({ salePrice: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
   
    return { productList, totalPage, len };
  }

  /** 검색어 + 후기 많은순 상품 반환 함수
   * 
   * @returns productList
   */
   static async findProductSearchSortByReviews({ search, page, perPage }) { 
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({ name: { $regex: search } })
      .sort({ reviews: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
   
    return { productList, totalPage, len };
  }

  /** 검색어 + 조회 많은순 상품 반환 함수
   * 
   * @returns productList
   */
   static async findProductSearchSortByViews({ search, page, perPage }) { 
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({ name: { $regex: search } })
      .sort({ views: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean()
   
    return { productList, totalPage, len };
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