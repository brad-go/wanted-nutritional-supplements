import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { IconButton, Tab, Tabs, TextField } from '@mui/material';
import { List, ListItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { NutritionType } from '~types/index';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [searchType, setType] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<NutritionType[]>([]);

  const [dropdownActive, setDropdownActive] = React.useState<boolean>(false);

  const handleFocus = () => {
    setDropdownActive(true);
  };

  const handleBlur = () => {
    setDropdownActive(false);
  };

  const handleTypeChange = (e: React.SyntheticEvent<Element, Event>) => {
    const target = e.target as HTMLButtonElement;
    setType(Number(target.id.substring(target.id.length - 1)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Wrapper>
      <Container>
        <h1>영양제 검색</h1>
        <FormContainer onSubmit={handleSubmit}>
          <div>
            <Tabs
              value={searchType}
              onChange={handleTypeChange}
              aria-label="영양제 검색"
            >
              <Tab label="제품명 검색" {...a11yProps(0)} />
              <Tab label="브랜드 검색" {...a11yProps(1)} />
            </Tabs>
            <InputContainer dropdownActive={dropdownActive}>
              <TextField
                variant="standard"
                placeholder={`검색할 ${
                  searchType === 0 ? '제품명을' : '브랜드를'
                } 입력하세요.`}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
                fullWidth
              />
              <IconButton color="primary" type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputContainer>
          </div>
          {dropdownActive && (
            <DropdownContainer dropdownActive={dropdownActive}>
              <List disablePadding>
                {result.length ? (
                  result.slice(0, 8).map(({ productName }) => (
                    <ListItem key={productName} disablePadding>
                      <ListButton type="submit">
                        <SearchIcon color="primary" />
                        {productName}
                      </ListButton>
                    </ListItem>
                  ))
                ) : (
                  <BlankContainer>검색결과 없음</BlankContainer>
                )}
              </List>
            </DropdownContainer>
          )}
        </FormContainer>
        <ResultContainer>
          {result.length ? (
            <div>
              {result.map(({ productName, brand }) => (
                <a href="/#" key={productName}>
                  <ProductItem>
                    <h3>{productName}</h3>
                    <p>{brand || ' '}</p>
                  </ProductItem>
                </a>
              ))}
            </div>
          ) : (
            <BlankContainer>검색 결과가 없습니다.</BlankContainer>
          )}
        </ResultContainer>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  color: #1b1b2d;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 767px;
  height: 80%;
  margin: 0 auto;
  border-radius: 12px;
  background-color: #efca61;
  box-shadow: 8px 42px 80px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  > h1 {
    margin: 36px 0 8px 0;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
  }

  @media screen and (max-width: 767px) {
    width: 100%;
    height: 100vh;
    box-shadow: none;
  }
`;

const FormContainer = styled.form`
  position: relative;
  padding: 16px;
  width: 100%;
`;

const InputContainer = styled.div<{ dropdownActive: boolean }>`
  display: flex;
  padding: 8px 12px 0 20px;
  margin-top: 1em;
  padding-bottom: 2px;
  background-color: white;
  ${(props) =>
    props.dropdownActive
      ? css`
          background-color: white;
          border: none;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
        `
      : css`
          border-radius: 30px;
        `}
`;

const DropdownContainer = styled.div<{ dropdownActive: boolean }>`
  position: absolute;
  width: calc(100% - 32px);
  padding: 0 12px;
  padding-bottom: 8px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.4);
  ${(props) =>
    props.dropdownActive
      ? css`
          background-color: white;
        `
      : css``}
`;

const ListButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1em;
  padding: 0.5em;
  cursor: pointer;
  border-radius: 1em;
  transition: background-color 0.25s;

  &:hover {
    background-color: #eee;
  }
`;

const ResultContainer = styled.section`
  padding: 1em 1em 1em 1em;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0.25em;
    background-color: #ccc;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 500;
  }

  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

const ProductItem = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 5em;
  margin: 0 1em;
  border-bottom: solid 1px #ddd;

  h3 {
    font-weight: 600;
  }

  p {
    color: #aaa;
  }

  h3,
  p {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const BlankContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5em 0;
  color: #aaa;
`;

export default App;
