import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { groupController } from "../controllers/groupController";

const groupRouter = Router();

// 공동구매 생성
groupRouter.post(
  "/groups",
  login_required,
  groupController.createGroup
);

// 공동구매 아이디를 통해 공동구매 검색
groupRouter.get(
  "/groups/groupId/:groupId",
  login_required,
  groupController.getGroup
);

// 상품에 대한 모든 공동구매 검색
groupRouter.get(
  "/groups/productId/:productId",
  login_required,
  groupController.getGroupsByProductId
);

// 공동구매의 숫자 정보들 반환
groupRouter.get(
  "/groups/:groupId/numberInfo",
  login_required,
  groupController.getGroupsByNumberInfo
);

// 내가 공구장인 공동구매들 반환
groupRouter.get(
  "/groups/manager/:boolean",
  login_required,
  groupController.getGroupsByIsManager
);

// 공동구매 state 정보 가져오기
groupRouter.get(
  "/groups/:groupId/stateInfo",
  login_required,
  groupController.getGroupStateInfo
);

// 마감 기한이 1일 이내인 리스트 오름차순 정렬
groupRouter.get(
  "/groups/sort/remainedTime",
  login_required,
  groupController.getGroupsByRemainedTime
);

// 모집 인원이 적게 남은 순으로 오름차순 정렬 (단, 3명 이하)
groupRouter.get(
  "/groups/sort/remainedPersonnel",
  login_required,
  groupController.getGroupsByRemainedPersonnel
);

// 열린 공구가 가까운 순으로 오름차순 정렬 (단, 5km 이내)
groupRouter.get(
  "/groups/sort/locations",
  login_required,
  groupController.getGroupsByLocations
);

// 특정 아이디의 공동구매 수량 변경
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

// 공동구매 참여하기
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

// 공동구매 닫기
groupRouter.delete(
  "/groups/:groupId",
  login_required,
  groupController.deleteGroup
);


export { groupRouter };
