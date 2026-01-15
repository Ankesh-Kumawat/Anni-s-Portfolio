import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the app window is maximized
 * Checks for the specific classes that Window component adds when maximized
 * 
 * Returns true if window is maximized (takes full screen)
 * Returns false if window is in normal/small mode
 */
export function useWindowState() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const checkWindowState = () => {
            // Find the ResizableBox container (has rounded-lg when normal, !rounded-none when maximized)
            const resizableBox = document.querySelector('.relative.flex.flex-col.overflow-hidden') as HTMLElement;
            
            if (!resizableBox) {
                setIsMaximized(false);
                return;
            }

            // Check if it has the maximized classes
            const classList = resizableBox.className;
            const hasRoundedNone = classList.includes('!rounded-none');
            const hasFullWidth = classList.includes('!w-full');
            const hasFullHeight = classList.includes('!h-full');
            
            const maximized = hasRoundedNone && hasFullWidth && hasFullHeight;
            setIsMaximized(maximized);
        };

        // Check on mount
        checkWindowState();

        // Use MutationObserver to watch for class changes
        const observer = new MutationObserver(checkWindowState);
        
        // Observe the body for any class changes in descendants
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true
        });

        // Also check on clicks (for maximize button)
        document.addEventListener('click', checkWindowState);

        // Cleanup
        return () => {
            observer.disconnect();
            document.removeEventListener('click', checkWindowState);
        };
    }, []);

    return { isMaximized };
}
