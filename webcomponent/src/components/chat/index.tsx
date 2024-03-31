import * as S from './styles'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { X,Chat as ChatIcon } from 'phosphor-react'
import { ChatOptions } from '../chatOptions'
import { GlobalStyle } from '../styles/global'

export interface IMessageOptionProps {
  id: string
  text: string
  value: string
}

export interface IMessageProps {
  id?: string
  sender: string;
  content: string;
  value?: string;
  MessageOption?: {
    id: string
    text: string
    value: string
  }[];
}

export const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<IMessageProps[]>([])
  const chatRef = useRef<HTMLUListElement>(null)
  const [updateConection, setUpdateConection] = useState(false)


  const socket:Socket = useMemo(() => {
    const storedChatbotId = localStorage.getItem( 
      '@chatbot-test:user-id',
    )

    if(storedChatbotId) {
      return io("http://localhost:8080", {
        query: {
          'userId': storedChatbotId
        }
      })

    } else {
      return io("http://localhost:8080", {})
    }
    }, [updateConection])

  useEffect(() => {
    socket.on("conect", () => {
    })

    socket.on('createUser', (data) => {
      localStorage.setItem('@chatbot-test:user-id', data.userId)
      setUpdateConection(true)
    })

    socket.on('response', (newHistoryMessages:IMessageProps[]) => {
      const filteredMessages = newHistoryMessages.filter(newMessage => !messages.some(message => message?.id === newMessage?.id))
  
      setMessages(previousState => ([...previousState, ...filteredMessages]))
    })

    return () => {
      socket.off('createUser')
      socket.off('response')
    }
  },[messages, socket])


  useEffect(() => {
    const objDiv = document.getElementById("chatContainer");
    if(objDiv) {
      objDiv.scrollTop = objDiv?.scrollHeight;
    }
  }, [messages])

  const handleSelectOption = (option:IMessageOptionProps) => {
    const newMessage:IMessageProps = {
      sender: 'user', 
      content: option.text,
      value: option.value
    }
    socket.emit('newMessage', newMessage)
  }

  return (
    <>
    <GlobalStyle />
    <S.Container isChatVisibleOnMobile={isChatOpen}>
      <div style={{overflow: 'hidden'}}>
        <S.ChatContainer isVisible={isChatOpen} id='chatContainer'>
          <S.Header>
            <S.Title>Chatbot</S.Title>
            <S.HeaderCloseButton 
              onClick={() => setIsChatOpen(state => !state)}
            >
              <X size={24} weight='bold' />
            </S.HeaderCloseButton>
          </S.Header>
          <S.Main>
            <S.MessageList ref={chatRef}>
              {
                messages?.map((message, index) => (
                  <S.MessageListItem key={message.id} sender={message.sender}>
                  <S.MessageText>{message.content}</S.MessageText>
                  {
                    message.MessageOption ? (
                      <ChatOptions 
                        isOptionsVisible={messages.length === index+1}
                        handleSelectOption={handleSelectOption} 
                        options={message.MessageOption} 
                      />
                      ) : null
                  }

                </S.MessageListItem>
                ))
              }

            </S.MessageList>
          </S.Main>
        </S.ChatContainer>
      </div>
      <S.OpenCloseButton
        onClick={() => setIsChatOpen(state => !state)}
        isVisibleOnMobile={!isChatOpen}
      >
        {
          isChatOpen ? <X size={32} weight='bold' /> : <ChatIcon size={32} weight='bold' />
        }
      </S.OpenCloseButton>
    </S.Container>
    </>
  )
}
