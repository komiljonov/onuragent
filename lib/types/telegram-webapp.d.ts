interface Telegram {
  WebApp: {

    BackButton: {
      show(): void;
      onClick(callback: () => void): void;
      hide(): void;
    };

    initData: string;
    initDataUnsafe: {
      user: {
        id: number;
      }
    };
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: {
      [key: string]: string;
    };
    headerColor: string;
    backgroundColor: string;
    isExpanded: boolean;
    viewportHeight: number;
    expand(): void;
    close(): void;
    MainButton: {
      isVisible: boolean;
      isProgressVisible: boolean;
      isActive: boolean;
      text: string;
      show(): void;
      hide(): void;
      enable(): void;
      disable(): void;
      setParams(params: { [key: string]: string }): void;
      setText(text: string): void;
      onClick(callback: () => void): void;
    };
  };
}

// Declare the global window interface
interface Window {
  Telegram: Telegram;
}