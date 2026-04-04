export type JikanImage = {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
};

export type JikanMangaListEntry = {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: { jpg: JikanImage; webp: JikanImage };
  score: number | null;
  chapters: number | null;
  genres?: { mal_id: number; name: string }[];
};

export type JikanPagination<T> = {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
  data: T;
};
