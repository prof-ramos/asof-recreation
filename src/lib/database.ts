// src/lib/database.ts

// This file now acts as a central export point for the database instances
// defined in sqlite-database.ts. This ensures the rest of the application
// has a single entry point for database access.

import { 
  noticiasDb as noticiasDbImpl,
  eventosDb as eventosDbImpl,
  filiacoesDb as filiacoesDbImpl,
  bannersDb as bannersDbImpl,
  categoriasDb as categoriasDbImpl,
  pagesDb as pagesDbImpl,
  documentsDb as documentsDbImpl,
  videosDb as videosDbImpl,
  usersDb as usersDbImpl,
  mediaDb as mediaDbImpl 
} from './sqlite-database';

// We re-export the instances with the names that are used throughout the application.
export const noticiasDb = noticiasDbImpl;
export const eventosDb = eventosDbImpl;
export const filiacoesDb = filiacoesDbImpl;
export const bannersDb = bannersDbImpl;
export const categoriasDb = categoriasDbImpl;
export const pagesDb = pagesDbImpl;
export const documentsDb = documentsDbImpl;
export const videosDb = videosDbImpl;
export const usersDb = usersDbImpl;
export const mediaDb = mediaDbImpl;

// The 'seedDatabase' function and other logic from the old file were related
// to the JSON-based mock implementation and are no longer needed with a
// persistent SQLite database. If seeding is required, it should be handled
// by a separate script that interacts with the SQLite database directly.