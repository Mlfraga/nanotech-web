import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
/* @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap'); */

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

html, body, #root{
  height: 100%;
  overflow: auto;
}

html{
  overflow: hidden;
}

body {
  font: 14px 'Roboto', sans-serif;
  background: #383838;
  color: #EEE;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

input, button {
  font: 16px 'Roboto', sans-serif;
}

button{
  cursor: pointer;
}

ul{
  list-style: none;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-pagination-bullet{
  background: #bebebe;
}

.swiper-pagination-bullet-active-main{
  background: #305b9c;
}

.swiper-button-next,
.swiper-button-prev {
    color: #fff;
    fill: black;
    stroke: black;
}

`;

export default GlobalStyle;
