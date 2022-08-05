import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { groupController } from "../controllers/groupController";

const groupRouter = Router();

// 공구 생성
groupRouter.post(
  "/groups", 
  login_required, 
  groupController.createGroup
);

// 공구 수량 값 변경
groupRouter.put(
  "/groups/:groupId/quantity",
  login_required,
  groupController.updateQuantity
);

// 특정 아이디의 지불 여부 변경
groupRouter.put(
  "/groups/:groupId/payment",
  login_required,
  groupController.updatePayment
);

// 특정 아이디의 리뷰 여부 변경
groupRouter.put(
  "/groups/:groupId/review",
  login_required,
  groupController.updateReview
);

// 이외의 공동구매 정보 변경
groupRouter.put(
  "/groups/groupId/:groupId",
  login_required,
  groupController.updateGroup
);

// 공동구매 아이디를 통해 공동구매 검색
groupRouter.get(
  "/groups/groupId/:groupId",
  login_required,
  groupController.getGroup
);

// 상품에 대한 모든 공동구매들을 반환
groupRouter.get(
  "/groups/productId/:productId",
  login_required,
  groupController.getGroupsByProductId
);

// 공동구매의 숫자 정보들 반환
// 숫자 정보 : numberOfParticipants, minPurchaseQty, maxPurchaseQty
groupRouter.get(
  "/groups/:groupId/numberInfo",
  login_required,
  groupController.getGroupsByNumberInfo
);

// true : 내가 공구장인 공동구매 반환
// false : 참여한(공구장이 아닌) 공동구매 반환
groupRouter.get(
  "/groups/manager/:boolean",
  login_required,
  groupController.getGroupsByIsManager
);

// 공동구매에 참가자 추가
groupRouter.put(
  "/groups/:groupId/participate/in",
  login_required,
  groupController.updateParticipateIn
);

// 공동구매 나가기
groupRouter.put(
  "/groups/:groupId/participate/out",
  login_required,
  groupController.updateParticipateOut
);

// 공동구매 상태값 확인
groupRouter.get(
  "/groups/:groupId/stateInfo",
  login_required,
  groupController.getGroupStateInfo
);

// 마감 기한이 24시간 이내인 공동구매 오름차순 정렬
groupRouter.get(
  "/groups/sort/remainedTime",
  login_required,
  groupController.getGroupsByRemainedTime
);

// 모집 인원이 3명 이하인 공동구매 오름차순 정렬
groupRouter.get(
  "/groups/sort/remainedPersonnel",
  login_required,
  groupController.getGroupsByRemainedPersonnel
);

// 반경 5km 이내 공동구매 오름차순 정렬
groupRouter.get(
  "/groups/sort/locations",
  login_required,
  groupController.getGroupsByLocations
);

// 공동구매 논리 삭제
groupRouter.delete(
  "/groups/:groupId",
  login_required,
  groupController.deleteGroup
);

export { groupRouter };
