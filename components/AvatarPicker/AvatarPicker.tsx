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

  let validSrc = previewUrl && previewUrl.trim() !== '' ? previewUrl : '/default-avatar.png';
  validSrc = validSrc.replace(/[<>]/g, '');
  const isLocal = validSrc.startsWith('data:') || validSrc.startsWith('blob:');

  return (
    <div>
      <div className={css.picker}>
        <div className={css.imageContainer}>
          {isLocal ? (
            <img src={validSrc} alt="User avatar preview" className={css.avatar} />
          ) : (
            <Image
              src={validSrc}
              alt="User avatar preview"
              width={150}
              height={150}
              className={css.avatar}
              priority
            />
          )}
        </div>

        <label className={previewUrl ? `${css.wrapper} ${css.reload}` : css.wrapper}>
          📷 {previewUrl ? 'Change photo' : 'Choose photo'}
          <input type="file" accept="image/*" onChange={handleFileChange} className={css.input} />
        </label>

        {previewUrl && (
          <button type="button" className={css.remove} onClick={handleRemove} title="Remove photo">
            ❌
          </button>
        )}
      </div>

      {error && <p className={css.error}>{error}</p>}
    </div>
  );
};

export default AvatarPicker;
