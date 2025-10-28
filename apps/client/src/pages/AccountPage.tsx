import { useQuery } from "@tanstack/react-query";
import { User, CreditCard, Shield, Bell } from "lucide-react";
import type { SelectBillingTransaction } from "@shared/schema";

// Mock user ID - in production this would come from auth context
const CURRENT_USER_ID = "user-1";

export default function AccountPage() {
  // Fetch user's recent transactions
  const { data: transactions } = useQuery<SelectBillingTransaction[]>({
    queryKey: ["/api/transactions", CURRENT_USER_ID],
    retry: 1,
  });

  // Mock user data - in production this would come from auth
  const user = {
    id: CURRENT_USER_ID,
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    subscriptionTier: "free",
    subscriptionStatus: "active",
    memberSince: "2024-01-15",
  };

  const totalSpent = transactions?.reduce(
    (sum, t) => sum + (t.status === "completed" ? parseFloat(t.amount) : 0),
    0
  ) || 0;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-600">
          Manage your profile and subscription preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6" data-testid="card-profile">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Profile Information</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-lg" data-testid="text-name">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg" data-testid="text-email">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Username</label>
            <p className="text-lg" data-testid="text-username">{user.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Member Since</label>
            <p className="text-lg">{new Date(user.memberSince).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}</p>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6" data-testid="card-subscription">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Subscription Status</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Current Plan</label>
            <p className="text-2xl font-bold capitalize" data-testid="text-plan">
              {user.subscriptionTier}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                user.subscriptionStatus === "active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`} data-testid="badge-status">
                {user.subscriptionStatus}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Total Spent</label>
            <p className="text-2xl font-bold text-green-600" data-testid="text-total-spent">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Transactions</label>
            <p className="text-2xl font-bold">{transactions?.length || 0}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <a 
            href="/billing"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            data-testid="button-upgrade"
          >
            Upgrade Plan
          </a>
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            data-testid="button-manage"
          >
            Manage Billing
          </button>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Security & Privacy</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-gray-500">Last changed 30 days ago</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Notification Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mood Reminders</p>
              <p className="text-sm text-gray-500">Daily reminders to track your mood</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
