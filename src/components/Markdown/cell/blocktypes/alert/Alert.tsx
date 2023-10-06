import {
  BlockNoteEditor,
  BlockSpec,
  DefaultBlockSchema,
  PropSchema,
  SpecificBlock,
  defaultProps
} from '@blocknote/core';
import { InlineContent, ReactSlashMenuItem } from '@blocknote/react';
import { Menu } from '@mantine/core';
import { useState } from 'react';
import { ErrorOutlineIcon } from '~/utils/MuiImports';
import { alertTypes } from './helpers';
import styles from './Alert.module.css';

export const alertPropSchema = {
  textAlignment: defaultProps.textAlignment,
  textColor: defaultProps.textColor,
  type: {
    default: 'warning' as const,
    values: ['warning', 'error', 'info', 'success'] as const
  }
} satisfies PropSchema;

export const Alert = (props: {
  block: SpecificBlock<DefaultBlockSchema & { alert: BlockSpec<'alert', typeof alertPropSchema, true> }, 'alert'>;
  editor: BlockNoteEditor<DefaultBlockSchema & { alert: BlockSpec<'alert', typeof alertPropSchema, true> }>;
  theme: 'light' | 'dark';
}) => {
  const [type, setType] = useState(props.block.props.type);
  const Icon = alertTypes[type].icon;

  const handleTypeChange = (newType: keyof typeof alertTypes) => {
    setType(newType);
    props.editor.updateBlock(props.block, { props: { ...props.block.props, type: newType } });
  };

  return (
    <div
      className={styles.alert}
      data-test='alertContainer'
      data-type={type}
      style={{
        backgroundColor: alertTypes[type].backgroundColor[props.theme]
      }}>
      <Menu zIndex={99999}>
        <Menu.Target>
          <div
            data-test='alertIconWrapper'
            className={styles['alert-icon-wrapper']}
            style={{
              backgroundColor: alertTypes[type].color
            }}
            contentEditable={false}>
            <Icon className={'alert-icon'} style={{ color: alertTypes[type].backgroundColor[props.theme] }} />
          </div>
        </Menu.Target>
        <Menu.Dropdown className={styles['menu-dropdown']} data-test='menuDropdown'>
          <Menu.Label>Alert Type</Menu.Label>
          <Menu.Divider />
          {Object.entries(alertTypes).map(([key, value]) => {
            const ItemIcon = value.icon;
            return (
              <Menu.Item
                key={key}
                className={`menu-item`}
                data-test='menuItem'
                data-type={key}
                icon={<ItemIcon color={key as keyof typeof alertTypes} />}
                onClick={() => handleTypeChange(key as keyof typeof alertTypes)}>
                {key.slice(0, 1).toUpperCase() + key.slice(1)}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
      <InlineContent className={styles.inlineContent} data-test='inlineContent' />
    </div>
  );
};

export const insertAlert = {
  name: 'Alert',
  execute: editor => {
    const block = editor.getTextCursorPosition().block;
    const blockIsEmpty = block.content?.length === 0;

    if (blockIsEmpty) {
      editor.updateBlock(block, { type: 'alert' });
    } else {
      editor.insertBlocks(
        [
          {
            type: 'alert'
          }
        ],
        editor.getTextCursorPosition().block,
        'after'
      );
      editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock!);
    }
  },
  aliases: ['alert', 'notification', 'emphasize', 'warning', 'error', 'info', 'success'],
  group: 'Other',
  icon: <ErrorOutlineIcon />,
  hint: 'Used to emphasize text'
} satisfies ReactSlashMenuItem<DefaultBlockSchema & { alert: BlockSpec<'alert', typeof alertPropSchema, true> }>;
