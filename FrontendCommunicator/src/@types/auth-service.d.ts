export interface AuthServiceProps {
    login: (username: string, password: string) => any;
    isAuthenticated: boolean;
    // logout: () => void;
}