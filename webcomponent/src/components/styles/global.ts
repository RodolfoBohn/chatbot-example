import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body, input, button, textarea {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

body {
  min-height: 100vh;
  background: #F6F6F6;
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #F1F1F1; 
}
 
::-webkit-scrollbar-thumb {
  background: #A9A9A9; 
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555555; 
}
}
`
