import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api';
import type { ProfileUpdateData, PasswordUpdateData } from '@/api/auth';
import { useAuthStore, useToastStore } from '@/stores';

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState<ProfileUpdateData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const profileMutation = useMutation({
    mutationFn: (data: ProfileUpdateData) => authApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      addToast({
        type: 'success',
        message: 'Profile updated successfully!',
        duration: 3000,
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordUpdateData) => authApi.updatePassword(data),
    onSuccess: () => {
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      addToast({
        type: 'success',
        message: 'Password updated successfully!',
        duration: 3000,
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      addToast({
        type: 'error',
        message: 'Passwords do not match',
        duration: 3000,
      });
      return;
    }
    passwordMutation.mutate(passwordData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Profile Information</h2>
          <p className="card-description">Update your name and email address</p>
        </div>
        <form onSubmit={handleProfileSubmit}>
          <div className="card-content space-y-4">
            {profileMutation.error && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                {(profileMutation.error as any)?.response?.data?.error?.message || 'Failed to update profile'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="first_name" className="label">First Name</label>
                <input
                  id="first_name"
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="last_name" className="label">Last Name</label>
                <input
                  id="last_name"
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>
          <div className="card-footer justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={profileMutation.isPending}
            >
              {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Change Password</h2>
          <p className="card-description">Update your password to keep your account secure</p>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <div className="card-content space-y-4">
            {passwordMutation.error && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
                {(passwordMutation.error as any)?.response?.data?.error?.message || 'Failed to update password'}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="current_password" className="label">Current Password</label>
              <input
                id="current_password"
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new_password" className="label">New Password</label>
              <input
                id="new_password"
                type="password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                className="input"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm_password" className="label">Confirm New Password</label>
              <input
                id="confirm_password"
                type="password"
                value={passwordData.password_confirmation}
                onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                className="input"
                required
              />
              {passwordData.password && passwordData.password_confirmation &&
                passwordData.password !== passwordData.password_confirmation && (
                <p className="text-danger text-sm">Passwords do not match</p>
              )}
            </div>
          </div>
          <div className="card-footer justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={passwordMutation.isPending || passwordData.password !== passwordData.password_confirmation}
            >
              {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Information</h2>
        </div>
        <div className="card-content">
          <div className="flex items-center gap-4">
            <div className="avatar avatar-lg">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
