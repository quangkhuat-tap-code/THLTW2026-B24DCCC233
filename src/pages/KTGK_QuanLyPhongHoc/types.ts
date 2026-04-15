export enum RoomType {
  THEORY = 'Lý thuyết',
  PRACTICE = 'Thực hành',
  HALL = 'Hội trường'
}

export interface Classroom {
  id: string;
  name: string;
  seats: number;
  type: RoomType;
  manager: string;
}

export const MANAGERS = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Phạm Thị D',
  'Hoàng Văn E'
];
