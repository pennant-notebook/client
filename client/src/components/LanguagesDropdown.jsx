import { memo } from 'react';
import { Select, MenuItem } from '@mui/material';
import { customStyles } from '../constants/customStyles';
import { languageOptions } from '../constants/languageOptions';

const LanguagesDropdown = memo(({ onSelectChange, language }) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      styles={customStyles}
      value={language.id}
      onChange={selectedOption => onSelectChange(selectedOption)}>
      {languageOptions.map(option => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  );
});

export default LanguagesDropdown;
