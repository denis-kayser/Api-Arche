export interface ModuleFilters {
  moduleID?: number | null;
}


export interface Module {
  id: number
  description: string
  icon: string
  parentId: any
  order: number
  level: number
  path: string
}


export interface MenuItem {
  id: number;
  href: string;
  label: string;
  active: boolean;
  icons: string;
  children: MenuItem[];
}