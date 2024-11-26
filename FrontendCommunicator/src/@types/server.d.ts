export interface Server {
    id: number;
    name: string;
    server: string;
    description: string;
    icon: string;
    category: string;
    private: boolean; 
    password?: string;
    channel_server: {
        id: number;
        name: string;
        server: number;
        topic: string;
        owner: number;
    }[];
    member: { id: number; username: string; avatar_url: string | null }[];
}