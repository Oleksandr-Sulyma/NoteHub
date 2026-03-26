'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { updateMe } from '@/lib/api/clientApi';
import { toast } from 'react-hot-toast';
import css from './EditProfilePage.module.css';
import AvatarPicker from '@/components/AvatarPicker/AvatarPicker';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username || user?.email || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user?.photoUrl || '');
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || user.email);
      setImagePreview(user.photoUrl || '');
    }
  }, [user]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(user?.photoUrl || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (!user) throw new Error('User not found');

      const usernameToSend = username.trim() || user.email;

      const updatedUser = await updateMe({
        username: usernameToSend,
        avatarFile: imageFile || undefined,
      });

      setUser({
        email: user.email,
        username: updatedUser.username ?? usernameToSend,
        photoUrl: updatedUser.photoUrl ?? user.photoUrl,
      });

      toast.success('Profile updated successfully!');

      router.push('/profile');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsPending(false);
    }
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <AvatarPicker profilePhotoUrl={imagePreview} onChangePhoto={handleImageChange} />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <label className={css.inputLabel}>
            Username:
            <input
              type="text"
              className={css.inputField}
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isPending}
              placeholder="Enter your username"
            />
          </label>

          <div className={css.emailInfo}>
            <span>Email:</span> <strong>{user.email}</strong>
          </div>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isPending || !username.trim()}
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
              disabled={isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
