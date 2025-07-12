import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Camera, 
  Heart, 
  Clock, 
  Star, 
  Download,
  Trash2,
  Edit3,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import supabaseService, { TryOnSession, UserPreference } from '../services/supabase';

interface UserProfileProps {
  onSignOut: () => void;
  onBack?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSignOut, onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<TryOnSession[]>([]);
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [faceShape, setFaceShape] = useState('');
  const [preferredStyles, setPreferredStyles] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { user } = await supabaseService.getCurrentUser();
      if (user) {
        setUser(user);
        
        // Load try-on sessions
        const { data: sessionsData } = await supabaseService.getTryOnSessions(user.id);
        if (sessionsData) setSessions(sessionsData);

        // Load user preferences
        const { data: prefsData } = await supabaseService.getUserPreference(user.id);
        if (prefsData) {
          setPreferences(prefsData);
          setFaceShape(prefsData.face_shape);
          setPreferredStyles(prefsData.preferred_styles);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      await supabaseService.saveUserPreference({
        user_id: user.id,
        face_shape: faceShape,
        preferred_styles: preferredStyles,
      });
      setEditing(false);
      await loadUserData(); // Reload data
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await supabaseService.deleteTryOnSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabaseService.signOut();
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-ocean-gradient flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue_green/30 rounded-full mx-auto mb-4"
          >
            <div className="w-12 h-12 border-4 border-transparent border-t-blue_green rounded-full animate-spin"></div>
          </motion.div>
          <p className="text-blue_green">Loading profile...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-ocean-gradient p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-3xl border-ocean p-6 mb-8 shadow-ocean-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue_green/10 hover:bg-blue_green/20 text-blue_green rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </motion.button>
              )}
              {/* <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="relative"
              > */}
                {/* <div className="absolute inset-0 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl blur opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-r from-selective_yellow to-ut_orange rounded-xl shadow-ocean">
                  <User className="w-8 h-8 text-prussian_blue" />
                </div> */}
              {/* </motion.div> */}
              <div>
                <h1 className="text-2xl font-bold text-prussian_blue">User Profile</h1>
                <p className="text-blue_green">{user?.email}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preferences */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl border-ocean p-6 shadow-ocean-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-prussian_blue flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Preferences</span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(!editing)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue_green/10 hover:bg-blue_green/20 text-blue_green rounded-lg transition-colors"
              >
                {editing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                <span>{editing ? 'Cancel' : 'Edit'}</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-prussian_blue mb-2">
                  Face Shape
                </label>
                {editing ? (
                  <select
                    value={faceShape}
                    onChange={(e) => setFaceShape(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-sky_blue/20 rounded-xl text-prussian_blue focus:outline-none focus:ring-2 focus:ring-blue_green/50"
                  >
                    <option value="">Select face shape</option>
                    <option value="oval">Oval</option>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="heart">Heart</option>
                    <option value="diamond">Diamond</option>
                    <option value="oblong">Oblong</option>
                  </select>
                ) : (
                  <p className="text-blue_green">{faceShape || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-prussian_blue mb-2">
                  Preferred Styles
                </label>
                {editing ? (
                  <div className="space-y-2">
                    {['Aviator', 'Wayfarer', 'Round', 'Square', 'Cat-Eye', 'Oversized'].map((style) => (
                      <label key={style} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={preferredStyles.includes(style)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferredStyles([...preferredStyles, style]);
                            } else {
                              setPreferredStyles(preferredStyles.filter(s => s !== style));
                            }
                          }}
                          className="rounded text-blue_green focus:ring-blue_green"
                        />
                        <span className="text-blue_green">{style}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {preferredStyles.length > 0 ? (
                      preferredStyles.map((style) => (
                        <span
                          key={style}
                          className="px-2 py-1 bg-blue_green/10 text-blue_green rounded-lg text-sm"
                        >
                          {style}
                        </span>
                      ))
                    ) : (
                      <p className="text-blue_green">No preferences set</p>
                    )}
                  </div>
                )}
              </div>

              {editing && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSavePreferences}
                  className="w-full bg-gradient-to-r from-selective_yellow to-ut_orange hover:from-ut_orange hover:to-selective_yellow text-prussian_blue font-bold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl border-ocean p-6 shadow-ocean-xl"
          >
            <h2 className="text-xl font-bold text-prussian_blue mb-6 flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Statistics</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue_green/10 rounded-xl">
                <Camera className="w-8 h-8 text-blue_green mx-auto mb-2" />
                <div className="text-2xl font-bold text-prussian_blue">{sessions.length}</div>
                <div className="text-sm text-blue_green">Try-on Sessions</div>
              </div>
              <div className="text-center p-4 bg-selective_yellow/10 rounded-xl">
                <Heart className="w-8 h-8 text-selective_yellow mx-auto mb-2" />
                <div className="text-2xl font-bold text-prussian_blue">{preferredStyles.length}</div>
                <div className="text-sm text-blue_green">Preferred Styles</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-3xl border-ocean p-6 mt-8 shadow-ocean-xl"
        >
          <h2 className="text-xl font-bold text-prussian_blue mb-6 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Try-on Sessions</span>
          </h2>

          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.slice(0, 6).map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-xl p-4 border border-sky_blue/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue_green">
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="text-prussian_blue font-medium mb-2">
                    Glasses ID: {session.glasses_id}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-blue_green" />
                    <span className="text-sm text-blue_green">Screenshot saved</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-16 h-16 text-blue_green/50 mx-auto mb-4" />
              <p className="text-blue_green">No try-on sessions yet</p>
              <p className="text-sm text-blue_green/60">Start trying on glasses to see your history here</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile; 