import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };