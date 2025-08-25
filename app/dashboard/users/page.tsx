"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  getUsers,
  User,
  UsersResponse,
  isAuthenticated,
  getImageUrl,
  sendEmail,
} from "@/lib/api";
import EmailModal from "@/app/components/email-modal";
import AnalyticsModal from "@/app/components/analytics-modal";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    UsersResponse["pagination"] | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, selectedStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUsers(
        currentPage,
        searchTerm,
        selectedStatus === "all" ? "" : selectedStatus
      );

      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching users:", err);
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === "development") {
        const mockUsers: User[] = [
          {
            userId: "user_abc123def",
            email: "john.doe@example.com",
            username: "john_doe",
            pfp: "https://ui-avatars.com/api/?name=John+Doe",
            coverImage: null,
            name: "John Doe",
            bio: "Passionate writer and avid reader. Love exploring new worlds through books.",
            status: "online",
            links: {
              twitter: "https://twitter.com/johndoe",
              website: "https://johndoe.com",
            },
            dob: "1990-05-15",
            follower_count: 1250,
            readingList: 45,
            deviceToken: "ExponentPushToken[xxxxxxxxxxxxxx]",
            createdAt: "2024-01-15T10:30:00.000Z",
            updatedAt: "2025-01-10T14:22:30.000Z",
          },
          {
            userId: "user_xyz789ghi",
            email: "sarah.writer@example.com",
            username: "sarah_writes",
            pfp: "/uploads/user_xyz789ghi/profile.jpg",
            coverImage: "/uploads/user_xyz789ghi/cover.jpg",
            name: "Sarah Johnson",
            bio: "Fantasy author and book lover. Currently working on my third novel.",
            status: "away",
            links: {
              instagram: "https://instagram.com/sarahwrites",
              goodreads: "https://goodreads.com/sarahwrites",
            },
            dob: "1988-12-03",
            follower_count: 3200,
            readingList: 78,
            deviceToken: "ExponentPushToken[yyyyyyyyyyyyyy]",
            createdAt: "2024-02-20T09:15:00.000Z",
            updatedAt: "2025-01-09T16:45:20.000Z",
          },
        ];
        setUsers(mockUsers);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalUsers: 2,
          usersPerPage: 20,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-100 text-green-800";
      case "away":
        return "bg-yellow-100 text-yellow-800";
      case "busy":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return "N/A";
    }
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const getInitials = (
    name: string | null | undefined,
    username?: string | null
  ) => {
    if (!name || typeof name !== "string") {
      if (username && typeof username === "string") {
        return username.slice(0, 2).toUpperCase();
      }
      return "U";
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSendEmail = (user: User) => {
    setSelectedUser(user);
    setEmailModalOpen(true);
  };

  const handleEmailSend = async (emailData: {
    to: string;
    subject: string;
    message: string;
  }) => {
    try {
      if (!selectedUser) {
        throw new Error("No user selected");
      }

      const response = await sendEmail({
        to: emailData.to,
        subject: emailData.subject,
        message: emailData.message,
        userId: selectedUser.userId,
      });

      if (response.success) {
        alert(`Email sent successfully to ${emailData.to}`);
      } else {
        throw new Error(response.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert(
        `Failed to send email: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleViewAnalytics = (user: User) => {
    setSelectedUser(user);
    setAnalyticsModalOpen(true);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">
            View and manage all users on the platform.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={fetchUsers} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsModal
        user={selectedUser}
        isOpen={analyticsModalOpen}
        onClose={() => setAnalyticsModalOpen(false)}
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage all users on the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination ? pagination.totalUsers.toLocaleString() : "..."}
            </div>
            <p className="text-xs text-muted-foreground">Across all pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.status === "online").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Readers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.readingList > 10).length}
            </div>
            <p className="text-xs text-muted-foreground">10+ books in list</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.follower_count > 1000).length}
            </div>
            <p className="text-xs text-muted-foreground">1000+ followers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Search and filter users by name, email, or status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                onClick={() => handleStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === "online" ? "default" : "outline"}
                onClick={() => handleStatusFilter("online")}
              >
                Online
              </Button>
              <Button
                variant={selectedStatus === "away" ? "default" : "outline"}
                onClick={() => handleStatusFilter("away")}
              >
                Away
              </Button>
              <Button
                variant={selectedStatus === "offline" ? "default" : "outline"}
                onClick={() => handleStatusFilter("offline")}
              >
                Offline
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Followers
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Reading List
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Join Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Last Updated
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.userId}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={getImageUrl(user.pfp)}
                                alt={user.username || user.name || "User"}
                              />
                              <AvatarFallback>
                                {getInitials(user.name, user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                @{user.username || "unknown"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {user.name || "No name"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              user.status || "offline"
                            )}`}
                          >
                            {user.status || "offline"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium">
                            {(user.follower_count || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium">
                            {user.readingList || 0}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(user.updatedAt)}
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white border border-gray-200 shadow-lg"
                            >
                              <DropdownMenuItem
                                onClick={() => handleSendEmail(user)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewAnalytics(user)}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                View Activity
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Edit Profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      {(pagination.currentPage - 1) * pagination.usersPerPage +
                        1}{" "}
                      to{" "}
                      {Math.min(
                        pagination.currentPage * pagination.usersPerPage,
                        pagination.totalUsers
                      )}{" "}
                      of {pagination.totalUsers} users
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center px-3 text-sm">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Modal */}
      <EmailModal
        user={selectedUser}
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSend={handleEmailSend}
      />
    </div>
  );
}
