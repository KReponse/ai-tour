import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Calendar, Star, Gift, Loader2 } from "lucide-react";
import io from "socket.io-client";
import Card, { CardContent } from "../components/ui/Card";

const API = "http://localhost:5000/api";

const socket = io("http://localhost:5000");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const user = JSON.parse(localStorage.getItem("user"));

    socket.emit("join", user?._id);

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const markRead = async (id) => {
    await axios.patch(
      `${API}/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center h-[300px] items-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-500">
          Real-time updates from system
        </p>
      </div>

      <div className="space-y-3">

        {notifications.map((n) => (
          <Card
            key={n._id}
            className={!n.isRead ? "border-l-4 border-blue-600" : ""}
          >
            <CardContent className="p-4 flex gap-3 items-start">

              <Bell
                className={`w-5 h-5 ${
                  n.isRead ? "text-gray-400" : "text-blue-600"
                }`}
              />

              <div className="flex-1">
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-gray-500">
                  {n.message}
                </p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markRead(n._id)}
                  className="text-xs text-blue-600"
                >
                  Mark read
                </button>
              )}

            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
};

export default Notifications;