"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { TrendingUp, Eye, Heart, Star } from "lucide-react"

const trendingBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    views: 15420,
    likes: 3420,
    rating: 4.5,
    trend: "+15%",
    cover: "📚"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    views: 12850,
    likes: 2980,
    rating: 4.8,
    trend: "+12%",
    cover: "📖"
  },
  {
    id: 3,
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    category: "Romance",
    views: 11230,
    likes: 2650,
    rating: 4.3,
    trend: "+18%",
    cover: "💕"
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    views: 9870,
    likes: 2100,
    rating: 4.6,
    trend: "+22%",
    cover: "🚀"
  },
  {
    id: 5,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    views: 8760,
    likes: 1890,
    rating: 4.4,
    trend: "+8%",
    cover: "💰"
  },
  {
    id: 6,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    category: "Literary Fiction",
    views: 7650,
    likes: 1650,
    rating: 4.2,
    trend: "+25%",
    cover: "☀️"
  },
  {
    id: 7,
    title: "The Four Winds",
    author: "Kristin Hannah",
    category: "Historical Fiction",
    views: 6980,
    likes: 1520,
    rating: 4.1,
    trend: "+10%",
    cover: "🌾"
  },
  {
    id: 8,
    title: "Think Again",
    author: "Adam Grant",
    category: "Psychology",
    views: 6230,
    likes: 1380,
    rating: 4.7,
    trend: "+16%",
    cover: "🧠"
  }
]

export default function TrendingBooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trending Books</h1>
        <p className="text-muted-foreground">
          Discover the most popular and trending books on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Books This Week
          </CardTitle>
          <CardDescription>
            Books with the highest engagement and growth in views, likes, and ratings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Book</th>
                  <th className="text-left py-3 px-4 font-medium">Author</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Views</th>
                  <th className="text-left py-3 px-4 font-medium">Likes</th>
                  <th className="text-left py-3 px-4 font-medium">Rating</th>
                  <th className="text-left py-3 px-4 font-medium">Trend</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trendingBooks.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{book.cover}</div>
                        <div>
                          <div className="font-medium">{book.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{book.author}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{book.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-sm">{book.likes.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{book.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {book.trend}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,580</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17,580</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.45</div>
            <p className="text-xs text-muted-foreground">
              +0.2 from last week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 