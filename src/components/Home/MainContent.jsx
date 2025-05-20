import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  Bell,
  Star,
  Plus,
  FileText,
  MessageSquare,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

// Mock data imports (same as in your original file)
const mockUsers = {
  admin: { name: "Alex Morgan", role: "Admin" },
  user: { name: "Jamie Smith", role: "User" },
  driver: { name: "Chris Lee", role: "Driver" },
};

const mockMonthlyBookings = [
  { month: "Jan", bookings: 65 },
  { month: "Feb", bookings: 59 },
  { month: "Mar", bookings: 80 },
  { month: "Apr", bookings: 81 },
  { month: "May", bookings: 56 },
  { month: "Jun", bookings: 55 },
  { month: "Jul", bookings: 40 },
  { month: "Aug", bookings: 70 },
  { month: "Sep", bookings: 90 },
  { month: "Oct", bookings: 85 },
  { month: "Nov", bookings: 65 },
  { month: "Dec", bookings: 95 },
];

const mockCarTypes = [
  { name: "SUV", value: 40 },
  { name: "Sedan", value: 30 },
  { name: "Luxury", value: 15 },
  { name: "Economy", value: 15 },
];

const mockTrends = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 40 },
  { month: "Mar", value: 45 },
  { month: "Apr", value: 55 },
  { month: "May", value: 50 },
  { month: "Jun", value: 60 },
  { month: "Jul", value: 75 },
  { month: "Aug", value: 80 },
  { month: "Sep", value: 85 },
  { month: "Oct", value: 90 },
  { month: "Nov", value: 95 },
  { month: "Dec", value: 100 },
];

const mockActivities = [
  {
    id: 1,
    message: "New booking #1234 confirmed",
    time: "10 mins ago",
    type: "booking",
  },
  {
    id: 2,
    message: "Car #A789 maintenance scheduled",
    time: "2 hours ago",
    type: "maintenance",
  },
  { id: 3, message: "New user registered", time: "3 hours ago", type: "user" },
  {
    id: 4,
    message: "Driver #D456 completed ride",
    time: "5 hours ago",
    type: "ride",
  },
  {
    id: 5,
    message: "Booking #1200 canceled",
    time: "1 day ago",
    type: "booking",
  },
];

const mockBookings = {
  user: [
    {
      id: "B1001",
      car: "Tesla Model 3",
      status: "Upcoming",
      date: "May 5, 2025",
      time: "9:00 AM",
    },
    {
      id: "B1000",
      car: "BMW X5",
      status: "Completed",
      date: "Apr 25, 2025",
      time: "2:30 PM",
    },
  ],
  driver: [
    {
      id: "B1002",
      customer: "Emma Johnson",
      pickup: "Downtown Plaza",
      status: "Pending",
      date: "May 2, 2025",
      time: "10:15 AM",
    },
    {
      id: "B1003",
      customer: "Michael Williams",
      pickup: "Airport Terminal B",
      status: "Accepted",
      date: "May 3, 2025",
      time: "4:30 PM",
    },
  ],
  admin: [
    {
      id: "B1004",
      customer: "David Brown",
      car: "Mercedes E-Class",
      driver: "John Smith",
      status: "Upcoming",
      date: "May 4, 2025",
    },
    {
      id: "B1001",
      customer: "Jamie Smith",
      car: "Tesla Model 3",
      driver: "Chris Lee",
      status: "Upcoming",
      date: "May 5, 2025",
    },
    {
      id: "B1000",
      customer: "Jamie Smith",
      car: "BMW X5",
      driver: "Chris Lee",
      status: "Completed",
      date: "Apr 25, 2025",
    },
  ],
};

const mockReviews = [
  {
    id: 1,
    user: "Emma J.",
    rating: 5,
    comment: "Excellent service! Car was clean and in perfect condition.",
    date: "Apr 27, 2025",
  },
  {
    id: 2,
    user: "Brian T.",
    rating: 4,
    comment: "Great experience overall. Quick pick-up process.",
    date: "Apr 25, 2025",
  },
];

