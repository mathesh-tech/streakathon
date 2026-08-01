import { getNotifications } from "@/actions/notifications";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default async function NotificationsPage() {
  const notifications = await getNotifications(50);

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-md mx-auto">
      <NotificationCenter initialNotifications={notifications} />
    </div>
  );
}
