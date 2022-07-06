import { Schema, model } from "mongoose";

const ParticipantSchema = new Schema({
  // 참가자 아이디
  userId: {
    type: String,
    required: true,
  },
  // 참가자 정보. objectId로 저장
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  // 공동구매 참가 날짜
  participantDate: {
    type: String,
    required: true,
  },
  // 구매 수량
  quantity: {
    type: Number,
    required: true,
  },
  // 지불 여부. 현재에는 선불로 정책이 변경됨에 따라 true로 저장되야 함.
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    required: false,
  },
  // 이용권 모두 사용 여부. (이전에는 다른 용도로 쓰인 컬럼이지만, 현재에는 이용권 모두 사용 여부를 나타내는 용도로 변경)
  complete: {
    type: Boolean,
    required: true,
    default: false,
  },
  // 공구장(공구를 생성한 사람) 여부
  manager: {
    type: Boolean,
    required: true,
  },
  // 리뷰 생성 여부
  review: {
    type: Boolean,
    required: true,
  },
});

const GroupSchema = new Schema(
  {
    // 그룹 아이디
    groupId: {
      type: String,
      required: true,
    },
    // 그룹 종류
    groupType: {
      type: String,
      required: true,
    },
    // 그룹 이름
    groupName: {
      type: String,
      required: true,
    },
    // 상품 아이디
    productId: {
      type: String,
      required: true,
    },
    // 상품 정보. objectId로 저장
    productInfo: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // 공구가 성사되기 위해 더 판매되어야 하는 물품의 개수. 이전에는 남아있는 사람 수의 의미였으나, 현재에는 다른 의미로 사용되고 있음
    remainedPersonnel: {
      type: Number,
      required: true,
      default: 0,
    },
    // 위치. 근처 공동구매 추천에 사용
    location: {
      type: String,
      required: false,
    },
    /* 위도 경도 값.
     * 다음과 같이 저장된다.
     * locationXY: object
     *   type: "Point"
     *   coordinates: Array
     *     0: 127.047102191783
     *     1: 37.5054431039209
     */
    locationXY: {
      type: { type: String },
      coordinates: [Number],
    },
    // 마감기한
    deadline: {
      type: String,
      required: true,
    },
    /* 공동구매에 대한 상태 값
     * 1 : 모집성공, -1 : 모집 실패, 2 : 미사용, -2 : 사용 완료, -3 : (이용권) 기간 만료
     * 4 : 배송중, -4 : 배송 대기중, 5 : 배송 완료, -5 : 교환/반품, -6 : 공구 개최자 취소, -7 : 상품 삭제
     * 현재 배송 관련(4, -4, 5, -5) 상태 값은 사용되지 않음
     */
    state: {
      type: Number,
      required: true,
    },
    // 참가자 목록
    participants: [ParticipantSchema],
  },
  {
    timestamps: true,
  }
);

const GroupModel = model("Group", GroupSchema);

export { GroupModel };
