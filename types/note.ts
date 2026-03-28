import * as z from 'zod';

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

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: NoteTag | string;
}

export const noteSchema = z.object({
  title: z.string().min(3, 'Min 3 characters').max(50, 'Max 50 characters'),
  content: z.string().max(500, 'Max 500 characters').optional().or(z.literal('')),
  tag: z.enum(NOTE_TAGS, 'Please select a valid tag'),
});

export type NoteSchema = z.infer<typeof noteSchema>;