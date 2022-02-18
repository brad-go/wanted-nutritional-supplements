import React from 'react';
import styled from 'styled-components';
import { COLORS } from '~constants/index';

interface ProductItemProps {
  title: string;
  subtitle: string | null;
  href: string;
}

const ProductItem = ({ title, subtitle, href }: ProductItemProps) => {
  return (
    <a href={href}>
      <Container>
        <h3>{title}</h3>
        <p>{subtitle || ' '}</p>
      </Container>
    </a>
  );
};

const Container = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 5em;
  margin: 0 1em;
  border-bottom: solid 1px ${COLORS.GREY_BORDER};

  h3 {
    font-weight: 600;
    line-height: 1.5em;
  }

  p {
    color: ${COLORS.GREY};
  }

  h3,
  p {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export default ProductItem;
