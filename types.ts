
export interface Match {
  match_id: number;
  title: string;
  tournament: string;
  status: string;
  image: string;
  language: string;
  adfree_stream: string | null;
  dai_stream: string | null;
  STREAMING_CDN: {
    [key: string]: string | null;
  };
}
