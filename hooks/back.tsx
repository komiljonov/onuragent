import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useTelegramBackButton = () => {
    const router = useRouter();

    useEffect(() => {
        try {
            const tele = window.Telegram.WebApp;

            // Check if there's browser history to navigate back
            if (window.history.length > 1) {
                // Show the Telegram back button
                tele.BackButton.show();

                // Set the back button click handler to use router's back function
                tele.BackButton.onClick(() => {
                    router.back(); // Navigate to the previous page
                });
            } else {
                // No history, so hide the back button
                tele.BackButton.hide();
            }

        } catch (error) {
            console.error("Telegram WebApp is not available", error);
        }

        // Cleanup when the component unmounts
        return () => {
            if (window.Telegram?.WebApp?.BackButton) {
                window.Telegram.WebApp.BackButton.hide();
            }
        };
    }, [router]);

    return null; // No need to return anything; the effect handles everything
};

export default useTelegramBackButton;