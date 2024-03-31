import { useState } from 'react'
import { IMessageOptionProps } from '../chat'
import * as S from './styles'

interface IChatOptionsProps {
  options: IMessageOptionProps[]
  handleSelectOption: (option:IMessageOptionProps) => void
  isOptionsVisible: boolean
}

export const ChatOptions = ({options, isOptionsVisible, handleSelectOption}:IChatOptionsProps) => {
  const [isVisible, setIsVisible] = useState(isOptionsVisible)
  const handleClick = (option:IMessageOptionProps) => {
    setIsVisible(false)
    handleSelectOption(option)
  }

  if(!isVisible) {
    return null
  }
  
  return (
    <S.Container>
    {
      options.map(option => (
        <S.Button key={option.id} onClick={() => handleClick(option)}>{option.text}</S.Button>
      ))
    }
  </S.Container>
  )
}