"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, MessageSquare, Heart } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { getAnalytics, AnalyticsData } from "@/lib/api"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAnalytics(timeRange)
      console.log('Analytics API Response:', data)
      console.log('Top Performers Data:', data.topPerformers)
      console.log('Top Commenters with usernames:', data.topPerformers.topCommenters)
      console.log('Top Authors with usernames:', data.topPerformers.topAuthors)
      console.log('Top Followers with usernames:', data.topPerformers.topFollowers)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics')
      // Fallback to mock data for development
      const mockData: AnalyticsData = {
        timeRange: {
          days: timeRange,
          startDate: new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        },
        dailyAnalytics: {
          userRegistrations: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10) + 1
          })),
          bookReleases: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 5) + 1,
            category: ['Fiction', 'Mystery', 'Romance'][Math.floor(Math.random() * 3)]
          })),
          chapterReleases: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 20) + 5
          })),
          comments: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 50) + 10
          })),
          lineComments: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 30) + 5
          })),
          followers: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 25) + 5
          })),
          readingLists: Array.from({ length: timeRange }, (_, i) => ({
            date: new Date(Date.now() - (timeRange - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            count: Math.floor(Math.random() * 40) + 10
          }))
        },
        overallStats: {
          totalUsers: 1250,
          totalBooks: 450,
          totalChapters: 1800,
          totalComments: 3200,
          totalLineComments: 1500,
          totalFollowers: 2800,
          totalReadingLists: 4200
        },
        topPerformers: {
          topCommenters: [
            { userId: "user_123", commentCount: 45, "user.username": "john_doe" },
            { userId: "user_456", commentCount: 38, "user.username": "sarah_writes" }
          ],
          topAuthors: [
            { userId: "user_789", bookCount: 12, "user.username": "mike_author" },
            { userId: "user_101", bookCount: 8, "user.username": "emma_stories" }
          ],
          topFollowers: [
            { following_id: "user_202", followerCount: 156, "following.username": "alex_reader" },
            { following_id: "user_303", followerCount: 134, "following.username": "lisa_bookworm" }
          ]
        },
        distributions: {
          categories: [
            { "category.name": "Fiction", count: 180 },
            { "category.name": "Mystery", count: 95 },
            { "category.name": "Romance", count: 75 },
            { "category.name": "Sci-Fi", count: 60 },
            { "category.name": "Fantasy", count: 40 }
          ],
          userStatus: [
            { status: "online", count: 450 },
            { status: "offline", count: 800 }
          ]
        },
        recentActivity: {
          newUsers: 25,
          newBooks: 8,
          newChapters: 45,
          newComments: 120,
          newFollowers: 85
        },
        summary: {
          averageBooksPerUser: "0.36",
          averageChaptersPerBook: "4.00",
          averageCommentsPerChapter: "1.78",
          averageFollowersPerUser: "2.24"
        }
      }
      setAnalyticsData(mockData)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for the platform.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={fetchAnalytics} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 7 ? "default" : "outline"}
            onClick={() => setTimeRange(7)}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === 30 ? "default" : "outline"}
            onClick={() => setTimeRange(30)}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === 90 ? "default" : "outline"}
            onClick={() => setTimeRange(90)}
          >
            90 Days
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading analytics...</span>
        </div>
      ) : analyticsData ? (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overallStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.recentActivity.newUsers} this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overallStats.totalBooks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.recentActivity.newBooks} this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overallStats.totalComments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.recentActivity.newComments} this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.overallStats.totalFollowers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{analyticsData.recentActivity.newFollowers} this period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Registrations Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Registrations</CardTitle>
                <CardDescription>Daily new user registrations over {timeRange} days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.dailyAnalytics.userRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Overview</CardTitle>
                <CardDescription>Daily activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.dailyAnalytics.userRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Registrations" />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Comments" />
                    <Line type="monotone" dataKey="count" stroke="#ffc658" name="Followers" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Book Categories</CardTitle>
                <CardDescription>Distribution of books by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.distributions.categories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry["category.name"]} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.distributions.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Status</CardTitle>
                <CardDescription>Current user online/offline status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.distributions.userStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Summary</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.summary.averageBooksPerUser}</div>
                  <div className="text-sm text-gray-600">Books per User</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analyticsData.summary.averageChaptersPerBook}</div>
                  <div className="text-sm text-gray-600">Chapters per Book</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analyticsData.summary.averageCommentsPerChapter}</div>
                  <div className="text-sm text-gray-600">Comments per Chapter</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analyticsData.summary.averageFollowersPerUser}</div>
                  <div className="text-sm text-gray-600">Followers per User</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Commenters</CardTitle>
                <CardDescription>Most active commenters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topPerformers.topCommenters.map((commenter, index) => (
                    <div key={commenter.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">@{commenter["user.username"] || commenter.userId.slice(-3)}</span>
                      </div>
                      <span className="text-sm font-medium">{commenter.commentCount} comments</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Authors</CardTitle>
                <CardDescription>Most published authors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topPerformers.topAuthors.map((author, index) => (
                    <div key={author.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">@{author["user.username"] || author.userId.slice(-3)}</span>
                      </div>
                      <span className="text-sm font-medium">{author.bookCount} books</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Followed</CardTitle>
                <CardDescription>Most followed users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topPerformers.topFollowers.map((follower, index) => (
                    <div key={follower.following_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">@{follower["following.username"] || follower.following_id.slice(-3)}</span>
                      </div>
                      <span className="text-sm font-medium">{follower.followerCount} followers</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No analytics data available
        </div>
      )}
    </div>
  )
} 