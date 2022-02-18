import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconButton,
  Tab,
  Tabs,
  TextField,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled, { css } from 'styled-components';
import { PRODUCT_KEYWORDS, BRAND_KEYWORDS, COLORS } from '~constants/index';
import { type NutritionType, SearchType } from '~types/index';
import { createFuzzyMatcher } from '~utils/index';
import { fetchApi } from '~api/index';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [data, setData] = useState<NutritionType[]>([]);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.PRODUCT);
  const [preview, setPreview] = useState<string[]>([]);
  const [result, setResult] = useState<NutritionType[]>([]);
  const [list, setList] = useState<NutritionType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [dropdownActive, setDropdownActive] = React.useState<boolean>(false);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [target, setTarget] = useState(null);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const search = (value: string) => {
    setDropdownActive(false);
    setList([]);
    setIsEnd(false);
    if (searchType === SearchType.PRODUCT) {
      const result = data.filter((product) =>
        createFuzzyMatcher(value.toLowerCase()).test(
          product.productName.toLowerCase(),
        ),
      );
      setPreview(result.map(({ productName }) => productName));
      return result;
    }
    const result = data
      .filter((one) => one.brand !== null)
      .filter((product) =>
        createFuzzyMatcher(value.toLowerCase()).test(
          product.brand!.toLowerCase(),
        ),
      );
    setPreview(
      Array.from(
        new Set(
          result
            .map(({ brand }) => brand)
            .filter((one) => one !== null) as string[],
        ),
      ),
    );
    return result;
  };

  const handleFocus = () => {
    setDropdownActive(true);
  };

  const handleClose = () => {
    setDropdownActive(false);
  };

  const handleTypeChange = (e: React.SyntheticEvent<Element, Event>) => {
    const target = e.target as HTMLButtonElement;
    setSearchType(Number(target.id.substring(target.id.length - 1)));
    setInputValue('');
    setResult([]);
    setPreview([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!dropdownActive) {
      setDropdownActive(true);
    }
    setInputValue(value);

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    if (value === '') {
      setPreview([]);
      return;
    }

    timerId.current = setTimeout(() => {
      timerId.current = null;
      setResult(search(value));
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(search(inputValue));
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    const value = (e.target as HTMLButtonElement).innerText;
    setInputValue(value);
    setResult(search(value));
  };

  const onIntersect: IntersectionObserverCallback = useCallback(
    async ([entry], observer) => {
      if (entry.isIntersecting && !isEnd) {
        observer.unobserve(entry.target);
        setList((prev) => {
          const arr = result.slice(prev.length, prev.length + 10);
          if (arr.length < 10) setIsEnd(true);
          return prev.concat(arr);
        });
        observer.observe(entry.target);
      }
    },
    [isEnd, result],
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    if (target) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.1,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target, onIntersect]);

  useEffect(() => {
    const getData = async () => {
      const { nutritionList } = await fetchApi();
      setData(nutritionList);
    };
    getData();
  }, []);

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
                  searchType === SearchType.PRODUCT ? '제품명을' : '브랜드를'
                } 입력하세요.`}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                autoComplete="off"
                fullWidth
              />
              <IconButton color="primary" type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputContainer>
          </div>
          {dropdownActive && (
            <>
              <DropdownContainer>
                <List disablePadding>
                  {preview.length ? (
                    preview.slice(0, 8).map((name) => (
                      <ListItem key={name} disablePadding>
                        <ListButton onClick={handlePreviewClick}>
                          <SearchIcon color="primary" />
                          {name}
                        </ListButton>
                      </ListItem>
                    ))
                  ) : (
                    <BlankContainer>
                      검색 결과가 없습니다. 아래의 추천 키워드로 검색해보세요!
                      <ChipContainer>
                        {inputValue.length === 0 &&
                          (searchType === SearchType.PRODUCT
                            ? PRODUCT_KEYWORDS
                            : BRAND_KEYWORDS
                          ).map((name) => (
                            <Chip
                              key={name}
                              label={name}
                              onClick={handlePreviewClick}
                            />
                          ))}
                      </ChipContainer>
                    </BlankContainer>
                  )}
                </List>
              </DropdownContainer>
              <Backdrop onClick={handleClose} />
            </>
          )}
        </FormContainer>
        <ResultContainer>
          {result.length ? (
            <div>
              {list.map(({ productName, brand }) => (
                <a href="/#" key={productName}>
                  <ProductItem>
                    <h3>{productName}</h3>
                    <p>{brand || ' '}</p>
                  </ProductItem>
                </a>
              ))}
              {!isEnd && (
                <LoadingContainer
                  ref={setTarget as React.LegacyRef<HTMLDivElement>}
                >
                  loading...
                </LoadingContainer>
              )}
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
  color: ${COLORS.BLACK};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 767px;
  height: 80%;
  margin: 0 auto;
  border-radius: 12px;
  background-color: ${COLORS.POINT};
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
  background-color: ${COLORS.WHITE};
  ${(props) =>
    props.dropdownActive
      ? css`
          background-color: ${COLORS.WHITE};
          border: none;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
        `
      : css`
          border-radius: 30px;
        `}
`;

const DropdownContainer = styled.div`
  position: absolute;
  z-index: 1001;
  width: calc(100% - 32px);
  padding: 0 12px;
  padding-bottom: 8px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.3);
  background-color: ${COLORS.WHITE};
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  opacity: 0;
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
    background-color: ${COLORS.LIGHT_GREY};
  }
`;

const ResultContainer = styled.section`
  padding: 1em 1em 1em 1em;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.WHITE};
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0.25em;
    background-color: ${COLORS.GREY_BORDER};
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
  border-bottom: solid 1px ${COLORS.GREY_BORDER};

  h3 {
    font-weight: 600;
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

const LoadingContainer = styled.div<{ ref: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.GREY};
`;

const BlankContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2em;
  padding: 5em 0;
  color: ${COLORS.GREY};
`;

const ChipContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5em 1em;
  padding: 0 3em;
  flex-wrap: wrap;
`;

export default App;
