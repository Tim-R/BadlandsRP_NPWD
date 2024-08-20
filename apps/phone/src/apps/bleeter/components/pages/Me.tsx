import {
  useMyAccountsValue,
  useCurrentAccount,
  useSetCurrentAccount,
  useSetAccounts,
  useAccountsValue,
} from '@apps/bleeter/hooks/state';
import { MockBleeterAccountUsers } from '@apps/bleeter/utils/constants';
import { Add, Edit, Person } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useConfig } from '@os/phone/hooks';
import usePlayerData from '@os/phone/hooks/usePlayerData';
import { BleeterAccount, BleeterAccountLevel, BleeterEvents } from '@typings/bleeter';
import { ServerPromiseResp } from '@typings/common';
import { Modal2, NPWDInput, TextField } from '@ui/components';
import fetchNui from '@utils/fetchNui';
import { buildRespObj } from '@utils/misc';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';

export const Me: React.FC = () => {
  const playerData = usePlayerData();
  const config = useConfig();

  const accounts = useAccountsValue();
  const setAccounts = useSetAccounts();
  const setCurrentAccount = useSetCurrentAccount();
  const currentAccount = useCurrentAccount();
  

  const { addAlert } = useSnackbar();

  useEffect(() => {
    console.log("Current account changed:", currentAccount.profileName);
  }, [currentAccount]);


  const handleChange = (event: SelectChangeEvent) => {
    let account = accounts.find(
      (a: BleeterAccount) => a.id.toString() == (event.target.value as string),
    );


    if (!account) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    
    console.log(account.profileName, '<---account FOR SELECTOR')
    setCurrentAccount(account);
  };

  const [modalAccountOpen, setModalAccountOpen] = useState(false);
  const [modalAccountError, setModalAccountError] = useState('');
  const [modalAccountWorking, setModalAccountWorking] = useState(false);

  const [modalProfileName, setModalProfileName] = useState(''); 
  const onChangeModalProfileName = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    if (text.length > config.bleeter.maxAccountNameLength) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setModalProfileName(text);
  };

  const [modalAvatarUrl, setModalAvatarUrl] = useState('');
  const onChangeModalAvatarUrl = (e: ChangeEvent<HTMLInputElement>) =>
    setModalAvatarUrl(e.target.value);

  const [accountCharsRemaining, setAccountCharsRemaining] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<BleeterAccount[]>>(BleeterEvents.FETCH_MY_ACCOUNTS, {});
        setAccounts(resp.data)
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };
  
    fetchAccounts();
  }, []);

  useEffect(() => {
    setAccountCharsRemaining(config.bleeter.maxAccountNameLength - modalProfileName.length);
  }, [modalProfileName]);

  const openCreateModal = () => {
    setModalAccountOpen(true);
  };

  const closeCreateModal = () => {
    setModalAccountOpen(false);
  };

  const createAccount = async () => {
    if (modalAccountWorking) {
      return;
    }

    setModalAccountWorking(true);

    try {
      const resp = await fetchNui<ServerPromiseResp<BleeterAccount>>(BleeterEvents.CREATE_ACCOUNT, {
        profileName: modalProfileName,
        avatarUrl: modalAvatarUrl,
      });

      if (resp.status == 'error') {
        setModalAccountError(resp.errorMsg);
        setModalAccountWorking(false);
        return;
      }

      let createdAccount = resp.data;

      if (!createdAccount) {
        setModalAccountError('Unknown error while creating account');
        setModalAccountWorking(false);
        return;
      }

      setAccounts((accounts) => [...accounts, createdAccount]);
      setCurrentAccount(createdAccount);
    } catch {
      setModalAccountError('Unknown error occurred');
      setModalAccountWorking(false);
      return;
    }

    setModalProfileName('');
    setModalAvatarUrl('');
    setModalAccountOpen(false);
    setModalAccountWorking(false);
  };

  const [processing, setProcessing] = useState(false);
  const [accountProfileName, setAccountProfileName] = useState(
    currentAccount ? currentAccount.profileName : '',
  );
  
  const [accountAvatarUrl, setAccountAvatarUrl] = useState(
    currentAccount ? currentAccount.avatarUrl : '',
  );
  const onChangeAccountProfileName = (e: ChangeEvent<HTMLInputElement>) =>
    setAccountProfileName(e.target.value);
  const onChangeAccountAvatarUrl = (e: ChangeEvent<HTMLInputElement>) =>
    setAccountAvatarUrl(e.target.value);

  useEffect(() => {
    if (!currentAccount) {
      return;
    }
    setProcessing(false);
    setAccountProfileName(currentAccount.profileName);
    setAccountAvatarUrl(currentAccount.avatarUrl);
  }, [currentAccount]);

  const updateAccount = async () => {
    if (currentAccount.level < BleeterAccountLevel.LEVEL_ADMIN || processing) {
      return;
    }

    if (
      currentAccount.profileName == accountProfileName &&
      currentAccount.avatarUrl == accountAvatarUrl
    ) {
      return;
    }

    setProcessing(true);

    try {
      const resp = await fetchNui<ServerPromiseResp<BleeterAccount>>(BleeterEvents.EDIT_ACCOUNT, {
        accountId: currentAccount.id,
        profileName: accountProfileName,
        avatarUrl: accountAvatarUrl,
      });

      if (resp.status == 'error') {
        addAlert({
          message: resp.errorMsg,
          type: 'error',
        });

        setProcessing(false);
        return;
      }
    } catch {
      addAlert({
        message: 'Unknown error occurred',
        type: 'error',
      });

      setProcessing(false);
      return;
    }

    addAlert({
      message: 'Account updated',
      type: 'success',
    });

    setProcessing(false);
  };

  /* Users modal */

  const defaultUser = {
    id: null,
    vrpId: 0,
    characterId: 0,
    profileName: '',
    level: 1,
    active: false,
  };

  const [modalUsersError, setModalUsersError] = useState('');
  const [modalUsersMode, setModalUsersMode] = useState('');
  const [modalUsersUser, setModalUsersUser] = useState(defaultUser);
  const [modalUsersOpen, setModalUsersOpen] = useState(false);
  const [modalUsersUsers, setModalUsersUsers] = useState([]);
  const [modalUsersUsername, setModalUsersUsername] = useState('');
  const [modalUsersLevel, setModalUsersLevel] = useState(1);
  const onChangeModalUsersUsername = (e: ChangeEvent<HTMLInputElement>) =>
    setModalUsersUsername(e.target.value);
  const onChangeModalUsersLevel = (e: ChangeEvent<HTMLInputElement>) =>
    setModalUsersLevel(Number((e.target as HTMLInputElement).value));

  const getAccountUsers = async () => {
    try {
      const resp = await fetchNui<ServerPromiseResp<BleeterAccount[]>>(
        BleeterEvents.FETCH_ACCOUNT_USERS,
        { accountId: currentAccount.id },
        buildRespObj(MockBleeterAccountUsers),
      );

      setModalUsersUsers(resp.data);
    } catch (e) {
      setModalUsersError('Error fetching users');
    }
  };

  const openUsersModal = () => {
    getAccountUsers();
    setModalUsersOpen(true);
  };

  const closeUsersModal = () => {
    setModalUsersOpen(false);
    setModalUsersError('');
    setModalUsersMode('');
    setModalUsersUser(defaultUser);
    setModalUsersUsername('');
    setModalUsersLevel(1);
    setModalUsersUsers([]);
  };

  const addUser = () => {
    setModalUsersUser(defaultUser);
    setModalUsersMode('add');
  };

  const editUser = (user: any) => {
    setModalUsersUser(user);
    setModalUsersUsername(user.profileName);
    setModalUsersLevel(user.level);
    setModalUsersMode('edit');
  };

  const removeUser = async () => {
    try {
      const resp = await fetchNui<ServerPromiseResp<BleeterAccount[]>>(
        BleeterEvents.DELETE_ACCOUNT_USER,
        { accountId: currentAccount.id, characterId: modalUsersUser.characterId },
        buildRespObj(true),
      );

      if (resp.status == 'error') {
        setModalUsersError(resp.errorMsg);
        return;
      }

      setModalUsersUsers(
        [...modalUsersUsers].filter((user) => user.characterId != modalUsersUser.characterId),
      );
      setModalUsersMode('');
      setModalUsersUser(defaultUser);
    } catch (e) {
      setModalUsersError('Error deleting user');
    }
  };

  const submitUser = async () => {
    try {
      let resp = null;

      if (modalUsersMode == 'add') {
        resp = await fetchNui<ServerPromiseResp<boolean>>(
          BleeterEvents.ADD_ACCOUNT_USER,
          { accountId: currentAccount.id, profileName: modalUsersUsername, level: modalUsersLevel },
          buildRespObj(true),
        );
      } else if (modalUsersMode == 'edit') {
        resp = await fetchNui<ServerPromiseResp<boolean>>(
          BleeterEvents.EDIT_ACCOUNT_USER,
          {
            vrpId: modalUsersUser.vrpId,
            characterId: modalUsersUser.characterId,
            accountId: currentAccount.id,
            level: modalUsersLevel,
          },
          buildRespObj(true),
        );
      }

      if (!resp || resp.status == 'error') {
        setModalUsersError(resp.errorMsg);
        return;
      }
    } catch (e) {
      setModalUsersError(`Error ${modalUsersMode == 'add' ? 'adding' : 'editing'} user`);
      return;
    }

    getAccountUsers();
    setModalUsersMode('');
    setModalUsersUsername('');
    setModalUsersUser(defaultUser);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      const resp = await fetchNui<ServerPromiseResp<boolean>>(BleeterEvents.DELETE_ACCOUNT, {
        accountId: currentAccount.id,
      });

      if (resp.status == 'error') {
        addAlert({
          message: resp.errorMsg,
          type: 'error',
        });

        setConfirmDelete(false);
        return;
      }
    } catch {
      addAlert({
        message: 'Unknown error occurred',
        type: 'error',
      });

      setConfirmDelete(false);
      return;
    }

    addAlert({
      message: 'Account deleted',
      type: 'success',
    });

    setConfirmDelete(false);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div className="flex grow flex-col items-stretch">
      {/* Account select dropdown and create button */}
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <FormControl fullWidth size="small">
            <InputLabel id="current-account-label">Current Account</InputLabel>
            <Select
              labelId="current-account-label"
              id="current-account"
              value={currentAccount?.id.toString()}
              label="Current Account"
              onChange={handleChange}
              size="small"
            >
              {
              [...accounts]
                .sort((a, b) => {
                  return a.profileName
                    .toLowerCase()
                    .localeCompare(b.profileName.toLocaleLowerCase());
                })
                .map((account) => {
                  return (
                    <MenuItem key={account.id} value={account.id.toString()} selected={account.active}>
                      {account.profileName}
                    </MenuItem>
                  );
                })}
              {accounts.length == 0 && (
                <MenuItem value="-1" disabled>
                  No access to any accounts
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ height: '100%' }}
            onClick={openCreateModal}
          >
            <Add />
          </Button>
        </Grid>
      </Grid>

      <Divider />

      {!currentAccount && (
        <div className="flex grow flex-col items-center justify-center">
          <Typography variant="h6">No account selected</Typography>
        </div>
      )}

      {/* Account settings */}
      {currentAccount && (
        <div className="flex grow flex-col pt-4">
          <div>
            <img
              src={currentAccount.avatarUrl}
              className="mx-auto h-24 w-24 rounded-full text-center"
              alt={'avatar'}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-neutral-400">Display Name</div>
            <NPWDInput
              value={accountProfileName}
              onChange={onChangeAccountProfileName}
              className="focus:ring-2 focus:ring-blue-500"
              readOnly={currentAccount.characterId != playerData.id}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-neutral-400">Avatar URL</div>
            <NPWDInput
              value={accountAvatarUrl}
              onChange={onChangeAccountAvatarUrl}
              className="focus:ring-2 focus:ring-blue-500"
              readOnly={currentAccount.characterId != playerData.id}
            />
          </div>

          {currentAccount.level >= BleeterAccountLevel.LEVEL_ADMIN && (
            <div className="mt-4">
              <Button onClick={openUsersModal} variant="outlined" className="w-full" color="info">
                Edit Users
              </Button>
            </div>
          )}

          {currentAccount.level >= BleeterAccountLevel.LEVEL_ADMIN &&
            currentAccount.characterId == playerData.id && (
              <div className="mt-4">
                <Button
                  onClick={updateAccount}
                  variant="outlined"
                  className="w-full"
                  color="primary"
                >
                  Update
                </Button>
              </div>
            )}

          {currentAccount.level >= BleeterAccountLevel.LEVEL_ADMIN &&
            currentAccount.characterId == playerData.id &&
            !confirmDelete && (
              <div className="mt-4">
                <Button onClick={deleteAccount} variant="outlined" className="w-full" color="error">
                  Delete Account
                </Button>
              </div>
            )}

          {currentAccount.level >= BleeterAccountLevel.LEVEL_ADMIN &&
            currentAccount.characterId == playerData.id &&
            confirmDelete && (
              <div className="mt-4">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      onClick={cancelDelete}
                      variant="outlined"
                      className="w-full"
                      color="info"
                    >
                      Go back
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      onClick={deleteAccount}
                      variant="outlined"
                      className="w-full"
                      color="error"
                    >
                      Confirm delete
                    </Button>
                  </Grid>
                </Grid>
              </div>
            )}
        </div>
      )}

      {/* Create account modal */}
      <Modal2 visible={modalAccountOpen} handleClose={() => {}}>
        <Typography sx={{ mb: 2 }}>Create Bleeter Account</Typography>

        <FormControl fullWidth sx={{ mb: 1 }}>
          <TextField
            label={`Display Name`}
            fullWidth
            onChange={onChangeModalProfileName}
            value={modalProfileName}
          />
          <FormHelperText>Characters remaining: {accountCharsRemaining}</FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 1 }}>
          <TextField
            label={`Avatar URL`}
            fullWidth
            onChange={onChangeModalAvatarUrl}
            value={modalAvatarUrl}
          />
        </FormControl>

        {modalAccountError?.length > 0 && (
          <Typography color="#EB5B5B">{modalAccountError}</Typography>
        )}

        <Grid container justifyContent="flex-end">
          <Button onClick={closeCreateModal}>Close</Button>

          <Button
            onClick={createAccount}
            variant="outlined"
            color="success"
            sx={{ ml: 2 }}
            disabled={modalAccountWorking}
          >
            Create Account
          </Button>
        </Grid>
      </Modal2>

      {/* Edit users modal */}
      <Modal2 visible={modalUsersOpen} handleClose={() => {}}>
        <List dense={true} sx={{ maxHeight: '350px', overflowY: 'scroll' }}>
          <ListItem
            secondaryAction={
              <IconButton edge="end" onClick={addUser}>
                <Add />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={'Add User'} />
          </ListItem>

          {modalUsersUsers
            .sort((a, b) => b.level - a.level)
            .map((user) => {
              return (
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => editUser(user)}>
                      <Edit />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <img src={user.avatarUrl} alt={'avatar'} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`@${user.profileName}`}
                    secondary={
                      user.level == BleeterAccountLevel.LEVEL_MEMBER ? 'Member' : 'Administrator'
                    }
                  />
                </ListItem>
              );
            })}
        </List>

        {modalUsersMode != '' && (
          <div className="mt-4">
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label={`Username`}
                fullWidth
                onChange={onChangeModalUsersUsername}
                value={modalUsersUsername}
                disabled={modalUsersMode == 'edit'}
              />
              <FormHelperText>Username is case sensitive</FormHelperText>
            </FormControl>

            <FormControl className="mb-4">
              <FormLabel>Access Level</FormLabel>
              <RadioGroup
                row
                defaultValue="1"
                value={modalUsersLevel}
                onChange={onChangeModalUsersLevel}
              >
                <FormControlLabel value="1" control={<Radio />} label="Member" />
                <FormControlLabel value="2" control={<Radio />} label="Administrator" />
              </RadioGroup>
            </FormControl>
          </div>
        )}

        {modalUsersError?.length > 0 && <Typography color="#EB5B5B">{modalUsersError}</Typography>}

        <Grid container justifyContent="flex-end">
          <Button onClick={closeUsersModal}>Close</Button>

          {modalUsersMode == 'edit' && (
            <Button onClick={removeUser} variant="outlined" color="error" sx={{ ml: 2 }}>
              Remove
            </Button>
          )}

          {modalUsersMode != '' && (
            <Button onClick={submitUser} variant="outlined" color="success" sx={{ ml: 2 }}>
              {modalUsersMode == 'edit' ? 'Edit' : 'Add'}
            </Button>
          )}
        </Grid>
      </Modal2>
    </div>
  );
};
