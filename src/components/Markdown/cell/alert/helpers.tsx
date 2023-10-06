import { ErrorIcon, CancelIcon, InfoIcon, CheckCircle } from '~/utils/MuiImports';
import { BlockSpec, DefaultBlockSchema, defaultProps } from '@blocknote/core';
import { Alert, alertPropSchema } from './Alert';
import { createReactBlockSpec } from '@blocknote/react';

export const alertTypes = {
  warning: {
    icon: ErrorIcon,
    color: '#e69819',
    backgroundColor: {
      light: '#fff6e6',
      dark: '#805d20'
    }
  },
  error: {
    icon: CancelIcon,
    color: '#d80d0d',
    backgroundColor: {
      light: '#ffe6e6',
      dark: '#802020'
    }
  },
  info: {
    icon: InfoIcon,
    color: '#507aff',
    backgroundColor: {
      light: '#e6ebff',
      dark: '#203380'
    }
  },
  success: {
    icon: CheckCircle,
    color: '#0bc10b',
    backgroundColor: {
      light: '#e6ffe6',
      dark: '#208020'
    }
  }
} as const;

export const createAlertBlock = (theme: 'light' | 'dark') =>
  createReactBlockSpec<
    'alert',
    typeof alertPropSchema,
    true,
    DefaultBlockSchema & { alert: BlockSpec<'alert', typeof alertPropSchema, true> }
  >({
    type: 'alert' as const,
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: 'warning',
        values: ['warning', 'error', 'info', 'success']
      }
    } as const,
    containsInlineContent: true,
    render: props => <Alert {...props} theme={theme} />
  });
