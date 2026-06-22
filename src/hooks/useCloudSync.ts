// useCloudSync.ts
// Custom Hook to manage Cloud Integration bidirectional synchronizations

import { useState, useEffect } from 'react';
import { supabaseSync } from '../lib/supabaseSync';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function useCloudSync(userId: string | undefined) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('ef26_last_cloud_sync') || null;
  });

  const recordSuccess = () => {
    const timestamp = new Date().toLocaleString();
    setLastSyncTime(timestamp);
    localStorage.setItem('ef26_last_cloud_sync', timestamp);
    setSyncError(null);
  };

  /**
   * PUSH local matches/profiles/settings to Cloud database
   */
  const performPushSync = async () => {
    if (!isSupabaseConfigured || !userId) return;
    setSyncing(true);
    setSyncError(null);
    try {
      await supabaseSync.syncLocalToCloud(userId);
      recordSuccess();
    } catch (err: any) {
      console.error('Push sync failure:', err);
      setSyncError(err.message || 'Failed uploading data to Supabase');
    } finally {
      setSyncing(false);
    }
  };

  /**
   * PULL remote matches/profiles/settings from Cloud, restoring on local state
   */
  const performPullSync = async () => {
    if (!isSupabaseConfigured || !userId) return;
    setSyncing(true);
    setSyncError(null);
    try {
      const result = await supabaseSync.syncCloudToLocal(userId);
      if (result.success) {
        recordSuccess();
      } else {
        setSyncError(result.message);
      }
    } catch (err: any) {
      console.error('Pull sync failure:', err);
      setSyncError(err.message || 'Failed restoring data from cloud');
    } finally {
      setSyncing(false);
    }
  };

  // Sync automatically on login if never synced before
  useEffect(() => {
    if (userId && !lastSyncTime && isSupabaseConfigured) {
      performPullSync();
    }
  }, [userId]);

  return {
    syncing,
    syncError,
    lastSyncTime,
    performPushSync,
    performPullSync,
  };
}
export default useCloudSync;
