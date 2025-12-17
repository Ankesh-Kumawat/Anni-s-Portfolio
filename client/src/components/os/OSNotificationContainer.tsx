import { useOS } from "@/lib/os-context";
import { OSNotification } from "./OSNotification";

export function OSNotificationContainer() {
    const { notifications, markNotificationRead } = useOS();

    const handleClose = (id: string) => {
        markNotificationRead(id);
    };

    return (
        <div className="fixed top-20 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {notifications.map((notification) => (
                    <OSNotification
                        key={notification.id}
                        notification={notification}
                        onClose={handleClose}
                    />
                ))}
            </div>
        </div>
    );
}
