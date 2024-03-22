import { useRecoilValue } from 'recoil';
import { phoneState } from './state';
import { PhonePlayerData } from '@typings/phone';

const usePlayerData = () => {
  return useRecoilValue<PhonePlayerData>(phoneState.playerData);
};

export default usePlayerData;
