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
    const product = await ProductModel.findOne({ id }).populate(
      "userInfo",
      "business"
    );
    return product;
  }

  /** 상품 오브젝트 수정 함수
   *
   * @param {Object} newProduct- 수정할 상품 Object
   * @return {Object} updatedProduct
   */
  static async update({ id, toUpdate }) {
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { id: id, removed: false },
      { $set: toUpdate },
      { returnOriginal: false }
    );
    return updatedProduct;
  }

  /** 전체 상품 반환 함수
   *
   * @param {Number} page - 현재 페이지
   * @param {Number} perPage - 한 페이지당 보여줄 페이지 수
   * @returns resultList
   */
  static async findProductList({ page, perPage }) {
    const len = await ProductModel.countDocuments();
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({ removed: false })
      .populate("userInfo", "business")
      .sort({ createdAt: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 전체 상품 반환 함수 pagination 없는 버전
   *
   * @returns resultList
   */
  static async findProductListNoPage() {
    const resultList = await ProductModel.find({ removed: false })
      .populate("userInfo", "business")
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return resultList;
  }

  /** 카테고리별 상품 반환 함수
   *
   * @param {String} category - 카테고리
   * @param {Number} page - 현재 페이지
   * @param {Number} perPage - 한 페이지당 보여줄 페이지 수
   * @returns resultList
   */
  static async findProductCategoryList({ category, page, perPage }) {
    const len = await ProductModel.countDocuments({ category });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({ category, removed: false })
      .populate("userInfo", "business")
      .sort({ createdAt: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 카테고리 + 공동구매순 정렬 함수
   *
   * @param {String} category
   * @param {Number} page
   * @param {Number} perPage
   */
  static async findProductSortByGroups({ category, page, perPage }) {
    const len = await ProductModel.countDocuments({ category });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({
      category: { $regex: category },
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ views: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 카테고리 + 리뷰순 정렬 함수
   *
   */
  static async findProductSortByReviews({ category, page, perPage }) {
    const len = await ProductModel.countDocuments({ category });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({
      category: { $regex: category },
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ views: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 카테고리 + 조회순 정렬 함수
   *
   */
  static async findProductSortByViews({ category, page, perPage }) {
    const len = await ProductModel.countDocuments({ category });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({
      category: { $regex: category },
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ views: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 카테고리 + 가격순 정렬 함수
   *
   * @param {String} category
   */
  static async findProductSortByPrice({ category, page, perPage }) {
    const len = await ProductModel.countDocuments({ category });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({
      category: { $regex: category },
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ salePrice: 1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 상품 삭제 함수
   *
   * @param {uuid} id - 상품 id
   * @returns
   */
  static async deleteProduct({ id }) {
    const product = await ProductModel.deleteOne({ id });
    return product;
  }

  /** 상품 id 리스트 반환 함수 for 쨍
   *
   * @returns productIdList
   */
  static async findProductIdList() {
    const resultList = await ProductModel.find();
    const productIdList = resultList.map((obj) => obj.id);
    return productIdList;
  }

  /** 검색어별 상품 반환 함수
   *
   * @param {String} search
   * @param {Number} page
   * @param {Number} perPage
   * @returns resultList
   */
  static async findProductSearch({ search, page, perPage }) {
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({
      name: { $regex: search },
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ createdAt: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 검색어 + 열린 공동 구매 많은순 상품 반환 함수 (default)
   *
   * @param {String} search
   * @param {Number} page
   * @param {Number} perPage
   * @returns resultList
   */
  static async findProductSearchSortByGroups({ search, page, perPage }) {
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({ name: { $regex: search } })
      .populate("userInfo", "business")
      .sort({ groups: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 검색어 + 낮은 가격순 상품 반환 함수
   *
   * @param {String} search
   * @param {Number} page
   * @param {Number} perPage
   * @returns resultList
   */
  static async findProductSearchSortByPrice({ search, page, perPage }) {
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({ name: { $regex: search } })
      .populate("userInfo", "business")
      .sort({ salePrice: 1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 검색어 + 후기 많은순 상품 반환 함수
   *
   * @param {String} search
   * @param {Number} page
   * @param {Number} perPage
   * @returns resultList
   */
  static async findProductSearchSortByReviews({ search, page, perPage }) {
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({ name: { $regex: search } })
      .populate("userInfo", "business")
      .sort({ reviews: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 검색어 + 조회 많은순 상품 반환 함수
   *
   * @param {String} search
   * @param {Number} page
   * @param {Number} perPage
   * @returns resultList
   */
  static async findProductSearchSortByViews({ search, page, perPage }) {
    const len = await ProductModel.countDocuments({ name: { $regex: search } });
    const totalPage = Math.ceil(len / perPage);

    const resultList = await ProductModel.find({ name: { $regex: search } })
      .populate("userInfo", "business")
      .sort({ views: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { resultList, totalPage, len };
  }

  /** 유저가 판매하는 상품 리스트 반환 함수
   *
   * @param {uuid} userId - 유저 id
   * @returns resultList
   */
  static async findUserProduct({ userId }) {
    const resultList = await ProductModel.find({ userId: userId })
      .populate("userInfo", "business")
      .lean();
    return resultList;
  }
}

export { Product };
