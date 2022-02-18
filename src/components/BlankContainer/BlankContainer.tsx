import React from 'react';
import styled from 'styled-components';
import { COLORS } from '~constants/index';

interface BlankContainerProps {
  children: React.ReactNode;
}

const BlankContainer = ({ children }: BlankContainerProps) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2em;
  padding: 5em 0;
  color: ${COLORS.GREY};
`;

export default BlankContainer;
