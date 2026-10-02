import { useEffect, useState } from "react";
import { Check, Mail, Trash2 } from "lucide-react";
import api from "../services/api";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await api.get("/contact");

      setMessages(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/contact/${id}/read`);

      setMessages((previousMessages) =>
        previousMessages.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/contact/${id}`);

      setMessages((previousMessages) =>
        previousMessages.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Messages
        </h1>

        <p className="mt-2 text-gray-600">
          Manage messages received from your portfolio contact form.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Loading messages...
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <Mail
            size={40}
            className="mx-auto text-gray-400"
          />

          <p className="mt-4 text-gray-500">
            No messages found.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border bg-white p-6 shadow-sm ${
                item.isRead
                  ? "border-gray-200"
                  : "border-blue-300 bg-blue-50/30"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    {!item.isRead && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        Unread
                      </span>
                    )}

                    {item.isRead && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Read
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.email}
                  </p>

                  {item.subject && (
                    <p className="mt-4 font-medium text-gray-800">
                      Subject: {item.subject}
                    </p>
                  )}

                  <p className="mt-3 whitespace-pre-wrap text-gray-700">
                    {item.message}
                  </p>

                  <p className="mt-4 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!item.isRead && (
                    <button
                      onClick={() =>
                        handleMarkAsRead(item.id)
                      }
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Check size={16} />
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;