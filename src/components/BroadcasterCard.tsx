import Image from 'next/image';
import { Broadcaster } from '@/types/streaming';

interface BroadcasterCardProps {
  broadcaster: Broadcaster;
  onJoin: (broadcaster: Broadcaster) => void;
}

export const BroadcasterCard = ({
  broadcaster,
  onJoin,
}: BroadcasterCardProps) => {
  const isLive = broadcaster.status === 'live';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {broadcaster.thumbnail ? (
          <Image
            src={broadcaster.thumbnail}
            alt={broadcaster.name}
            width={320}
            height={192}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Preview</span>
          </div>
        )}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
            isLive ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
          }`}
        >
          {isLive ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{broadcaster.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          Channel: {broadcaster.channel}
        </p>
        {broadcaster.viewers && (
          <p className="text-gray-500 text-sm mb-3">
            {broadcaster.viewers} viewers
          </p>
        )}

        <button
          onClick={() => onJoin(broadcaster)}
          disabled={!isLive}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            isLive
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLive ? 'Join Stream' : 'Offline'}
        </button>
      </div>
    </div>
  );
};
