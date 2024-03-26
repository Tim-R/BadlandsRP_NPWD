import { useCallback, useEffect } from "react";
import usePlayerData from "./usePlayerData"
import { useSettingsValue } from "@apps/settings/hooks/useSettings";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { phoneState } from "./state";

export const usePlayerPermissions = () => {
  const playerData = usePlayerData();
  const { adminMode } = useSettingsValue();

  const setSupportStaff = useSetRecoilState(phoneState.isSupportStaffOrGreater);
  const setModerator = useSetRecoilState(phoneState.isModeratorOrGreater);
  const setAdmin = useSetRecoilState(phoneState.isAdminOrGreater);
  const setSuperadmin = useSetRecoilState(phoneState.isSuperadminOrGreater);

  // Compute groups when adminMode or playerData.groups change
  useEffect(() => {
    setSupportStaff(computeIsSupportStaffOrGreater());
    setModerator(computeIsModeratorOrGreater());
    setAdmin(computeIsAdminOrGreater());
    setSuperadmin(computeIsSuperadminOrGreater());
  }, [playerData, adminMode]);

  const playerHasGroup = useCallback((group: string) => {
    return playerData.groups.includes(group);
  }, [playerData]);

  const playerHasAnyGroup = useCallback((groups: string[]) => {
    return playerData.groups.some(group => groups.includes(group));
  }, [playerData]);

  /* Computed based on admin mode setting */
  const computeIsSupportStaffOrGreater = useCallback(() => {
    return adminMode && playerHasAnyGroup(['staff', 'moderator', 'admin', 'superadmin']);
  }, [playerData, adminMode]);

  const computeIsModeratorOrGreater = useCallback(() => {
    return adminMode && playerHasAnyGroup(['moderator', 'admin', 'superadmin']);
  }, [playerData, adminMode]);

  const computeIsAdminOrGreater = useCallback(() => {
    return adminMode && playerHasAnyGroup(['admin', 'superadmin']);
  }, [playerData, adminMode]);

  const computeIsSuperadminOrGreater = useCallback(() => {
    return adminMode && playerHasGroup('superadmin');
  }, [playerData, adminMode]);

  return {
    playerHasGroup,
    playerHasAnyGroup,
    computeIsSupportStaffOrGreater,
    computeIsModeratorOrGreater,
    computeIsAdminOrGreater,
    computeIsSuperadminOrGreater,
  }
}

export const useIsSupportStaffOrGreater = () => useRecoilValue(phoneState.isSupportStaffOrGreater);
export const useIsModeratorOrGreater = () => useRecoilValue(phoneState.isModeratorOrGreater);
export const useIsAdminOrGreater = () => useRecoilValue(phoneState.isAdminOrGreater);
export const useIsSuperadminOrGreater = () => useRecoilValue(phoneState.isSuperadminOrGreater);
