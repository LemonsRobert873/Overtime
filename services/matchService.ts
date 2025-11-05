import { Match } from '../types';

const DATA_URL = 'https://raw.githubusercontent.com/Jitendra-unatti/fancode/refs/heads/main/data/fancode.json';

let cachedMatches: Match[] | null = null;

export const getMatches = async (): Promise<Match[]> => {
  if (cachedMatches) {
    return cachedMatches;
  }
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const matches: Match[] = Array.isArray(data.matches) ? data.matches : [];
    
    matches.sort((a, b) => {
      const aIsLive = a.status?.toUpperCase() === 'LIVE';
      const bIsLive = b.status?.toUpperCase() === 'LIVE';
      // Fix: The left-hand and right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
      // Explicitly convert booleans to numbers before subtraction.
      return Number(bIsLive) - Number(aIsLive);
    });

    cachedMatches = matches;
    return matches;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    throw error;
  }
};

export const getMatchById = async (id: string): Promise<Match | null> => {
  const matches = await getMatches();
  return matches.find(match => String(match.match_id) === id) || null;
};