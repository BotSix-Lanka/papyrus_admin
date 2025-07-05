"use client"

import { useState, useEffect } from "react"
import { X, Users, BookOpen, MessageSquare, Heart, BarChart3 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { User, getUserAnalytics, UserAnalyticsData } from "@/lib/api"
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



interface AnalyticsModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsModal({ user, isOpen, onClose }: AnalyticsModalProps) {
  const [analyticsData, setAnalyticsData] = useState<UserAnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    if (isOpen && user) {
      fetchAnalytics()
    }
  }, [isOpen, user, timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      if (user) {
        const data = await getUserAnalytics(user.userId, timeRange)
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch user analytics:', error)
      setAnalyticsData(null)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Analytics</h3>
              <p className="text-sm text-gray-500">Analytics for {user.name || user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button
                variant={timeRange === 7 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(7)}
              >
                7D
              </Button>
              <Button
                variant={timeRange === 30 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(30)}
              >
                30D
              </Button>
              <Button
                variant={timeRange === 90 ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(90)}
              >
                90D
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading analytics...</span>
            </div>
          ) : analyticsData ? (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overallStats.totalBooks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +{analyticsData.insights.recentActivity.newBooks} this period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overallStats.totalChapters.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +{analyticsData.insights.recentActivity.newChapters} this period
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
                      +{analyticsData.insights.recentActivity.newComments} this period
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
                      +{analyticsData.insights.recentActivity.newFollowers} this period
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Books Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Books Published</CardTitle>
                    <CardDescription>Daily books published over {timeRange} days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analyticsData.dailyAnalytics.books}>
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
                      <LineChart data={analyticsData.dailyAnalytics.comments}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" name="Comments" />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Chapters" />
                        <Line type="monotone" dataKey="count" stroke="#ffc658" name="Followers" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          data={analyticsData.insights.bookCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry["category.name"] || entry.category || "Unknown"} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analyticsData.insights.bookCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Activity by Day */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activity by Day</CardTitle>
                    <CardDescription>User activity distribution by day of week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.insights.activityByDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dayOfWeek" />
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
                  <CardTitle className="text-lg">User Summary</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.summary.averageChaptersPerBook}</div>
                      <div className="text-sm text-gray-600">Chapters per Book</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.summary.averageCommentsPerChapter}</div>
                      <div className="text-sm text-gray-600">Comments per Chapter</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analyticsData.summary.followerToFollowingRatio}</div>
                      <div className="text-sm text-gray-600">Follower Ratio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{analyticsData.summary.daysSinceJoined}</div>
                      <div className="text-sm text-gray-600">Days Since Joined</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No analytics data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 