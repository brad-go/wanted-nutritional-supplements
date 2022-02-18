import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Tab, Tabs, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ProductItem, BlankContainer, Dropdown } from '~components/index';
import { COLORS } from '~constants/index';
import useDropdown from '~hooks/useDropdown';
import { type NutritionType, SearchType } from '~types/index';
import { createFuzzyMatcher } from '~utils/index';
import { fetchApi } from '~api/index';
import styled, { css } from 'styled-components';
import useIntersect from '~hooks/useIntersect';

function App() {
  const [data, setData] = useState<NutritionType[]>([]);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.PRODUCT);
  const [preview, setPreview] = useState<string[]>([]);
  const [result, setResult] = useState<NutritionType[]>([]);
  const [list, setList] = useState<NutritionType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { dropdownActive, handleDropdownOpen, handleDropdownClose } =
    useDropdown();

  const renew = () => {
    setList((prev) => {
      const arr = result.slice(prev.length, prev.length + 10);
      if (arr.length < 10) setIsEnd(true);
      return prev.concat(arr);
    });
  };

  const { setTarget, isEnd, setIsEnd } = useIntersect(renew, [renew, result]);

  const sortResult = (arr: NutritionType[], val: string, regex: RegExp) => {
    const result = arr.map((one) => {
      const { productName, brand } = one;
      let longestDistance = 0;
      one[searchType === SearchType.PRODUCT ? 'productName' : 'brand']!.replace(
        regex,
        (match: string, ...group: string[]) => {
          const letters = group.slice(0, val.length);
          let lastIndex = 0;
          for (let i = 0, l = letters.length; i < l; i++) {
            const idx = match.indexOf(letters[i], lastIndex);
            if (lastIndex > 0) {
              longestDistance = Math.max(longestDistance, idx - lastIndex);
            }
            lastIndex = idx + 1;
          }
          return match;
        },
      );
      return {
        productName,
        brand,
        longestDistance,
      };
    });
    return result
      .sort((a, b) => a.longestDistance - b.longestDistance)
      .map(({ productName, brand }) => ({ productName, brand }));
  };

  const search = (value: string) => {
    const regex = createFuzzyMatcher(value.toLowerCase());
    if (searchType === SearchType.PRODUCT) {
      const result = sortResult(
        data.filter((product) => regex.test(product.productName.toLowerCase())),
        value,
        regex,
      );
      setPreview(result.map(({ productName }) => productName));
      return result;
    }
    const result = sortResult(
      data
        .filter((one) => one.brand !== null)
        .filter((product) => regex.test(product.brand!.toLowerCase())),
      value,
      regex,
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
    return sortResult(result, value, regex);
  };

  const handleTypeChange = (e: React.SyntheticEvent<Element, Event>) => {
    const { id } = e.target as HTMLButtonElement;
    setSearchType(
      id.includes('product') ? SearchType.PRODUCT : SearchType.BRAND,
    );
    setInputValue('');
    setResult([]);
    setPreview([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!dropdownActive) {
      handleDropdownOpen();
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
      search(value);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(search(inputValue));
    setList([]);
    setIsEnd(false);
    handleDropdownClose();
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    const value = (e.target as HTMLButtonElement).innerText;
    setInputValue(value);
    setResult(search(value));
    setList([]);
    setIsEnd(false);
    handleDropdownClose();
  };

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
              <Tab
                label="제품명 검색"
                id="search-product"
                aria-controls="search-product-panel"
              />
              <Tab
                label="브랜드 검색"
                id="search-brand"
                aria-controls="search-brand-panel"
              />
            </Tabs>
            <InputContainer dropdownActive={dropdownActive}>
              <TextField
                variant="standard"
                placeholder={`검색할 ${
                  searchType === SearchType.PRODUCT ? '제품명을' : '브랜드를'
                } 입력하세요.`}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleDropdownOpen}
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
              <Dropdown
                preview={preview}
                inputValue={inputValue}
                searchType={searchType}
                onClick={handlePreviewClick}
              />
              <Backdrop onClick={handleDropdownClose} />
            </>
          )}
        </FormContainer>
        <ResultContainer>
          {result.length ? (
            <div>
              {list.map(({ productName, brand }) => (
                <ProductItem
                  key={productName}
                  title={productName}
                  subtitle={brand}
                  href="/#"
                />
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

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  opacity: 0;
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

const LoadingContainer = styled.div<{ ref: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${COLORS.GREY};
`;

export default App;
