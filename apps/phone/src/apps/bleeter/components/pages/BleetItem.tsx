import { useAccountsValue, useCurrentAccount, useLikesValue, useSetBleets, useSetLikes } from '@apps/bleeter/hooks/state';
import { Delete, Favorite, KeyboardBackspace, MoreVert, PermIdentity, Person, Repeat, Reply, Share } from '@mui/icons-material';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import { useIsModeratorOrGreater, useIsSupportStaffOrGreater } from '@os/phone/hooks/usePlayerPermissions';
import { BleeterProps } from '@typings/bleeter';
import dayjs from 'dayjs';
import { useState } from 'react';

export const BleetItem: React.FC<BleeterProps> = ({ bleet, deleteBleet }) => {
  const likes = useLikesValue();
  const setLikes = useSetLikes();
  const setBleets = useSetBleets();
  const accounts = useAccountsValue();

  const currentAccount = useCurrentAccount();
  const account = accounts.find(account => account.id == bleet.accountId);
  const accountBase = bleet.baseAccountId ? accounts.find(account => account.id == bleet.baseAccountId) : null;

  const canAccess = account.level && account.level >= 1;
  const isSupportStaff = useIsSupportStaffOrGreater();
  const isModerator = useIsModeratorOrGreater();

  const clickedLikeButton = () => {
    let change = 0;

    setLikes((curVal) => {
      let newVal = [...curVal];

      if(newVal.includes(bleet.id)) {
        change = -1;
        newVal = newVal.filter(id => id != bleet.id);
      } else {
        change = 1;
        newVal.push(bleet.id);
      }

      return newVal;
    });

    setBleets((curVal) => {
      let newVal = [...curVal];

      return newVal.map((b) => {
        if (b.id === bleet.id) {
          return {
            ...b,
            likes: b.likes + change
          }
        }

        return b;
      })
    });

    // TODO: http request
  }

  const [deleting, setDeleting] = useState(false);

  const clickedDeleteBackButton = () => {
    setDeleting(false);
  }

  const clickedDeleteConfirmButton = () => {
    deleteBleet(bleet.id);
  }

  const clickedDeleteButton = () => {
    setDeleting(true);
  }

  return (
    <Card className="w-full" variant="outlined" style={{position: "relative"}}>
      <CardHeader
        className="pb-1"
        avatar={
          <Avatar alt="Avatar" src={account.avatarUrl} />
        }
        title={account.profileName}
        subheader={
          <Tooltip
            placement="bottom-start"
            title={dayjs.unix(bleet.createdAt).format('MMMM D, YYYY h:mm A')}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -12],
                    },
                  },
                ],
              },
            }}
          >
            <Typography
              sx={{
                margin: 0,
                fontWeight: 400,
                fontSize: '0.875rem',
                lineHeight: 1.43,
                letterSpacing: '0.01071em',
                color: 'text.secondary',
                display: 'block',
              }}
            >
              {dayjs.unix(bleet.createdAt).fromNow()}
            </Typography>
          </Tooltip>
        }
      />
      <CardContent
        className="py-1"
      >
        <Typography variant="body2" color="text.secondary">
          {bleet.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        { /* Like button */ }
        { (!deleting && currentAccount) &&
          <Button
            onClick={clickedLikeButton}
            startIcon={<Favorite />}
            sx={{borderRadius: '18px'}}
            color={ likes.includes(bleet.id) ? "error" : "inherit" }
          >
            { bleet.likes }
          </Button>
        }

        { /* Reply button */ }
        { (!deleting && currentAccount) &&
          <IconButton>
            <Reply />
          </IconButton>
        }

        { /* Delete button & confirmation */ }
        { deleting &&
          <IconButton
            onClick={clickedDeleteBackButton}
          >
            <KeyboardBackspace />
          </IconButton>
        }

        { deleting &&
          <Button
            onClick={clickedDeleteConfirmButton}
            color="error"
            startIcon={<Delete />}
          >
            Yes, delete!
          </Button>
        }

        { (!deleting && (canAccess || isModerator)) &&
          <IconButton
            onClick={clickedDeleteButton}
            style={{color: !canAccess ? 'orange' : ''}}
          >
            <Delete />
          </IconButton>
        }

        { /* Character ID (staff mode) */ }
        { isSupportStaff &&
          <Typography style={{color: 'orange', border: '1px solid orange', padding: '0 5px'}}>
            <PermIdentity /> { bleet.characterId }
          </Typography>
        }
      </CardActions>
    </Card>
  );
}
