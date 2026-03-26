export const NOTE_TAGS = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];

export type NoteFilterTag = NoteTag | 'All';

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tag: NoteTag;
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: NoteTag | string;
}
