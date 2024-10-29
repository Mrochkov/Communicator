export interface AuthServiceProps {
    login: (username: string, password: string) => any;
    isAuthenticated: boolean;
    logout: () => void;
    refreshAccessToken: () => Promise<void>
    signUp: (username: string, password: string) => Promise<any>;
}