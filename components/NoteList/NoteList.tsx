'use client';

import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { logErrorResponse } from '@/app/api/_utils/utils';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteNoteM, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully', { duration: 2000 });
    },
    onError: error => {
      logErrorResponse(error);
      toast.error('Could not delete the note. Please try again.', { duration: 2000 });
    },
  });

  const confirmDelete = (id: string) => {
    toast(
      t => (
        <span className={css.confirmToast}>
          Are you sure?
          <div className={css.toastButtons}>
            <button
              className={css.confirmBtn}
              onClick={() => {
                deleteNoteM(id);
                toast.dismiss(t.id);
              }}
            >
              Yes, delete
            </button>
            <button className={css.cancelBtn} onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
          </div>
        </span>
      ),
      {
        duration: 5000,
        position: 'top-center',
      }
    );
  };

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note._id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note._id}`} scroll={false} className={css.link}>
              View details
            </Link>
            <button
              className={css.button}
              disabled={isPending}
              onClick={() => confirmDelete(note._id)}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
