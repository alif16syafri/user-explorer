import { TableColumn } from '../../pages/users/hooks/useUserPage';

export enum SortOrder {
  ASC = 'ascend',
  DESC = 'descend',
}

export type Sort = {
  column: TableColumn;
  order: SortOrder;
}
