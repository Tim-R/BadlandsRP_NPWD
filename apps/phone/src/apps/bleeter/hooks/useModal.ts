import { useRecoilState } from 'recoil';
import { bleeterState } from './state';

export const useModal = () => {
  const [modalVisible, setModalVisible] = useRecoilState(bleeterState.showCreateBleetForm);
  const [message, setMessage] = useRecoilState(bleeterState.bleeterModalMessage);
  return { modalVisible, setModalVisible, message, setMessage };
};
