import { useBleetsValue } from '@apps/bleeter/hooks/state';
import React, { useEffect, useState } from 'react';
import { BleetItem } from './BleetItem';
import { Bleet } from '@typings/bleeter';


// can't grab every bleet, will be too costly. Need to only grab bleets from last month then sort by likes

export const Top: React.FC = () => {
  const bleets: Bleet[] = useBleetsValue(); // need to make new one that only grabs bleets from last month
  const [topBleets, setTopBleets] = useState([]);

  const currentDate = new Date();
  const filteredBleets = bleets.filter((bleet) => {
    const bleetDate = new Date(bleet.createdAt * 1000);
    const diffInMonths = (currentDate.getFullYear() - bleetDate.getFullYear()) * 12 + (currentDate.getMonth() - bleetDate.getMonth());
    return diffInMonths <= 5;
  });

  useEffect(() => {
    if (!filteredBleets || filteredBleets.length === 0) {
      return;
    }

    const sortedBleets = [...filteredBleets]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 20) // only going to show top 20 bleets atm
      .map((bleet) => <BleetItem key={bleet.id} bleet={bleet} />);

    setTopBleets(sortedBleets);
  }, [bleets]);

  return (
    <div>
      <div>{topBleets}</div>
    </div>
  );
};

