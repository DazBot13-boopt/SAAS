'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Shield, Activity, Calendar, UserCheck, UserX, 
    AtSign, Clock, ShieldCheck, ChevronRight, BarChart3,
    Ghost, LogOut
} from 'lucide-react';
import { API_URL } from '../../utils/apiConfig';

interface User {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    subscriptionExpiresAt: string | null;
    subscription: string;
    createdAt: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('ghost_token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                if (res.status === 403) router.push('/');
                else router.push('/login');
                return;
            }

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean, days: number = 30) => {
        const token = localStorage.getItem('ghost_token');
        try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + days);

            const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    isActive: !currentStatus,
                    expiresAt: !currentStatus ? expiresAt.toISOString() : undefined
                })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { 
                    ...u, 
                    isActive: !currentStatus,
                    subscriptionExpiresAt: !currentStatus ? expiresAt.toISOString() : u.subscriptionExpiresAt
                } : u));
            }
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const updateSubscription = async (userId: string, days: number) => {
        const token = localStorage.getItem('ghost_token');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/subscription`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ expiresAt: expiresAt.toISOString(), subscription: 'PREMIUM' })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, subscriptionExpiresAt: expiresAt.toISOString(), subscription: 'PREMIUM' } : u));
            }
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#030303] text-white font-light">
            {/* Header */}
            <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                        <Ghost className="w-8 h-8 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">Console <span className="text-violet-400">Admin</span></h1>
                        <p className="text-xs text-white/40 uppercase tracking-widest mt-0.5">Gestion des utilisateurs • {users.length} total</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push('/')}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
                    >
                        Vers le Dashboard
                    </button>
                    <button 
                        onClick={() => { localStorage.clear(); router.push('/login'); }}
                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 transition-all"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={80} />
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-1">Utilisateurs actifs</p>
                        <h3 className="text-4xl font-bold">{users.filter(u => u.isActive).length}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck size={80} />
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-1">Abonnements Premium</p>
                        <h3 className="text-4xl font-bold">{users.filter(u => u.subscription === 'PREMIUM').length}</h3>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BarChart3 size={80} />
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-1">Chiffre d'Affaire Estimé</p>
                        <h3 className="text-4xl font-bold">{users.filter(u => u.subscription === 'PREMIUM').length * 29}€<span className="text-sm font-light text-white/20 ml-2">/mois</span></h3>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <h3 className="text-lg font-medium">Liste des utilisateurs</h3>
                        <div className="text-xs text-white/30 font-mono">DB-STATUS: CONNECTED</div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-white/30 text-xs uppercase tracking-widest border-b border-white/5">
                                    <th className="px-8 py-5 font-medium">Utilisateur</th>
                                    <th className="px-8 py-5 font-medium">Rôle</th>
                                    <th className="px-8 py-5 font-medium">Statut</th>
                                    <th className="px-8 py-5 font-medium">Abonnement</th>
                                    <th className="px-8 py-5 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.email}</p>
                                                    <p className="text-[10px] text-white/20 font-mono uppercase">ID: {user.id.split('-')[0]}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                                                <span className={user.isActive ? 'text-emerald-400' : 'text-amber-400 font-medium'}>
                                                    {user.isActive ? 'Actif' : 'En attente'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            {user.subscriptionExpiresAt ? (
                                                <div className="flex flex-col">
                                                    <span className="text-white/80 flex items-center gap-1.5">
                                                        <Clock size={14} className="text-violet-400" />
                                                        Expire le {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[10px] text-white/20">Version Premium</span>
                                                </div>
                                            ) : (
                                                <span className="text-white/20 italic">Aucun abonnement</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!user.isActive && (
                                                    <div className="flex bg-white/5 rounded-xl border border-white/5 p-1 overflow-hidden">
                                                        {[30, 90, 365].map(days => (
                                                            <button 
                                                                key={days}
                                                                onClick={() => toggleUserStatus(user.id, false, days)}
                                                                className="px-3 py-1.5 text-[10px] font-bold hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors rounded-lg"
                                                            >
                                                                +{days}j
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => user.isActive ? toggleUserStatus(user.id, true) : toggleUserStatus(user.id, false, 30)}
                                                    className={`p-2 rounded-xl transition-all ${user.isActive ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500/50 hover:text-rose-500' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500/50 hover:text-emerald-400'}`}
                                                    title={user.isActive ? 'Désactiver' : 'Activer (30 jours)'}
                                                >
                                                    {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
