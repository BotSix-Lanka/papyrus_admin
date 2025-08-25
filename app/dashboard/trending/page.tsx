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
import { TrendingUp, Eye, Heart, Star } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  likes: number;
  views: number;
}

interface Categories {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  categories: Categories[];
  coverImage?: string;
  trendingScore: number;
  viewCount: number;
  likes: number;
  chapters: Chapter[];
  tags: string[];
  backgroundMusic: string;
  description: string;
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: string;
    username: string;
  };
}

interface Stats {
  totalViews: number;
  totalLikes: number;
  averageRating: number;
}

export default function TrendingBooksPage() {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // Selected book state for modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://api.papyruslk.com/api/books/trending"); // 🔗 placeholder
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        setTrendingBooks(data);

        const totalViews = data.reduce(
          (acc: number, book: Book) =>
            acc +
            book.chapters.reduce(
              (sum: number, chapter: Chapter) => sum + chapter.views,
              0
            ),
          0
        );
        const totalLikes = data.reduce(
          (acc: number, book: Book) =>
            acc +
            book.chapters.reduce(
              (sum: number, chapter: Chapter) => sum + chapter.likes,
              0
            ),
          0
        );

        const averageRating =
          data.reduce((acc: number, book: Book) => {
            const totalChapterLikes = book.chapters.reduce(
              (sum: number, chapter: Chapter) => sum + chapter.likes,
              0
            );
            return acc + totalChapterLikes / book.chapters.length;
          }, 0) / data.length;

        setStats({
          totalViews,
          totalLikes,
          averageRating: Number(averageRating.toFixed(2)),
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

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
            Books with the highest engagement and growth in views, likes, and
            ratings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading books...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error: {error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Book</th>
                    <th className="text-left py-3 px-4 font-medium">Author</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Views</th>
                    <th className="text-left py-3 px-4 font-medium">Likes</th>
                    <th className="text-left py-3 px-4 font-medium">Trend</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingBooks.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12">
                            {book.coverImage ? (
                              <img
                                src={`https://api.papyruslk.com${book.coverImage}`}
                                className=" rounded-lg"
                              />
                            ) : (
                              "📘"
                            )}
                          </div>
                          <div>
                            <div
                              className="font-medium cursor-pointer text-blue-500 hover:underline"
                              onClick={() => handleBookClick(book)}
                            >
                              {book.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {book.user.username}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          {book.categories.map((category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {book.chapters
                              .reduce(
                                (sum: number, chapter: Chapter) =>
                                  sum + chapter.views,
                                0
                              )
                              .toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-400" />
                          <span className="text-sm">
                            {book.chapters
                              .reduce(
                                (sum: number, chapter: Chapter) =>
                                  sum + chapter.likes,
                                0
                              )
                              .toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {book.trendingScore}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              handleBookClick(book);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
            <div className="text-2xl font-bold">
              {stats?.totalViews.toLocaleString() ?? "Loading..."}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `` : "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalLikes.toLocaleString() ?? "Loading..."}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `` : "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Likes Per Book
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageRating ?? "Loading..."}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `` : "Loading..."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal for Book Details */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-semibold">{selectedBook.title}</h2>
            <p className="mt-2">{selectedBook.description}</p>
            <h3 className="mt-4 text-xl">Chapters</h3>
            <ul className="list-disc pl-5">
              {selectedBook.chapters.map((chapter) => (
                <li key={chapter.id}>{chapter.title}</li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
