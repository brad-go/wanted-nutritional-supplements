<h1>원티드 프리온보딩 코스 3주차 기업과제<br />
영양제 검색 💊</h1>

## 🚀 배포

🔗 **과제물**(netlify): https://park-is-best-supplements.netlify.app/
<br />

## 🧑‍🤝‍🧑 팀 소개

### 저희는 Team **박이최고** 입니다.

| | 팀원 | 역할 | 
|------------------------------------------------------------ |----------------------------------------------------- |--------------------- | 
| ![](https://avatars.githubusercontent.com/u/71081893?s=25) | 이소진 [@krungy](https://github.com/krungy) | (팀장) 전체 스타일링 | 
| ![](https://avatars.githubusercontent.com/u/68905615?s=25) | 고동현 [@brad-go](https://github.com/brad-go) | 검색 알고리즘 구현  |
| ![](https://avatars.githubusercontent.com/u/57004991?s=25) | 최효정 [@hyo-choi](https://github.com/hyo-choi) | 무한 스크롤 구현 | 

모든 기능은 페어 프로그래밍으로 함께 구현했습니다.

<br>

## 🪄 프로젝트 실행 방법

1. git clone하여 프로젝트를 내려받습니다.
   ```bash
   git clone https://github.com/OnBoarding-Park-is-best/week3-nutritional-supplements.git
   ```
2. 아래 커맨드로 패키지를 설치합니다.
   ```bash
   yarn install
   ```
5. 아래 커맨드로 프로젝트를 실행합니다.
   ```bash
   yarn start
   ```

<br>

## 🧰 기술 스택 및 구현 사항

![](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white) ![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white) ![Material-UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)


### 구현 목표

- 한글과 영어가 혼재된 영양제명 검색 기능 구현
- 소비자가 원하는 제품을 보다 쉽게 찾을 수 있도록 검색 기능 구현
  - 검색어 미리보기 및 추천 키워드 제공
  - 입력 시 디바운싱 처리
  - 검색 결과 무한 스크롤 방식으로 출력
- 반응형 UI/UX 고려하여 구현
- 퀵버튼을 통한 제품명, 브랜드명 검색 전환
- 엑셀 파일을 mock data로 변환해서 사용

### 팀내 결정사항

#### 타입스크립트 사용: 컴포넌트 타입 지정 방식

```tsx
interface SampleComponentProps {
  onClick: React.MouseEventHandler;
  selected?: boolean;
}

const SampleComponent = ({ onClick, selected }: **SampleComponentProps**) => {
  return <div onClick={onClick}>{selected ? 'yes' : 'no'}</div>;
};
```

- React.FC 대신 Props용 interface를 사용합니다.
- 함수형 컴포넌트의 return type(JSX.Element)은 생략합니다.

#### 반응형 기준

```css
@media screen and (max-width:767px) {
  /* 모바일 */
}
```

- 767px을 기준으로 모바일 환경(반응형)을 구성합니다.
- PC 환경을 기준으로 CSS를 작성한 후 모바일 환경에 대한 CSS를 작성합니다.

### :computer: 핵심 기능

#### Debouncing(디바운싱) 처리
- input이 갱신될 때 매번 onChange로 검색을 수행하면 매 입력마다 검색이 수행되어 효율이 저하되므로, 사용자의 입력 간격이 일정 시간 이상일 때만 검색을 수행하여 효율성 증대
- setTimeout 이용 ([링크](https://github.com/OnBoarding-Park-is-best/week3-nutritional-supplements/blob/develop/src/App.tsx#L78))

#### 정규식을 이용한 Fuzzy String Search

- 사용자들이 영양제 이름을 정확히 모를때가 있고 영문과 한글이 혼용되어 있기 때문에, 초성검색 및 정확한 영양제의 이름을 입력하지 않아도 결과를 보여줘야 했기에 퍼지 검색 기능 구현
  - `filter()`와 `includes()`를 이용한 구현은 간단하지만 초성 검색 불가, 검색 가중치 설정 불가
  - 한글 초성 분리 및 퍼지 검색을 활용한 기능은 검색 로직을 구현하는 과제에 있어 적합하지 않다고 판단
  - 영문은 가능하나 한글은 초성 분리를 해야했기에 정규식을 이용해서 퍼지 검색 기능 구현 [코드 보기](https://github.com/OnBoarding-Park-is-best/week3-nutritional-supplements/blob/develop/src/utils/search.ts#L13)
- 기능을 구현했으나 유사성만을 찾아 검색 결과를 보여주는 기능이어서 검색 결과에 대한 가중치를 설정하기 위한 함수 `sortResult()`구현 [코드 보기](https://github.com/OnBoarding-Park-is-best/week3-nutritional-supplements/blob/develop/src/utils/search.ts#L65)

#### 무한 스크롤 기능 구현
- 많은 리스트를 한 번에 보여주기보다는 화면이 스크롤됨에 따라 추가로 보여주는 것이 좋을 것이라 판단하여 무한 스크롤 추가
- Intersection Observer API를 이용하여 스크롤 정도에 따라 다음 데이터 로드
- 해당 로직은 useIntersect hook으로 분리

<br />

## 📂 디렉토리 구조

```bash
.
├── api
├── components
│   ├── BlankContainer
│   ├── Dropdown
│   └── ProductItem
├── constants
├── hooks
├── styles
├── types
└── utils
```
