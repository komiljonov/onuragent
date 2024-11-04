import { useEffect, useState } from 'react';

type TelegramUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date?: number;
    hash?: string;
};

export function useTelegramUser() {
    const [user, setUser] = useState<TelegramUser | null>(null);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (tg?.initDataUnsafe?.user) {
            setUser(tg.initDataUnsafe.user);
        }
    }, []);

    return user;
}