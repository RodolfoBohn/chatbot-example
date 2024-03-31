
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`

export const Button = styled.button`
  padding: 12px;
  border: none;
  background: #77529E;
  color: white;
  border-radius: 8px;
  transition: all ease 0.3s;
  cursor: pointer;

  &:hover {
    background: #a5bdfd;
  }
`