const mockNotifications = [
  {
    id: 1,
    message: "Your booking #1234 is confirmed",
    time: "Just now",
    read: false,
    type: "booking",
  },
  {
    id: 2,
    message: "New car added to your favorites",
    time: "2 hours ago",
    read: false,
    type: "favorite",
  },
  {
    id: 3,
    message: "Reminder: Your rental starts tomorrow",
    time: "5 hours ago",
    read: true,
    type: "reminder",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MainContent = ({ userRole = "user", setUserRole, currentUser }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(2);

  // Calculate relevant stats based on user role
  const getStats = () => {
    switch (userRole) {
      case "admin":
        return [
          {
            title: "Total Cars",
            value: 124,
            icon: <Car className="h-6 w-6 text-blue-500" />,
          },
          {
            title: "Total Users",
            value: 2456,
            icon: <Users className="h-6 w-6 text-green-500" />,
          },
          {
            title: "Total Bookings",
            value: 876,
            icon: <Calendar className="h-6 w-6 text-purple-500" />,
          },
        ];
      case "user":
        return [
          {
            title: "Total Bookings",
            value: 12,
            icon: <Calendar className="h-6 w-6 text-purple-500" />,
          },
          {
            title: "Loyalty Points",
            value: 345,
            icon: <Star className="h-6 w-6 text-yellow-500" />,
          },
          {
            title: "Saved Cars",
            value: 4,
            icon: <Car className="h-6 w-6 text-blue-500" />,
          },
        ];
      case "driver":
        return [
          {
            title: "Rides to Drive",
            value: 8,
            icon: <Car className="h-6 w-6 text-blue-500" />,
          },
          {
            title: "Total Earnings",
            value: "$2,450",
            icon: <DollarSign className="h-6 w-6 text-green-500" />,
          },
          {
            title: "Rating",
            value: "4.8/5",
            icon: <Star className="h-6 w-6 text-yellow-500" />,
          },
        ];
      default:
        return [];
    }
  };

  // Get chart title based on user role
  const getLineChartTitle = () => {
    switch (userRole) {
      case "admin":
        return "Revenue Trends";
      case "user":
        return "Booking Trends";
      case "driver":
        return "Earnings Trends";
      default:
        return "Trends";
    }
  };

  // Get quick actions based on user role
  const getQuickActions = () => {
    switch (userRole) {
      case "admin":
        return [
          { label: "Add Car", icon: <Plus className="mr-2 h-4 w-4" /> },
          { label: "Add Driver", icon: <Users className="mr-2 h-4 w-4" /> },
          {
            label: "View Reports",
            icon: <FileText className="mr-2 h-4 w-4" />,
          },
        ];
      case "user":
        return [
          { label: "Book Now", icon: <Calendar className="mr-2 h-4 w-4" /> },
          { label: "Browse Cars", icon: <Car className="mr-2 h-4 w-4" /> },
          {
            label: "Contact Support",
            icon: <MessageSquare className="mr-2 h-4 w-4" />,
          },
        ];
      case "driver":
        return [
          {
            label: "Update Status",
            icon: <TrendingUp className="mr-2 h-4 w-4" />,
          },
          {
            label: "View Schedule",
            icon: <Calendar className="mr-2 h-4 w-4" />,
          },
          {
            label: "Report Issue",
            icon: <AlertCircle className="mr-2 h-4 w-4" />,
          },
        ];
      default:
        return [];
    }
  };

  // Role switching buttons
  const RoleSwitcher = () => (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        onClick={() => setUserRole("admin")}
        className={`rounded-md px-4 py-2 text-sm font-medium ${
          userRole === "admin"
            ? "bg-blue-600 text-white"
            : "bg-blue-300 text-gray-800"
        }`}
      >
        Admin View
      </button>
      <button
        onClick={() => setUserRole("user")}
        className={`rounded-md px-4 py-2 text-sm font-medium ${
          userRole === "user"
            ? "bg-blue-600 text-white"
            : "bg-blue-300 text-gray-800"
        }`}
      >
        User View
      </button>
      <button
        onClick={() => setUserRole("driver")}
        className={`rounded-md px-4 py-2 text-sm font-medium ${
          userRole === "driver"
            ? "bg-blue-600 text-white"
            : "bg-blue-300 text-gray-800"
        }`}
      >
        Driver View
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20 lg:p-8">
      {/* Role Switcher */}
      <RoleSwitcher />

      {/* Dashboard Layout */}
      <div className="relative">
        {/* Welcome Section & Notifications */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-gray-600">{currentUser.role} Dashboard</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="rounded-full bg-white p-2 shadow-md"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-md bg-white p-4 shadow-lg md:w-96">
                <div className="mb-3 flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    className="text-xs text-blue-600"
                    onClick={() => setUnreadCount(0)}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`mb-3 border-l-4 ${
                        notification.read
                          ? "border-gray-300"
                          : "border-blue-500"
                      } p-2`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getStats().map((stat, idx) => (
            <div key={idx} className="rounded-lg bg-white p-4 shadow-md">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-gray-100 p-3">
                  {stat.icon}
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </h2>
                  <p className="text-xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Charts Section (2 cols on large screens) */}
          <div className="lg:col-span-2">
            <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Monthly Bookings
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMonthlyBookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Secondary Charts */}
              {userRole === "admin" && (
                <div className="rounded-lg bg-white p-4 shadow-md">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Car Type Distribution
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockCarTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {mockCarTypes.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-white p-4 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  {getLineChartTitle()}
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel (1 col) */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Quick Actions
              </h2>
              <div className="flex flex-col space-y-2">
                {getQuickActions().map((action, idx) => (
                  <button
                    key={idx}
                    className="flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {mockActivities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="border-l-4 border-blue-500 pl-3"
                  >
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  View all activity
                </button>
              </div>
            </div>

            {/* Ratings & Reviews */}
            {(userRole === "user" || userRole === "admin") && (
              <div className="rounded-lg bg-white p-4 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Recent Reviews
                </h2>
                <div className="space-y-3">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b pb-2">
                      <div className="flex items-center">
                        <p className="font-medium">{review.user}</p>
                        <div className="ml-2 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Overview */}
        <div className="mt-6 rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {userRole === "admin"
              ? "All Bookings"
              : userRole === "driver"
              ? "Assigned Rides"
              : "Your Bookings"}
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  {userRole === "admin" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Driver
                      </th>
                    </>
                  )}
                  {userRole === "driver" && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {userRole === "driver" ? "Pickup Location" : "Car"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  {userRole !== "admin" && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Time
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockBookings[userRole].map((booking) => (
                  <tr key={booking.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    {userRole === "admin" && (
                      <>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {booking.customer}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {booking.driver}
                        </td>
                      </>
                    )}
                    {userRole === "driver" && (
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {booking.customer}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {userRole === "driver" ? booking.pickup : booking.car}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {booking.date}
                    </td>
                    {userRole !== "admin" && (
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {booking.time}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "Upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "Accepted"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        {userRole === "user" &&
                          booking.status === "Upcoming" && (
                            <>
                              <button className="text-blue-600 hover:text-blue-900">
                                View
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Cancel
                              </button>
                            </>
                          )}
                        {userRole === "user" &&
                          booking.status === "Completed" && (
                            <button className="text-blue-600 hover:text-blue-900">
                              Review
                            </button>
                          )}
                        {userRole === "driver" &&
                          booking.status === "Pending" && (
                            <>
                              <button className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600">
                                <Check className="h-3 w-3" />
                              </button>
                              <button className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        {userRole === "admin" && (
                          <button className="text-blue-600 hover:text-blue-900">
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
