# orumi-project1-chatgpt
이 사이트는 chatGPT API를 이용합니다. 현재 "코드 리뷰", "노래 찾기" 메뉴가 있습니다.
1. 코드 리뷰 - 소스코드를 chatGPT가 분석하여 코드 리뷰를 해줍니다. 프로그램 개발보다는 언어 공부에 도움이 됩니다.

2. 노래 찾기\
chatGPT가 노래의 가사를 분석하여 노래 제목을 찾아줍니다. 카페나 길거리에서 노래를 듣고 무슨 노래인지 알고 싶을 때 유용합니다.

## 사용 기술
1. chatGPT API
2. Youtube Data API
3. tailwindcss
4. svg

## SVG 코드 정리
좌표 (28, 16) 반지름 2.8\
회전좌표 (16, 16)
```
<circle cx="28" cy="16" r="2.8" opacity="1.0">
    <animateTransform
    attributeName="transform"
    attributeType="XML"
    type="rotate"
    from="0 16 16"
    to="360 16 16"
    dur="1.2s"
    repeatCount="indefinite"
    calcMode="linear"/>
</circle>
```
베지어 곡선 그리기\
시작점 (5, 25) 끝점 (27, 25)\
제어점1 (5, 25) 제어점2 (15 20)
```
<path d="M5 25 C 5 25, 15 20, 27 25" fill="transparent" stroke="#000" stroke-width="2" stroke-linecap="round"/>
```