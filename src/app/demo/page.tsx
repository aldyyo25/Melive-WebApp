'use client';

import { useState } from 'react';
import { EmbeddablePlayer } from '@/components/EmbeddablePlayer';

export default function DemoPage() {
  const [streamId, setStreamId] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);

  const handleShowPlayer = () => {
    if (streamId.trim()) {
      setShowPlayer(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Embeddable Player Demo</h1>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Stream ID"
            value={streamId}
            onChange={(e) => setStreamId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleShowPlayer}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Load Player
          </button>
        </div>

        {showPlayer && streamId && (
          <div className="border border-gray-300 rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Embedded Player:</h3>
            <EmbeddablePlayer streamId={streamId} width="100%" height="400px" />
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Embed Code Example</h2>
        <p className="mb-4">
          Use this iframe code to embed the player in external websites:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          {`<iframe 
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed?streamId=YOUR_STREAM_ID&width=800px&height=450px"
  width="800" 
  height="450" 
  frameborder="0" 
  allowfullscreen>
</iframe>`}
        </pre>
      </div>
    </div>
  );
}
