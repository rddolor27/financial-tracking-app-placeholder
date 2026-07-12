'use client';

import { useState } from 'react';
import { useAuthStore } from '@financial-tracker/store';
import { usersService } from '@/lib/api';
import { Card } from '@/components/ui';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [currency, setCurrency] = useState(user?.currency ?? 'PHP');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const updated = await usersService.updateProfile({ first_name: firstName, last_name: lastName, currency });
      useAuthStore.setState({ user: updated });
      setProfileMsg('Profile updated.');
    } catch {
      setProfileMsg('Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg('Password must be at least 8 characters.');
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg('');
    try {
      await usersService.changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMsg('Password changed.');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setPasswordMsg('Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';
  const labelCls = 'block text-[12px] font-semibold text-muted mb-1';

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <div>
        <div className="font-bold text-[16px]">Settings</div>
        <div className="text-[12px] text-faint mt-0.5">Profile &amp; preferences</div>
      </div>

      <Card>
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div className="font-bold text-[14.5px]">Profile</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Default currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
              <option value="PHP">PHP - Philippine Peso</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={profileLoading} className="btn-p disabled:opacity-50">
              {profileLoading ? 'Saving…' : 'Save profile'}
            </button>
            {profileMsg && <span className="text-[12px] text-faint">{profileMsg}</span>}
          </div>
        </form>
      </Card>

      <Card>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div className="font-bold text-[14.5px]">Change password</div>
          <div>
            <label className={labelCls}>Current password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={passwordLoading || !currentPassword || !newPassword}
              className="btn-p disabled:opacity-50"
            >
              {passwordLoading ? 'Changing…' : 'Change password'}
            </button>
            {passwordMsg && <span className="text-[12px] text-faint">{passwordMsg}</span>}
          </div>
        </form>
      </Card>

      <Card>
        <div className="font-bold text-[14.5px] mb-2">Account info</div>
        <p className="text-[13px] text-muted">Email: {user?.email}</p>
      </Card>
    </div>
  );
}
