"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Users, BookOpen, TrendingUp, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const stats = [
  {
    name: "Total Users",
    value: "12,345", // Will update dynamically
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Total Books",
    value: "8,901", // Will update dynamically
    change: "+8%",
    changeType: "positive",
    icon: BookOpen,
  },
];

export default function DashboardPage() {
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [booksAddedData, setBooksAddedData] = useState<any[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("adminToken");

        // Fetch users data
        const userRes = await fetch("https://api.papyruslk.com/api/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is set in environment
          },
        });
        if (!userRes.ok) throw new Error("Failed to fetch users data");
        const userData = await userRes.json();

        let userGrowthData: any = [];

        userData.users.forEach((user: any) => {
          const userMonth = new Date(user.createdAt).toLocaleString("default", {
            month: "short",
          });

          // Check if this month already exists, if not add it
          let foundMonth = userGrowthData.find(
            (entry: any) => entry.month === userMonth
          );
          if (foundMonth) {
            foundMonth.users += 1; // Increment the number of users added in this month
          } else {
            userGrowthData.push({ month: userMonth, users: 1 }); // Add new month with the first user
          }
        });

        setTotalUsers(userData.pagination.totalUsers); // Set total users
        setUserGrowthData(userGrowthData); // Set user growth data

        // Fetch books data
        const booksRes = await fetch("https://api.papyruslk.com/api/books", {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is set in environment
          },
        });
        if (!booksRes.ok) throw new Error("Failed to fetch books data");
        const booksData = await booksRes.json();

        // Set total books
        setTotalBooks(booksData.length); // Simply the length of books array

        // Process books data to determine the books added monthly
        const booksAddedMonthly: any[] = [];
        const categoriesCount: { [key: string]: number } = {};

        booksData.forEach((book: any) => {
          const month = new Date(book.createdAt).toLocaleString("default", {
            month: "short",
          });
          const year = new Date(book.createdAt).getFullYear();
          const monthYear = `${month} ${year}`;

          // Count books added per month
          const monthIndex = booksAddedMonthly.findIndex(
            (item) => item.month === monthYear
          );
          if (monthIndex >= 0) {
            booksAddedMonthly[monthIndex].books += 1;
          } else {
            booksAddedMonthly.push({ month: monthYear, books: 1 });
          }

          // Count categories usage
          book.categories.forEach((category: any) => {
            if (categoriesCount[category.name]) {
              categoriesCount[category.name] += 1;
            } else {
              categoriesCount[category.name] = 1;
            }
          });
        });

        setBooksAddedData(booksAddedMonthly);

        // Set most used categories
        const sortedCategories = Object.entries(categoriesCount)
          .sort((a, b) => b[1] - a[1]) // Sort by count descending
          .slice(0, 5) // Top 5 categories
          .map(([name, value]) => ({ name, value, color: getRandomColor() }));

        setTrendingCategories(sortedCategories);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate random color for category pie chart
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Papyrus admin dashboard. Here&apos;s an overview of
          your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.name === "Total Users" ? totalUsers : totalBooks}
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="books">Books Added</TabsTrigger>
          <TabsTrigger value="categories">Trending Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
              <CardDescription>
                Monthly user registration trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Books Added Monthly</CardTitle>
              <CardDescription>
                Number of books added to the platform each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={booksAddedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="books" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Categories</CardTitle>
              <CardDescription>Most popular book categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trendingCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trendingCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
