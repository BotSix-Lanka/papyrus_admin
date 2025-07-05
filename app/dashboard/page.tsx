"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Users, BookOpen, TrendingUp, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

const stats = [
  {
    name: "Total Users",
    value: "12,345",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Total Books",
    value: "8,901",
    change: "+8%",
    changeType: "positive",
    icon: BookOpen,
  },
  {
    name: "New Users",
    value: "234",
    change: "+15%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    name: "Active Users",
    value: "5,678",
    change: "+5%",
    changeType: "positive",
    icon: Activity,
  },
]

const userGrowthData = [
  { month: "Jan", users: 1000 },
  { month: "Feb", users: 1200 },
  { month: "Mar", users: 1400 },
  { month: "Apr", users: 1600 },
  { month: "May", users: 1800 },
  { month: "Jun", users: 2000 },
  { month: "Jul", users: 2200 },
  { month: "Aug", users: 2400 },
  { month: "Sep", users: 2600 },
  { month: "Oct", users: 2800 },
  { month: "Nov", users: 3000 },
  { month: "Dec", users: 3200 },
]

const booksAddedData = [
  { month: "Jan", books: 150 },
  { month: "Feb", books: 180 },
  { month: "Mar", books: 200 },
  { month: "Apr", books: 220 },
  { month: "May", books: 250 },
  { month: "Jun", books: 280 },
  { month: "Jul", books: 300 },
  { month: "Aug", books: 320 },
  { month: "Sep", books: 350 },
  { month: "Oct", books: 380 },
  { month: "Nov", books: 400 },
  { month: "Dec", books: 420 },
]

const trendingKeywords = [
  { name: "Fiction", value: 35, color: "#8884d8" },
  { name: "Non-Fiction", value: 25, color: "#82ca9d" },
  { name: "Science", value: 20, color: "#ffc658" },
  { name: "History", value: 15, color: "#ff7300" },
  { name: "Biography", value: 5, color: "#00ff00" },
]

const trendingCategories = [
  { name: "Romance", value: 30, color: "#ff6b6b" },
  { name: "Mystery", value: 25, color: "#4ecdc4" },
  { name: "Fantasy", value: 20, color: "#45b7d1" },
  { name: "Thriller", value: 15, color: "#96ceb4" },
  { name: "Adventure", value: 10, color: "#feca57" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Papyrus admin dashboard. Here&apos;s an overview of your platform.
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
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
          <TabsTrigger value="keywords">Trending Keywords</TabsTrigger>
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
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
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

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Keywords</CardTitle>
              <CardDescription>
                Most popular book keywords and genres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trendingKeywords}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {trendingKeywords.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Categories</CardTitle>
              <CardDescription>
                Most popular book categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trendingCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
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
  )
} 