import { styled, TextField } from '~/utils/MuiImports';

const LanguageSelector = styled(TextField)({
  position: 'absolute',
  left: '12px',
  color: 'lightgray',
  width: 'auto',
  '& .MuiSelect-icon': {
    color: 'lightgray',
    visibility: 'hidden'
  },
  '&:hover .MuiSelect-icon': {
    visibility: 'visible'
  },
  '& .MuiInputBase-input': {
    color: 'lightgray',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    padding: 0,
    fontSize: '0.75rem',
    letterSpacing: '0.08333em',
    textTransform: 'uppercase'
  },
  '& .MuiInput-underline:before': {
    borderColor: 'transparent'
  },
  '& .MuiInput-underline:after': {
    borderColor: 'transparent'
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderColor: 'transparent'
  },
  '& .MuiInput-underline.Mui-focused': {
    boxShadow: 'none'
  }
});

export default LanguageSelector;
