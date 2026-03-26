'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import css from './AvatarPicker.module.css';

type Props = {
  onChangePhoto: (file: File | null) => void;
  profilePhotoUrl?: string;
};

const AvatarPicker = ({ profilePhotoUrl, onChangePhoto }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (profilePhotoUrl) {
      setPreviewUrl(profilePhotoUrl);
    }
  }, [profilePhotoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only images allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size 5MB');
      return;
    }

    onChangePhoto(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChangePhoto(null);
    setPreviewUrl('');
  };

  const isLocal = previewUrl.startsWith('data:');

  return (
    <div>
      <div className={css.picker}>
        {previewUrl && (
        isLocal ? (
          <img
            src={previewUrl}
            alt="User avatar preview"
            className={css.avatar}
          />
        ) : (
          <Image
            src={previewUrl}
            alt="User avatar preview"
            width={300}
            height={300}
            className={css.avatar}
          />
        )
        )}

        <label className={previewUrl ? `${css.wrapper} ${css.reload}` : css.wrapper}>
          📷 Choose photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={css.input}
          />
        </label>

        {previewUrl && (
          <button type="button" className={css.remove} onClick={handleRemove}>
            ❌
          </button>
        )}
      </div>

      {error && <p className={css.error}>{error}</p>}
    </div>
  );
};

export default AvatarPicker;