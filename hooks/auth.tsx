"use client";
import {
    createContext,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import request from "@/lib/request";
import { useMutation } from "@tanstack/react-query";

interface IUser {
    chat_id: number;
    name: string;

    logged_in: boolean;
}

interface IUserProvider {
    userId: number | null;
    setUserId: Dispatch<SetStateAction<number | null>>;
    userData?: IUser;
    setUserData: Dispatch<SetStateAction<IUser | undefined>>;

    auth: boolean | null;
    setAuth: Dispatch<SetStateAction<boolean | null>>;
}

const UserContext = createContext<IUserProvider | null>(null);

const fetchUserData = async (userId: number): Promise<IUser> => {
    const { data } = await request.get(`/me/${userId}`);


    return data;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [userData, setUserData] = useState<IUser>();
    const [auth, setAuth] = useState<boolean | null>(null);

    const mutation = useMutation({
        mutationKey: ["userData"],
        mutationFn: fetchUserData,
        onSuccess: (data) => {
            setUserData(data);
            setAuth(data.logged_in);
        },
    });

    const fetchUser = useCallback((userId: number) => {
        mutation.mutate(userId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTimeout(() => {
            const query = new URLSearchParams(window.location.search);
            let tele;
            try {
                tele = window.Telegram.WebApp;
            } catch {
            }


            const userData = tele!.initDataUnsafe;
            let user_id;

            if (userData.user) {
                user_id = userData.user.id;
            } else {
                user_id = query.get("userId");
            }


            setUserId(user_id as number);
            if (user_id) {
                setAuth(true);
            } else {
                setAuth(false);
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUser(userId);
        }
    }, [userId, fetchUser]);

    return (
        <UserContext.Provider value={{ userId, userData, auth, setUserData, setAuth, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
