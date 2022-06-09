import { ToggleModel } from "../db/schemas/toggle.js";
import { ProductModel } from "../db/schemas/product.js";
import { Group } from "../db/index.js";
import { productsWithToggleInfo } from "../utils/productsWithToggleInfo";

export class recommendService {
  static async getRecommendedProduct({ userId, page, perPage }) {
    const toggleInfo = await ToggleModel.findOne({ userId }).populate(
      "products"
    );

    let dict = {};

    const productInfo = toggleInfo.products;
    productInfo.map((v) => {
      const category = v.category;

      if (dict[category] == null) {
        dict[category] = 1;
      } else {
        dict[category] += 1;
      }
    });

    const keysSorted = Object.keys(dict).sort(function (a, b) {
      return dict[b] - dict[a];
    });

    // 1, 2, 3순위 카테고리
    const len = await ProductModel.countDocuments({
      $or: [
        {
          category: keysSorted[0],
        },
        {
          category: keysSorted[1],
        },
        {
          category: keysSorted[2],
        },
      ],
      removed: false,
    });
    console.log("len:", len);
    const totalPage = Math.ceil(len / perPage);

    const productList = await ProductModel.find({
      $or: [
        {
          category: keysSorted[0],
        },
        {
          category: keysSorted[1],
        },
        {
          category: keysSorted[2],
        },
      ],
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ createdAt: -1 })
      .select("-__v")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    const hotProductList = await Group.findProductSortByGroups();
    console.log("hotProductList:", hotProductList);

    let resultList = [];
    let jjaProductList = [...productList];
    for (let i = 0; i < hotProductList.length; i++) {
      for (let j = 0; j < productList.length; j++) {
        if (hotProductList[i]._id === productList[j].id) {
          resultList.push(productList[j]);
          delete jjaProductList[j];
        }
      }
    }

    for (let i = 0; i < jjaProductList.length; i++) {
      if (jjaProductList[i] !== undefined) {
        resultList.push(jjaProductList[i]);
      }
    }

    resultList = await productsWithToggleInfo(userId, resultList);

    return { resultList, totalPage, len };
  }
}
