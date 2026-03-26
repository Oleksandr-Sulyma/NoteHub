'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const formatDate = (date: string) =>
    new Date(date)
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(',', '');

  let content;

  if (!id) {
    content = <p>Error: Note ID is missing from the URL.</p>;
  } else if (isLoading || isFetching) {
    content = <p>Loading, please wait...</p>;
  } else if (error || !note) {
    content = <p>Something went wrong.</p>;
  } else {
    const formattedDate = note.updatedAt
      ? `Updated: ${formatDate(note.updatedAt)}`
      : `Created: ${formatDate(note.createdAt)}`;

    content = (
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formattedDate}</p>
      </div>
    );
  }

  return <div className={css.container}>{content}</div>;
};

export default NoteDetailsClient;
