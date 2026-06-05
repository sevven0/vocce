/**
 * Special Song Background Matcher
 * 
 * Matches currently playing songs to special background entries.
 * Handles:
 * - Case-insensitive comparison
 * - Extra spaces trimming
 * - YouTube video suffixes removal (Official Video, Lyrics, Slowed, etc.)
 */

import specialSongs from '../data/specialSongBackgrounds.json';

// YouTube common video suffixes to remove
const YOUTUBE_SUFFIXES = [
  'official music video',
  'official video',
  'music video',
  'official audio',
  'official lyric video',
  'lyric video',
  'lyrics',
  'slowed',
  'sped up',
  'reverb',
  'remastered',
  'remaster',
  'extended',
  'remix',
  'cover',
  'cover version',
  'audio',
  'visualizer',
  'video',
  'hd',
  '1 hour',
  '10 hour',
  '1 hour loop',
  '10 hour loop',
  'loop',
];

/**
 * Normalize text for comparison:
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove punctuation/special chars except hyphens
 * - Remove YouTube suffixes
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  let normalized = text.toLowerCase().trim();

  // Remove common YouTube suffixes
  for (const suffix of YOUTUBE_SUFFIXES) {
    const regex = new RegExp(`\\s*\\(.*${suffix}.*\\)\\s*$|\\s*-\\s*${suffix}\\s*$|\\s*${suffix}\\s*$`, 'i');
    normalized = normalized.replace(regex, '');
  }

  // Clean up extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Get special background for current track
 * 
 * @param {Object} track - Current track object
 * @param {string} track.title - Song title
 * @param {string} track.artist - Artist name
 * @returns {Object|null} - Special background object or null if no match
 */
export function getSpecialSongBackground(track) {
  if (!track || !track.title || !track.artist) {
    return null;
  }

  const normalizedCurrentTitle = normalizeText(track.title);
  const normalizedCurrentArtist = normalizeText(track.artist);

  if (!normalizedCurrentTitle || !normalizedCurrentArtist) {
    return null;
  }

  // Search through special songs
  for (const specialSong of specialSongs) {
    const normalizedSpecialTitle = normalizeText(specialSong.title);
    const normalizedSpecialArtist = normalizeText(specialSong.artist);

    // Match both title and artist
    if (
      normalizedCurrentTitle === normalizedSpecialTitle &&
      normalizedCurrentArtist === normalizedSpecialArtist
    ) {
      return specialSong;
    }
  }

  return null;
}

/**
 * Check if image URL is valid
 * (prevents crashes from missing images)
 */
export function isValidImageUrl(url) {
  try {
    new URL(url, window.location.origin);
    return true;
  } catch {
    return false;
  }
}
