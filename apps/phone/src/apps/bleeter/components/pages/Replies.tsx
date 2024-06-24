import { useLocation } from 'react-router-dom';
import React from 'react';
import { useBleetsValue } from '@apps/bleeter/hooks/state';
import { BleetItem } from './BleetItem';

export const Replies: React.FC = () => {

  const url = useLocation().pathname;
  const id = url.split("replies/")[1];  

  const bleets = useBleetsValue();
  const singleBleet = bleets.find(bleet => bleet.id === Number(id));


  return (
    <div>
      <BleetItem key={singleBleet.id} bleet={singleBleet}/>
    </div>
  );
};
