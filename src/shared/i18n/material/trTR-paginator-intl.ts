import { MatPaginatorIntl } from '@angular/material';

const trTRRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `0 ile ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} ile ${length}`;
};

export function gettrTRPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'adet';
  paginatorIntl.nextPageLabel = 'ileri ';
  paginatorIntl.previousPageLabel = 'geri';
  paginatorIntl.getRangeLabel = trTRRangeLabel;

  return paginatorIntl;
}
