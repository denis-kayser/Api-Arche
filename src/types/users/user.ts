// Props
export interface UserFilters {
  name?: string | null;
  isActive?: boolean | null;
  rolId?: number | null;
}

// Interface para usuario
export interface User {
  id: number;
  name: string;
  rolId: number;
  isActive: boolean;
  email: string;
  password: string;
  imageUrl: string;
  authID: string;
  typeAuth: string;
}



// Interface para iniciar sesion con google
export interface UserSignInGoogle {
  email: string;
  authID: string;
}

// Interface para respuesta de inicio de sesion con google
export interface UserSignInGoogleResponse {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  typeAuth: string;
}



















export interface UserSignIn {
  id: number;
  name: string;
  email: string;
  password?: string;
  imageUrl: string;
}

export interface UserSignIn {
  id: number;
  name: string;
  email: string;
  password?: string;
  imageUrl: string;
}



// Props
export interface UserRegisterGoogleProps {
  name?: string;
  email: string;
  imageUrl?: string;
  authID?: string;
}

export interface UserRegisterProps {
  name?: string;
  email: string;
  password: string;
  rolID?: number;
}

export interface SignInGoogleProps {
  email: string;
  authID: string;
}
