import { List, ListItem, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BlankContainer } from '~components/index';
import { SearchType } from '~types/index';
import { PRODUCT_KEYWORDS, BRAND_KEYWORDS, COLORS } from '~constants/index';
import styled from 'styled-components';

interface DropdownProps {
  preview: string[];
  inputValue: string;
  searchType: SearchType;
  onClick: React.MouseEventHandler;
}

const Dropdown = ({
  preview,
  inputValue,
  searchType,
  onClick,
}: DropdownProps) => {
  return (
    <DropdownContainer>
      <List disablePadding>
        {preview.length ? (
          preview.slice(0, 8).map((name) => (
            <ListItem key={name} disablePadding>
              <ListButton onClick={onClick}>
                <SearchIcon color="primary" />
                <span>{name}</span>
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
                  <Chip key={name} label={name} onClick={onClick} />
                ))}
            </ChipContainer>
          </BlankContainer>
        )}
      </List>
    </DropdownContainer>
  );
};

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

const ListButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1em;
  padding: 0.5em;
  cursor: pointer;
  border-radius: 1em;
  transition: background-color 0.25s;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover {
    background-color: ${COLORS.LIGHT_GREY};
  }
`;

const ChipContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5em 1em;
  padding: 0 3em;
  flex-wrap: wrap;
`;

export default Dropdown;
