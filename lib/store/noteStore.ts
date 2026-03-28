import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteSchema } from '@/types/note';

type DraftStore = {
  draft: NoteSchema;
  setDraft: (values: NoteSchema) => void;
  clearDraft: () => void;
};

const initialDraft: NoteSchema = { title: '', content: '', tag: 'Todo' };

export const useDraftStore = create<DraftStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: values => set({ draft: values }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
    }
  )
);
