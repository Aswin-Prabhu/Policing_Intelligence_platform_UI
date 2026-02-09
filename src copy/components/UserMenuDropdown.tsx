import { LogOut, History } from "lucide-react";

interface Props {
  role: string;
  userId: string;
  username: string;
  name: string;       // Full officer name
  onLogout: () => void;
  onOpenHistory: () => void;
}

export default function UserMenuDropdown({
  role,
  userId,
  username,
  name,
  onLogout,
  onOpenHistory,
}: Props) {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl z-50 card-shadow">
      
      {/* USER INFO */}
      <div className="p-4 border-b border-border">
        <h3 className="text-white text-sm font-medium">
          {role === "CCO" ? "Control Room Operator" : role}
        </h3>
        <p className="text-gray-400 text-xs mt-1">Name: {name}</p>
        <p className="text-gray-500 text-xs mt-1">Username: {username}</p>
      </div>

      {/* ACTIONS */}
      <div className="py-2">
        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 text-sm transition-colors">
          Profile Settings
        </button>

        <button className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 text-sm transition-colors">
          Change Password
        </button>

        {/* Session History */}
        <button
          onClick={onOpenHistory}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5 text-sm transition-colors"
        >
          <History className="w-4 h-4" /> Session History
        </button>
      </div>

      {/* LOGOUT */}
      <div className="border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
