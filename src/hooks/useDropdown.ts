import { useState } from 'react';

const useDropdown = () => {
  const [dropdownActive, setDropdownActive] = useState<boolean>(false);

  const handleDropdownOpen = () => {
    setDropdownActive(true);
  };

  const handleDropdownClose = () => {
    setDropdownActive(false);
  };

  return {
    dropdownActive,
    handleDropdownOpen,
    handleDropdownClose,
  };
};

export default useDropdown;
