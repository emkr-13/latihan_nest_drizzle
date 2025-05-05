export interface PaginationResponse {
  total_data: number;
  total_page: number;
  total_display: number;
  first_page: boolean;
  last_page: boolean;
  prev: number;
  current: number;
  next: number;
  detail: number[];
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_NUMBERS = 5;

export function calculatePagination(
  total: number,
  pagenum: number,
  limit: number = DEFAULT_PAGE_SIZE,
): PaginationResponse {
  // Validasi input
  if (total < 0) throw new Error('Total tidak boleh negatif');
  if (pagenum < 1) throw new Error('Halaman minimal 1');
  if (limit < 1) throw new Error('Limit minimal 1');

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(pagenum, totalPages);

  // Hitung prev dan next
  const prevPage = currentPage > 1 ? currentPage - 1 : 0;
  const nextPage = currentPage < totalPages ? currentPage + 1 : 0;

  // Hitung range halaman yang ditampilkan
  let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_NUMBERS / 2));
  let endPage = Math.min(totalPages, startPage + MAX_PAGE_NUMBERS - 1);

  // Adjust startPage if endPage is at maximum
  if (endPage - startPage + 1 < MAX_PAGE_NUMBERS) {
    startPage = Math.max(1, endPage - MAX_PAGE_NUMBERS + 1);
  }

  // Generate detail pages array
  const detail = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  // Hitung total item yang ditampilkan di halaman terakhir
  const totalDisplay =
    currentPage === totalPages ? total - (totalPages - 1) * limit : limit;

  return {
    total_data: total,
    total_page: totalPages,
    total_display: totalDisplay,
    first_page: startPage > 1,
    last_page: endPage < totalPages,
    prev: prevPage,
    current: currentPage,
    next: nextPage,
    detail: detail,
  };
}
