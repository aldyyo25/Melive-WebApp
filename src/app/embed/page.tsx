'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmbeddablePlayer } from '@/components/EmbeddablePlayer';

function EmbedContent() {
  const searchParams = useSearchParams();
  const streamId = searchParams.get('streamId');
  const width = searchParams.get('width') || '100%';
  const height = searchParams.get('height') || '400px';
  const autoplay = searchParams.get('autoplay') !== 'false';

  if (!streamId) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 text-white">
        <p>Stream ID is required</p>
      </div>
    );
  }

  return (
    <EmbeddablePlayer
      streamId={streamId}
      width={width}
      height={height}
      autoplay={autoplay}
    />
  );
}

export default function EmbedPage() {
  return (
    <div className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96 bg-gray-900 text-white">
            <p>Loading...</p>
          </div>
        }
      >
        <EmbedContent />
      </Suspense>
    </div>
  );
}
