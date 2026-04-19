import type { Theme, SxProps } from '@mui/material/styles';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button, { buttonClasses } from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const [workspace, setWorkspace] = useState(data[0]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      setWorkspace(newValue);
      onClose();
    },
    [onClose]
  );

  const buttonBg: SxProps<Theme> = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>
        {workspace?.name?.charAt(0)}
      </Avatar>

      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        {workspace?.name}
      </Box>

      <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55, width: 240 } },
      }}
    >
      <Scrollbar sx={{ maxHeight: 240 }}>
        <MenuList>
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === workspace?.id}
              onClick={() => handleChangeWorkspace(option)}
              sx={{ height: 48 }}
            >
              <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>
                {option.name?.charAt(0)}
              </Avatar>

              <Typography
                noWrap
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}
              >
                {option.name}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Scrollbar>

      <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

      <Tooltip title="Contact your administrator to create a new site" placement="top">
        <span>
          <Button
            fullWidth
            disabled
            startIcon={<Iconify width={18} icon="mingcute:add-line" />}
            sx={{
              gap: 2,
              justifyContent: 'flex-start',
              fontWeight: 'fontWeightMedium',
              [`& .${buttonClasses.startIcon}`]: {
                m: 0,
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          >
            Create a Site
          </Button>
        </span>
      </Tooltip>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
