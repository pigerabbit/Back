# "동구라미"
지역경제 활성화를 도모하고 소상공인을 위한 온라인 판로를 지원하는 공동구매 중개 플랫폼

## 1. 프로젝트 개요

1-1. 문제 정의
- 코로나 19 영향으로 인한 지역 경제 침체
- 오프라인 판매 정체세
- 높아지는 플랫폼 수수료

1-2. 프로젝트 주제
- 공동구매 중개 플랫폼 ‘동구라미’ 제작

1-3. 목표 

    1. 지역경제 활성화 도모

    2. 소상공인을 위한 온라인 판로 지원



## 2. 기술 스택 


- 프론트엔드
    * React, Redux, axios
- 백엔드
    - Node.js
    - Database : MongoDB, MySQL, S3, Redis
    - API : Kakao map API, 공공데이터포털 API
    - module : nodemailer

## 3. 아키텍처
* 프로젝트 구조도

<img src="https://user-images.githubusercontent.com/97489259/176107280-dd3d7edc-96a4-4f8f-9973-c455da0ca7c3.png" width="60%" height="50%" />


* 서비스 흐름도
    * 구매자 흐름도

    <img src="https://user-images.githubusercontent.com/97489259/176107326-4bf96313-8568-42d0-bd16-8c40947ac526.png"  width="90%" height="90%"  />



    * 판매자 흐름도

    <img src="https://user-images.githubusercontent.com/97489259/176107345-a1f60f1f-bae4-428c-9d2f-1a1a7371f26b.png"  width="90%" height="90%"  />


* [와이어프레임](https://www.figma.com/file/OmuTNn55BVFe7QwGL69KxK?embed_host=notion&kind=&node-id=0%3A1&viewer=1)
<img src="https://user-images.githubusercontent.com/97489259/176350825-f404958f-4d2f-4ec7-9eeb-c241b441d3e0.png" width="65%" height="65%" />



## 4. 서비스 소개

1) 메인 기능
- 사업자 등록 여부 확인
- 공동구매 참여
- 공동구매 개설
- 내가 참여한 / 개설한 공구 확인
- 내가 개설한 공구 중지
- 결제 정보 확인
- 이용권 QR 코드
- 판매 상품 등록 및 관리
- 판매 상품에 대한 공구 확인
- 관심있는 공동구매 추천
- 상품 best 10
- 근처 공동구매 추천
- 마감 임박 공동구매 추천

<img src="https://user-images.githubusercontent.com/97489259/176107376-d2afbef2-2c88-48a6-9fb7-36d18d139154.png"  width="70%" height="90%"  />

<img src="https://user-images.githubusercontent.com/97489259/176107418-d4e8fef6-7f62-451d-a6a7-2c850bb7835d.png"  width="70%" height="90%"  />

<img src="https://user-images.githubusercontent.com/97489259/176107445-2b210a9d-741b-4ddb-adbe-6aa2b4e4668d.png"  width="70%" height="90%"  />

<img src="https://user-images.githubusercontent.com/97489259/176107469-5561e126-a0ae-4796-a984-2a8ee3720788.png"  width="70%" height="90%"  />

### 2) 서브기능

- 회원가입, 로그인, 회원정보 수정
- 내가 작성한 문의 / 후기 확인
- 상품 / 공동구매 찜하기
- 상품 / 공동구매 상세 정보
- 알림 기능 구현
- 검색 기능
    - 인기 검색어, 최근 검색어, 최근 본 상품
    - 검색 기록 확인
- 글 작성 기능
    - 문의 / 후기
    - 판매자 답변
    - 공동구매 댓글

---
### 5. 팀원 소개

| 배서영 | FE |
| --- | --- |
| 선민경 | FE |
| 임은나 | FE |
| 안지우 | BE |
| 최재익 | BE / 팀장 |
