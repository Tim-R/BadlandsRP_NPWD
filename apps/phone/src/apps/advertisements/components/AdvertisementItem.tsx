import usePlayerData from '@os/phone/hooks/usePlayerData';
import { AdvertisementProps } from '@typings/advertisements';
import { Menu, MenuItem } from '@mui/material';
import { Phone, MapPin, ArrowBigUp, Edit, Trash2, Menu as MenuIcon, Info } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import fetchNui from '@utils/fetchNui';
import { CallEvents } from '@typings/call';
import { CommonEvents } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useConfig } from '@os/phone/hooks';
import { useIsModeratorOrGreater, useIsSupportStaffOrGreater } from '@os/phone/hooks/usePlayerPermissions';
import { cn } from '@utils/css';

export const AdvertisementItem: React.FC<AdvertisementProps> = ({ advertisement, actionHandler }) => {
  const playerData = usePlayerData();
  const { addAlert } = useSnackbar();
  const config = useConfig();

  const canManage = (
    advertisement.characterId == playerData.id ||
    (
      advertisement.business &&
      playerData.groups.includes(advertisement.business)
    )
  );

  const ageMinutes = Math.floor((Math.floor(Date.now() / 1000) - advertisement.bumpedAt) / 60);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handlePhone = () => {
    handleClose();

    let phone = advertisement.phone;

    fetchNui<void>(CallEvents.INITIALIZE_CALL, { receiverNumber: phone });
  }

  const handleGps = () => {
    handleClose();

    let coords = advertisement.location.coords;

    fetchNui<void>(CommonEvents.SET_GPS, coords);

    addAlert({
      message: 'GPS location set',
      type: 'success',
    });
  }

  const handleBump = () => {
    handleClose();
    actionHandler(advertisement, 'bump');
  }

  const handleEdit = () => {
    handleClose();
    actionHandler(advertisement, 'edit');
  }

  const handleDelete = () => {
    handleClose();
    actionHandler(advertisement, 'delete');
  }

  const isSupportStaff = useIsSupportStaffOrGreater();
  const isModerator = useIsModeratorOrGreater();

  return (
    <div className="min-w-0 flex-1 flex items-center justify-between focus:outline-none rounded-xl my-2 dark:ring-1 dark:ring-gray-900/5 bg-neutral-200 dark:bg-neutral-900 px-3 py-3">
      <div className="shrink" style={{maxWidth: '85%'}}>
        <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 break-words">
          {advertisement.body}
        </p>
        <p className="text-sm font-light text-neutral-900 dark:text-neutral-400 break-words">
          {dayjs.unix(advertisement.bumpedAt).fromNow()} • {advertisement.business ?? advertisement.characterName}
        </p>
        {ageMinutes > config.advertisements.hideAfter &&
          <p className="text-sm font-light text-red-900 dark:text-red-400 break-words">
            Expired - Bump to show on home page
          </p>
        }
      </div>
      <div className="space-x-3 shrink-0">
        { (advertisement.phone || advertisement.location || canManage || isSupportStaff) &&
        <div>
          <button
            onClick={handleClick}
            className={cn(
              'rounded-full p-3',
              canManage ?
                'bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-neutral-700' :
                'bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-neutral-700'
            )}
          >
            <MenuIcon size={20} />
          </button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
          >
            { advertisement.phone &&
              <MenuItem onClick={handlePhone}><Phone size={20} className="pr-1" /> Phone</MenuItem>
            }

            { advertisement.location &&
              <MenuItem onClick={handleGps}><MapPin size={20} className="pr-1" /> Set GPS</MenuItem>
            }

            { canManage &&
              <MenuItem onClick={handleBump}><ArrowBigUp size={20} className="pr-1" /> Bump</MenuItem>
            }

            { canManage &&
              <MenuItem onClick={handleEdit}><Edit size={20} className="pr-1" /> Edit</MenuItem>
            }

            { (canManage || isModerator) &&
              <MenuItem onClick={handleDelete} style={{color: !canManage ? 'orange' : ''}}><Trash2 size={20} className="pr-1" /> Delete</MenuItem>
            }

            { isSupportStaff &&
              <MenuItem onClick={handleClose} style={{color: 'orange'}}><Info size={20} className="pr-1" /> Character ID: {advertisement.characterId}</MenuItem>
            }
          </Menu>
        </div>
        }
      </div>
    </div>
  );
}
