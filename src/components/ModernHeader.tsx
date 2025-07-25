'use client';

export const ModernHeader = () => {
  return (
    <header className="relative z-20 backdrop-blur-lg bg-white/10 border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LiveStream</h1>
              <p className="text-xs text-gray-300">Watch Live Streams</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-fuchsia-400 transition-colors font-medium">
              Live Streams
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">
              Discover
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">
              Trending
            </a>
          </nav>
          
          {/* Status indicator for viewer mode */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Live Viewer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
