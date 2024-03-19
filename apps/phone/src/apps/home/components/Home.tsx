import React from 'react';
import { AppWrapper } from '@ui/components';
import { Box } from '@mui/material';
import { GridMenu } from '@ui/components/GridMenu';
import { useApps } from '@os/apps/hooks/useApps';
import { useExternalApps } from '@common/hooks/useExternalApps';
import { phoneState } from '@os/phone/hooks/state';
import { useRecoilValue } from 'recoil';

export const HomeApp: React.FC = () => {
  const { apps } = useApps();
  const externalApps = useExternalApps();
  const config = useRecoilValue(phoneState.resourceConfig);

  const allApps = [...apps, ...externalApps];
  let appSort = config?.appSort ?? [];

  allApps.sort((a, b) => {
    let idx_a = appSort.indexOf(a.id);

    if(idx_a === -1) {
      idx_a = 1000;
    }

    let idx_b = appSort.indexOf(b.id);

    if(idx_b === -1) {
      idx_b = 1000;
    }

    return idx_a < idx_b ? -1 : 1;
  });

  return (
    <AppWrapper>
      <Box component="div" mt={6} px={1}>
        {apps && <GridMenu xs={3} items={allApps} />}
      </Box>

      {/*<div className="absolute bottom-5 left-8 right-8">
        <div className="h-20 w-full rounded-md bg-gray-200/30 backdrop-blur">
          {apps &&
            apps.slice(0, 4).map((app) => (
              <div className="float-left h-full w-1/4" key={app.id}>
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-200/50 backdrop-blur">
                    {app.icon}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>*/}
    </AppWrapper>
  );
};
