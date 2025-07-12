import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import supabaseService, { TryOnSession } from '../services/supabase';

interface SessionHistoryProps {
  onSessionSelect?: (session: TryOnSession) => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ onSessionSelect }) => {
  const [sessions, setSessions] = useState<TryOnSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedSession, setSelectedSession] = useState<TryOnSession | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const { user } = await supabaseService.getCurrentUser();
      if (user) {
        const { data } = await supabaseService.getTryOnSessions(user.id);
        if (data) {
          setSessions(data);
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await supabaseService.deleteTryOnSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleDownloadScreenshot = async (session: TryOnSession) => {
    try {
      const url = await supabaseService.getScreenshotUrl(session.screenshot_url);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tryon-${session.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading screenshot:', error);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.glasses_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || session.glasses_id.includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = new Date(session.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, TryOnSession[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue_green/30 rounded-full"
        >
          <div className="w-8 h-8 border-4 border-transparent border-t-blue_green rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-prussian_blue flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Try-On History</span>
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadSessions}
          className="flex items-center space-x-2 px-3 py-2 bg-blue_green/10 hover:bg-blue_green/20 text-blue_green rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue_green" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-sky_blue/20 rounded-xl text-prussian_blue placeholder-blue_green/60 focus:outline-none focus:ring-2 focus:ring-blue_green/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue_green" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white/10 border border-sky_blue/20 rounded-xl text-prussian_blue focus:outline-none focus:ring-2 focus:ring-blue_green/50"
          >
            <option value="all">All Types</option>
            <option value="custom">Custom</option>
            <option value="1">Classic Round</option>
            <option value="2">Modern Sunglasses</option>
            <option value="8">Oval Elegance</option>
            <option value="9">Shades Supreme</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {Object.keys(groupedSessions).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([date, daySessions]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue_green" />
                <h3 className="text-lg font-semibold text-prussian_blue">{date}</h3>
                <span className="text-sm text-blue_green">({daySessions.length} sessions)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {daySessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    className={`glass-card rounded-xl p-4 border transition-all cursor-pointer ${
                      selectedSession?.id === session.id 
                        ? 'border-blue_green shadow-ocean' 
                        : 'border-sky_blue/20'
                    }`}
                    onClick={() => {
                      setSelectedSession(session);
                      onSessionSelect?.(session);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-blue_green">
                        {new Date(session.created_at).toLocaleTimeString()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <div className="text-prussian_blue font-medium mb-2">
                      Glasses ID: {session.glasses_id}
                    </div>
                    
                    <div className="text-sm text-blue_green mb-3">
                      Scale: {session.adjustments.scale.toFixed(2)} | 
                      X: {session.adjustments.offsetX.toFixed(2)} | 
                      Y: {session.adjustments.offsetY.toFixed(2)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadScreenshot(session);
                        }}
                        className="flex items-center space-x-1 text-blue_green hover:text-prussian_blue transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(session);
                          onSessionSelect?.(session);
                        }}
                        className="flex items-center space-x-1 text-selective_yellow hover:text-ut_orange transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-blue_green/50 mx-auto mb-4" />
          <p className="text-blue_green text-lg mb-2">No try-on sessions found</p>
          <p className="text-blue_green/60">Start trying on glasses to see your history here</p>
        </div>
      )}

      {/* Selected Session Details */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-xl p-6 border border-blue_green/20"
          >
            <h3 className="text-lg font-bold text-prussian_blue mb-4">Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-prussian_blue mb-2">Adjustments</h4>
                <div className="space-y-1 text-sm text-blue_green">
                  <div>Scale: {selectedSession.adjustments.scale.toFixed(3)}</div>
                  <div>Offset X: {selectedSession.adjustments.offsetX.toFixed(3)}</div>
                  <div>Offset Y: {selectedSession.adjustments.offsetY.toFixed(3)}</div>
                  <div>Rotation: {selectedSession.adjustments.rotation.toFixed(3)}°</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-prussian_blue mb-2">Metadata</h4>
                <div className="space-y-1 text-sm text-blue_green">
                  <div>Glasses ID: {selectedSession.glasses_id}</div>
                  <div>Created: {new Date(selectedSession.created_at).toLocaleString()}</div>
                  <div>Session ID: {selectedSession.id}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionHistory; 