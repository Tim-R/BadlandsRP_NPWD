import { useLocation } from 'react-router-dom';
import React from 'react';

export const Replies: React.FC = () => {

  // need to grab bleet by id and only grab bleets with the same repliedId

  const url = useLocation().pathname;
  const id = url.split("replies/")[1];  

  return (
    <div>
      Bleeter Reply: {id}
    </div>
  );
};
