'use client';

import dynamic from 'next/dynamic';

interface AgoraVideoPlayerProps {
  appId: string;
  channel: string;
  token: string;
  uid?: number;
  className?: string;
}

const AgoraUIKitPlayer = dynamic(
  () =>
    import('./AgoraUIKitPlayer').then((mod) => ({
      default: mod.AgoraUIKitPlayer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <p>Loading player...</p>
      </div>
    ),
  }
);

export const AgoraVideoPlayerWrapper = (props: AgoraVideoPlayerProps) => {
  if (!props.appId || !props.channel || !props.token) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-red-500">
        <p>Missing required stream parameters.</p>
      </div>
    );
  }
  return <AgoraUIKitPlayer {...props} />;
};
