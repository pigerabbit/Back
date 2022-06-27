import { ToggleModel } from "../db/mongodb/schemas/toggle.js";
import { ProductModel } from "../db/mongodb/schemas/product.js";
import { GroupModel } from "../db/mongodb/schemas/group.js";
import { Group } from "../db/mongodb/index.js";
import { productsWithToggleInfo } from "../utils/productsWithToggleInfo";
import { withToggleInfo } from "../utils/withToggleInfo";

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

    if (perPage == -1) {
      perPage = len;
    }

    let totalPage = Math.ceil(len / perPage);

    // productList 뽑아내는 것 -> gorupList 뽑아내는 것
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

  static async getRecommendedGroup({ userId, page, perPage }) {
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

    if (perPage == -1) {
      perPage = len;
    }

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
      .lean();

    const productList2 = await ProductModel.find({
      category: { $nin: keysSorted },
      removed: false,
    })
      .populate("userInfo", "business")
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    const productList3 = [...productList, ...productList2];

    let newList = [];

    for (let i = 0; i < productList3.length; i++) {
      const productId = productList3[i].id;
      const group = await GroupModel.findOne({ productId, state: 0 })
        .populate("productInfo")
        .lean();
      if (group !== null) {
        newList.push(group);
      }
    }

    const toggleInfo2 = await ToggleModel.findOne({ userId });

    if (!toggleInfo2) {
      const errorMessage =
        "userId에 대한 토글 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const resultList = await withToggleInfo(toggleInfo2.groups, newList);

    return resultList;
  }
}
