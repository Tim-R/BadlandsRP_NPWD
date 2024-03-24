import usePlayerData from '@os/phone/hooks/usePlayerData';
import { AdvertisementProps } from '@typings/advertisements';
import { Menu, MenuItem } from '@mui/material';
import { Phone, MapPin, ArrowBigUp, Edit, Trash2, Menu as MenuIcon } from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import fetchNui from '@utils/fetchNui';
import { CallEvents } from '@typings/call';
import { CommonEvents } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

export const AdvertisementItem: React.FC<AdvertisementProps> = ({ advertisement, actionHandler }) => {
  const playerData = usePlayerData();
  const { addAlert } = useSnackbar();

  let canManage = (
    advertisement.characterId == playerData.id ||
    (
      advertisement.business &&
      playerData.groups.includes(advertisement.business)
    )
  );

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

  return (
    <div className="min-w-0 flex-1 flex items-center justify-between focus:outline-none rounded-xl my-2 dark:ring-1 dark:ring-gray-900/5 bg-neutral-200 dark:bg-neutral-900 px-3 py-3">
      <div className="shrink">
        <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 break-words">
          {advertisement.body}
        </p>
        <p className="text-sm font-light text-neutral-900 dark:text-neutral-400 break-words">
          {dayjs.unix(advertisement.bumpedAt).fromNow()} • {advertisement.business ?? advertisement.characterName}
        </p>
      </div>
      <div className="space-x-3 shrink-0">
        { (advertisement.phone || advertisement.location || canManage) &&
        <div>
          <button
            onClick={handleClick}
            className="rounded-full bg-green-100 p-3 text-green-500 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-neutral-700"
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

            { canManage &&
              <MenuItem onClick={handleDelete}><Trash2 size={20} className="pr-1" /> Delete</MenuItem>
            }
          </Menu>
        </div>
        }
      </div>
    </div>
  );
}
