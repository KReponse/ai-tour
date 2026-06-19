import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCircle, Loader2 } from "lucide-react";

const API = "http://localhost:5000/api/admin";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await axios.patch(
      `${API}/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchNotifications();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">Notifications</h1>

      <div className="space-y-3">

        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border flex justify-between items-center ${
                n.isRead
                  ? "bg-gray-50 dark:bg-gray-900"
                  : "bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <div>
                <h2 className="font-semibold">{n.title}</h2>
                <p className="text-sm text-gray-500">{n.message}</p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-xl"
                >
                  <CheckCircle size={16} />
                  Read
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default AdminNotifications;