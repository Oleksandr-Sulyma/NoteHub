'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { createNote } from '@/lib/api/clientApi';
import { useDraftStore } from '@/lib/store/noteStore';
import { NOTE_TAGS } from '@/types/note';
import type { NoteSchema, NoteTag } from '@/types/note';
import  { noteSchema } from '@/types/note';

import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useDraftStore();

  const {
    register: noteInput,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: draft.title || '',
      content: draft.content || '',
      tag: (draft.tag as NoteTag) || NOTE_TAGS[0],
    },
  });

  const formValues = watch();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully!');
      clearDraft();
      router.push('/notes/filter/All');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create note');
    },
  });

  

  const onSubmit = (values: NoteSchema) => {
    mutate(values);
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.form} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          {...noteInput('title')}
          type="text"
          placeholder="Enter note title..."
          className={`${css.input} ${errors.title ? css.inputError : ''}`}
        />
        {errors.title && <span className={css.error}>{errors.title.message}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          {...noteInput('content')}
          rows={8}
          placeholder="Write your thoughts here..."
          className={`${css.textarea} ${errors.content ? css.inputError : ''}`}
        />
        {errors.content && <span className={css.error}>{errors.content.message}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select {...noteInput('tag')} className={css.select}>
          {NOTE_TAGS.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag.message}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={isPending || isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending || isSubmitting}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}