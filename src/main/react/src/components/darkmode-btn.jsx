import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../data/themeProvider';

const ToggleWrapper = styled.button`
  position: fixed;
  z-index: 999999;
  bottom: 5%;
  right: 7%;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.button1};
  border-color: ${({ theme }) => theme.boardBorder1};
  cursor: pointer;
  &:hover {
    color: #ffffff;
  background: #264653;
  transition: .5s;
  }
`;



function ThemeToggle() {
  const { theme, onChangeTheme } = useContext(ThemeContext);
  return (
    <ToggleWrapper onClick={onChangeTheme}>
      {theme === 'light' ? "☀️" : "🌙"}
    </ToggleWrapper>
  );
}

export default ThemeToggle;
