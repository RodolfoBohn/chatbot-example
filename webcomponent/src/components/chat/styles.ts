import styled, {css} from "styled-components";

interface IChatContainerProps {
  isVisible: boolean
}

interface IMessageListItemProps {
  sender: string
}

interface IOpenCloseButtonProps {
  isVisibleOnMobile: boolean
}

interface IContainerProps {
  isChatVisibleOnMobile: boolean
}

export const Container = styled.div<IContainerProps>`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 450px) {
    bottom: ${props => props.isChatVisibleOnMobile ? 0: 32}px;
    right: ${props => props.isChatVisibleOnMobile ? 0: 32}px;;
  }
`

export const ChatContainer = styled.div<IChatContainerProps>`
  border-radius: 8px;
  width: 400px;
  height: 80vh;
  background-color: #D3D3D3;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  ${props => props.isVisible ? css`transform: translateY(0%);` : css`transform: translateY(110%);`}
  @media (max-width: 450px) {
    height: 100vh;
    width: 100vw;
    border-radius: 0;
  }
`

export const Header = styled.header`
  height: 70px;
  min-height: 70px;
  background: #77529E;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: sticky;
  top: 0;
  @media (max-width: 450px) {
    border-radius: 0;
  }
`

export const HeaderCloseButton = styled.button`
  display: none;

  @media (max-width: 450px) {
    display: inline-block;
    width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 23px;
  right: 23px;
  border: 0;
  background-color: transparent;

  &>svg {
    color: white;
  }
  }
`

export const Title = styled.h2``

export const Main = styled.main`
  padding: 16px 32px;
  flex: 1;
`

export const MessageList = styled.ul`  
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const MessageListItem = styled.li<IMessageListItemProps>`
  padding: 16px;
  

  ${props => props.sender === 'bot' ?  
      css`
        border-radius: 8px 8px 8px 0;
        background-color: #A9A9A9;
      ` 
      :  
      css`
        border-radius: 8px 8px 0 8px;
        background-color: #77529E;
        color: white;
      `
  }
`

export const MessageText = styled.p``

export const OpenCloseButton = styled.button<IOpenCloseButtonProps>`
  width: 64px;
  height: 64px;
  border: none;
  background: #77529E;
  align-self: flex-end;
  color: white;
  border-radius: 500px;
  cursor: pointer;

  &>svg {
    color: white;
  }

  &:hover {
    background: #A5BDFD;
  }

  @media (max-width: 450px) {
    display: ${props => props.isVisibleOnMobile ? 'inline-block' : 'none'};
  }
`