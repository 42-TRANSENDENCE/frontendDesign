import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
  html {
    --color-blue: #4495F7;
    --color-red: #F36A7B;
    --color-green: #64E469;
    --color-yellow: #FCF451;
    --color-gray: #D9D9D9;
    --html-padding-horizontal: 2.5vw;
    --html-padding-vertical: 2.5vh;

    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;

    box-sizing: border-box;
    /* background-color: var(--color-yellow); */
    background-color: rgb(50, 50, 50);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding: var(--html-padding-vertical) var(--html-padding-horizontal);
    overflow: hidden;
  }
  body {
    --page-width : min(1920px, calc(100vw - 2*var(--html-padding-horizontal)));
    --page-height : calc(100vh - 2*var(--html-padding-vertical));

    --title-width: calc(var(--page-width) * 0.95);
    --title-height : max(50px, min(100px, calc(var(--page-height) * 0.1)));
    
    --body-width: var(--title-width);
    --body-height: calc(var(--page-height) - 1*var(--title-height) - 3*var(--html-padding-vertical));
    width: var(--page-width);
    max-width: 1920px;
    height: var(--page-height);
    background: var(--color-blue);
    color: black;
    font-family: 'Poppins', sans-serif;
    border-radius: 20px;
    overflow: hidden;
  }
`

export default GlobalStyles
