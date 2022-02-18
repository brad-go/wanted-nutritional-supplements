import escapeRegExp from 'lodash/escapeRegExp';

export const createFuzzyMatcher = (input: string) => {
  const pattern = input.split('').map(changeToPattern).join('.*?');
  return new RegExp(pattern);
};

export const changeToPattern = (ch: string) => {
  //'가'의 코드. 참고로 유니코드 한국어 시작은 44302부터 55203까지
  const offset = 44032;
  // test() 메서드는 주어진 문자열이 정규 표현식을 만족하는지 판별하고, 그 여부를 true 또는 false로 반환
  // 한국어 음절
  if (/[가-힣]/.test(ch)) {
    const chCode = ch.charCodeAt(0) - offset;
    // 종성이 있으면 문자 그대로를 찾는다.
    if (chCode % 28 > 0) {
      return ch;
    }
    const begin = Math.floor(chCode / 28) * 28 + offset;
    const end = begin + 27;
    return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }
  // 한글 자음인지 체크하기
  if (/[ㄱ-ㅎ]/.test(ch)) {
    const convertToSyllbale: { [key: string]: number } = {
      ㄱ: '가'.charCodeAt(0),
      ㄲ: '까'.charCodeAt(0),
      ㄴ: '나'.charCodeAt(0),
      ㄷ: '다'.charCodeAt(0),
      ㄸ: '따'.charCodeAt(0),
      ㄹ: '라'.charCodeAt(0),
      ㅁ: '마'.charCodeAt(0),
      ㅂ: '바'.charCodeAt(0),
      ㅃ: '빠'.charCodeAt(0),
      ㅅ: '사'.charCodeAt(0),
    };
    const begin =
      convertToSyllbale[ch] ||
      // 12613은 ㅅ의 코드
      (ch.charCodeAt(0) - 12613) * 588 + convertToSyllbale['ㅅ'];
    const end = begin + 587;
    // toString()으로 유니코드 번호로 변환
    return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`;
  }
  // 그 외엔 그대로 내보냄
  // escapeRegExp는 lodash에서 가져옴
  return escapeRegExp(ch);
};

// 문자열에서 정규표현식 만들어줌 Hello\?!\*`~World\(\)\[\]
// console.log(escapeRegExp("Hello?!*`~World()[]"));
