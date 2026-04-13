'use client';

import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../utils/apiConfig';
import { Bell, Camera, Copy, Link2, Target, Upload, UserCircle, Video, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Account {
  id: string;
  username: string;
  profileImage?: string;
  bannerImage?: string;
  bio?: string;
  niche?: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NewFeaturesProps {
  accounts: Account[];
  selectedAccount?: Account | null;
  profileForm?: {
    profileImage: string;
    bio: string;
    bannerImage: string;
    niche: string;
  };
  onProfileFormChange?: (form: any) => void;
  token?: string | null;
  onClose?: () => void;
}

export default function NewFeatures({
  selectedAccount: externalSelectedAccount,
  profileForm: externalProfileForm,
  onProfileFormChange,
  token,
  onClose
}: NewFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'linkcast' | 'notifications'>('linkcast');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    profileImage: '',
    bannerImage: '',
    bio: '',
    niche: ''
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [bannerImagePreview, setBannerImagePreview] = useState('');

  const [castImageFile, setCastImageFile] = useState<File | null>(null);
  const [castTargetUrl, setCastTargetUrl] = useState('');
  const [generatedCastLink, setGeneratedCastLink] = useState('');
  const [generatingCast, setGeneratingCast] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  useEffect(() => {
    if (externalSelectedAccount && externalProfileForm) {
      setSelectedAccount(externalSelectedAccount);
      setProfileForm(externalProfileForm);
      setProfileImagePreview(externalProfileForm.profileImage || '');
      setBannerImagePreview(externalProfileForm.bannerImage || '');
      setShowProfileModal(true);
    }
  }, [externalSelectedAccount, externalProfileForm]);

  useEffect(() => {
    if (!token) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket'] });
    socket.on('notification', () => {
      fetchNotifications();
    });
    return () => {
      socket.disconnect();
    };
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      // silent UI polling
    }
  };

  const uploadImage = async (file: File, type: 'profile' | 'banner'): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error('Upload image impossible');
    const data = await res.json();
    return data.url;
  };

  const updateProfile = async () => {
    if (!selectedAccount) return;
    setUploading(true);
    try {
      let finalProfile = profileImagePreview;
      let finalBanner = bannerImagePreview;

      if (profileImageFile) finalProfile = await uploadImage(profileImageFile, 'profile');
      if (bannerImageFile) finalBanner = await uploadImage(bannerImageFile, 'banner');

      const payload = {
        ...profileForm,
        profileImage: finalProfile || profileForm.profileImage,
        bannerImage: finalBanner || profileForm.bannerImage
      };

      const res = await fetch(`${API_URL}/twitter-accounts/${selectedAccount.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Mise a jour profil echouee');

      onProfileFormChange?.(payload);
      setShowProfileModal(false);
      setProfileImageFile(null);
      setBannerImageFile(null);
      alert('Profil mis a jour');
    } catch (e: any) {
      alert(e.message || 'Erreur profil');
    } finally {
      setUploading(false);
    }
  };

  const generateLinkCast = async () => {
    if (!castImageFile || !castTargetUrl) {
      alert('Ajoute une image et une URL cible');
      return;
    }

    setGeneratingCast(true);
    try {
      const uploadedImageUrl = await uploadImage(castImageFile, 'banner');
      const res = await fetch(`${API_URL}/link-cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          targetUrl: castTargetUrl
        })
      });
      if (!res.ok) throw new Error('Generation impossible');
      const data = await res.json();
      setGeneratedCastLink(`${window.location.origin}/v/${data.slug}`);
    } catch (e: any) {
      alert(e.message || 'Erreur generation');
    } finally {
      setGeneratingCast(false);
    }
  };

  const copyGeneratedLink = async () => {
    if (!generatedCastLink) return;
    await navigator.clipboard.writeText(generatedCastLink);
    alert('Lien copie');
  };

  const markAsRead = async (id: string) => {
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotifications();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Outils Avances
          </h1>
          <p className="text-slate-400">Link cast, profil et notifications.</p>
        </div>

        <button
          onClick={onClose}
          className="fixed top-6 right-6 p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all z-[70]"
          title="Fermer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('linkcast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'linkcast' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <Video className="w-4 h-4" /> Generate Link Cast Fake Video
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'notifications' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
            {unreadCount > 0 && <span className="bg-red-500 text-xs rounded-full px-2 py-0.5">{unreadCount}</span>}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'linkcast' && (
            <motion.div key="linkcast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCastImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">URL cible</label>
                  <input
                    type="url"
                    value={castTargetUrl}
                    onChange={(e) => setCastTargetUrl(e.target.value)}
                    placeholder="https://ton-site.com/cible"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3"
                  />
                </div>

                <button
                  onClick={generateLinkCast}
                  disabled={generatingCast}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  {generatingCast ? 'Generation...' : 'Generate Link'}
                </button>

                {generatedCastLink && (
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Lien genere</p>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={generatedCastLink}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-blue-300"
                      />
                      <button onClick={copyGeneratedLink} className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800 rounded-lg border border-slate-700">
                {notifications.map((notif, i) => (
                  <div
                    key={notif.id}
                    className={`p-4 ${i !== notifications.length - 1 ? 'border-b border-slate-700' : ''} ${!notif.read ? 'bg-slate-750' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-2">{new Date(notif.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                      {!notif.read && (
                        <button onClick={() => markAsRead(notif.id)} className="text-blue-400 hover:text-blue-300 text-sm">
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && <div className="p-10 text-center text-slate-500">Aucune notification</div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showProfileModal && selectedAccount && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 rounded-2xl w-full max-w-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <UserCircle className="w-6 h-6 text-blue-400" /> Modifier le Profil @{selectedAccount.username}
                </h3>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Image de Banniere</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setBannerImageFile(file);
                      if (file) setBannerImagePreview(URL.createObjectURL(file));
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
                  />
                  {bannerImagePreview && <img src={bannerImagePreview} alt="banner" className="mt-3 w-full h-36 object-cover rounded-lg" />}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Photo de Profil</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setProfileImageFile(file);
                      if (file) setProfileImagePreview(URL.createObjectURL(file));
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2"
                  />
                  {profileImagePreview && <img src={profileImagePreview} alt="profile" className="mt-3 w-24 h-24 object-cover rounded-full border border-slate-700" />}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Bio</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => {
                      const next = { ...profileForm, bio: e.target.value };
                      setProfileForm(next);
                      onProfileFormChange?.(next);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block flex items-center gap-2"><Target className="w-4 h-4" /> Niche</label>
                  <input
                    value={profileForm.niche}
                    onChange={(e) => {
                      const next = { ...profileForm, niche: e.target.value };
                      setProfileForm(next);
                      onProfileFormChange?.(next);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowProfileModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg">
                    Annuler
                  </button>
                  <button
                    onClick={updateProfile}
                    disabled={uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    {uploading ? <Upload className="w-4 h-4 animate-pulse" /> : <Camera className="w-4 h-4" />}
                    Mettre a jour le profil
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
