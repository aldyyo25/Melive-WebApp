'use client';

import dynamic from 'next/dynamic';

interface AgoraVideoPlayerProps {
  appId: string;
  channel: string;
  token: string;
  uid?: number;
  className?: string;
}

const AgoraVideoPlayer = dynamic(
  () => import('./AgoraVideoPlayer').then(mod => ({ default: mod.AgoraVideoPlayer })),
  { 
    ssr: false,
    loading: () => (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <p>Loading...</p>
      </div>
    )
  }
);

export const AgoraVideoPlayerWrapper = (props: AgoraVideoPlayerProps) => {
  return <AgoraVideoPlayer {...props} />;
};
