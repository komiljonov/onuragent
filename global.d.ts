// global.d.ts
interface Window {
    Telegram: {
        WebApp: {
            initDataUnsafe: {
                user?: {
                    id: number;
                    first_name: string;
                    last_name?: string;
                    username?: string;
                    photo_url?: string;
                    auth_date?: number;
                    hash?: string;
                };
            };
            MainButton: {
                text: string;
                show: () => void;
                hide: () => void;
                onClick: (callback: () => void) => void;
                offClick: () => void;
            };
            sendData: (data: string) => void;
            close: () => void;
        };
    };
}
