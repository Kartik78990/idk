import React, { useEffect, useState } from 'react';
import {
  ArrowLeft, Settings, Bell, Shield, CreditCard, HelpCircle, LogOut, Pencil
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface ProfilePanelProps {
  onBackClick: () => void;
  onLogoutSuccess: () => void; // callback after logout
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ onBackClick, onLogoutSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        setLoading(false);
        return;
      }
      if (user) {
        setEmail(user.email ?? '');
        setName(user.user_metadata?.full_name || '');
        setAvatar(user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Save updated name to Supabase user metadata
  const handleSaveName = async () => {
    setIsEditing(false);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (error) console.error('Error updating profile:', error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      onLogoutSuccess();
    }
  };

  // Avatar upload is still local only here (you can extend with supabase storage)
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <div className="flex h-full bg-[#0c0920] text-white animate-fadeIn">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#1d1d42]">
          <div className="flex items-center gap-4">
            <button onClick={onBackClick} className="p-2 rounded-lg hover:bg-[#1d1d42] transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <button className="p-2 rounded-lg hover:bg-[#1d1d42] transition-colors">
            <Settings size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-6 mb-12">
              <label className="cursor-pointer relative">
                <input type="file" hidden onChange={handleAvatarUpload} />
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-medium">
                      {email.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </label>
              <div>
                {isEditing ? (
                  <>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="bg-transparent border-b border-gray-500 text-white text-xl mb-2 focus:outline-none"
                      placeholder="Your full name"
                    />
                    <input
                      value={email}
                      readOnly
                      className="bg-transparent border-b border-gray-500 text-gray-400 focus:outline-none cursor-not-allowed"
                    />
                    <button
                      onClick={handleSaveName}
                      className="mt-2 text-sm text-purple-400 hover:underline flex items-center gap-1"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-2">{name || 'No name set'}</h1>
                    <p className="text-gray-400">{email}</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-sm text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {[ 
                { icon: Bell, label: 'Notifications', color: 'purple' },
                { icon: Shield, label: 'Privacy & Security', color: 'blue' },
                { icon: CreditCard, label: 'Payment Methods', color: 'green' },
                { icon: HelpCircle, label: 'Help & Support', color: 'orange' },
              ].map(({ icon: Icon, label, color }, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1a1a2e] hover:bg-[#1d1d42] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                      <Icon size={24} className={`text-${color}-400`} />
                    </div>
                    <span>{label}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1a1a2e] hover:bg-[#1d1d42] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <LogOut size={24} className="text-red-400" />
                  </div>
                  <span className="text-red-400">Log Out</span>
                </div>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
