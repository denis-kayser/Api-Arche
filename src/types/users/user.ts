// Props
export interface UserFilters {
  name?: string | null;
  isActive?: boolean | null;
  rolId?: number | null;
}

// Respusta
export interface User {
  id: number;
  name: string;
  rolId: number;
  roleDescription: string;
  isActive: boolean;
}


