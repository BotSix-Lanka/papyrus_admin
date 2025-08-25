const API_BASE_URL = "https://api.papyruslk.com";

// Helper function to get full image URL
export const getImageUrl = (
  imagePath: string | null | undefined
): string | undefined => {
  if (!imagePath) return undefined;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path, prepend the base URL
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // If it's just a filename, prepend the base URL with uploads path
  return `${API_BASE_URL}/uploads/${imagePath}`;
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    username: string;
    token: string;
  };
  error?: string;
}

// Admin Login
export const loginAdmin = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token in localStorage
    if (data.success && data.data?.token) {
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminData", JSON.stringify(data.data));
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

// Admin Signup
export const signupAdmin = async (
  adminData: SignupRequest
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    // Store token in localStorage
    if (data.success && data.data?.token) {
      localStorage.setItem("adminToken", data.data.token);
      localStorage.setItem("adminData", JSON.stringify(data.data));
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Signup failed",
    };
  }
};

// Logout
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
};

// Get current admin data
export const getCurrentAdmin = () => {
  const adminData = localStorage.getItem("adminData");
  return adminData ? JSON.parse(adminData) : null;
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Check if admin is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// User interfaces
export interface User {
  userId: string;
  email: string;
  username: string;
  pfp: string | null;
  coverImage: string | null;
  name: string;
  bio: string;
  status: "online" | "away" | "offline" | "busy";
  links: Record<string, string>;
  dob: string;
  follower_count: number;
  readingList: number;
  deviceToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  message: string;
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: string;
  };
}

// Get all users
export const getUsers = async (
  page: number = 1,
  search: string = "",
  status: string = "",
  sortBy: string = "createdAt",
  sortOrder: string = "DESC"
): Promise<UsersResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token");
    }

    const params = new URLSearchParams({
      page: page.toString(),
      search,
      status,
      sortBy,
      sortOrder,
    });

    const response = await fetch(`${API_BASE_URL}/api/users?${params}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
};

// Send email to user
export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  message: string;
  userId: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: { messageId: string; sentAt: string };
}> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to send email"
    );
  }
};

// Analytics interfaces
export interface AnalyticsData {
  timeRange: {
    days: number;
    startDate: string;
    endDate: string;
  };
  dailyAnalytics: {
    userRegistrations: Array<{ date: string; count: number }>;
    bookReleases: Array<{ date: string; count: number; category: string }>;
    chapterReleases: Array<{ date: string; count: number }>;
    comments: Array<{ date: string; count: number }>;
    lineComments: Array<{ date: string; count: number }>;
    followers: Array<{ date: string; count: number }>;
    readingLists: Array<{ date: string; count: number }>;
  };
  overallStats: {
    totalUsers: number;
    totalBooks: number;
    totalChapters: number;
    totalComments: number;
    totalLineComments: number;
    totalFollowers: number;
    totalReadingLists: number;
  };
  topPerformers: {
    topCommenters: Array<{
      userId: string;
      commentCount: number;
      "user.username"?: string;
    }>;
    topAuthors: Array<{
      userId: string;
      bookCount: number;
      "user.username"?: string;
    }>;
    topFollowers: Array<{
      following_id: string;
      followerCount: number;
      "following.username"?: string;
    }>;
  };
  distributions: {
    categories: Array<{ "category.name": string; count: number }>;
    userStatus: Array<{ status: string; count: number }>;
  };
  recentActivity: {
    newUsers: number;
    newBooks: number;
    newChapters: number;
    newComments: number;
    newFollowers: number;
  };
  summary: {
    averageBooksPerUser: string;
    averageChaptersPerBook: string;
    averageCommentsPerChapter: string;
    averageFollowersPerUser: string;
  };
}

// Get analytics data
export const getAnalytics = async (
  days: number = 30
): Promise<AnalyticsData> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/admin/analytics?days=${days}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch analytics"
    );
  }
};

// User-specific analytics interfaces
export interface UserAnalyticsData {
  userInfo: {
    userId: string;
    username: string;
    email: string;
    name: string;
    status: string;
    joinedDate: string;
    followerCount: number;
  };
  timeRange: {
    days: number;
    startDate: string;
    endDate: string;
  };
  dailyAnalytics: {
    books: Array<{
      date: string;
      count: number;
      category: string;
      title: string;
    }>;
    chapters: Array<{ date: string; count: number; title: string }>;
    comments: Array<{ date: string; count: number }>;
    lineComments: Array<{ date: string; count: number }>;
    readingLists: Array<{ date: string; count: number }>;
    followers: Array<{ date: string; count: number }>;
    following: Array<{ date: string; count: number }>;
  };
  overallStats: {
    totalBooks: number;
    totalChapters: number;
    totalComments: number;
    totalLineComments: number;
    totalReadingLists: number;
    totalFollowers: number;
    totalFollowing: number;
  };
  insights: {
    bookCategories: Array<{ category: string; count: number }>;
    activityByDay: Array<{ dayOfWeek: number; count: number }>;
    recentActivity: {
      newBooks: number;
      newChapters: number;
      newComments: number;
      newFollowers: number;
    };
    engagementRate: number;
  };
  summary: {
    averageChaptersPerBook: string;
    averageCommentsPerChapter: string;
    followerToFollowingRatio: string;
    daysSinceJoined: number;
  };
}

export const getUserAnalytics = async (
  userId: string,
  days: number = 30
): Promise<UserAnalyticsData> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token");
    }
    const response = await fetch(
      `${API_BASE_URL}/api/admin/analytics/user/${userId}?days=${days}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user analytics");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user analytics"
    );
  }
};

// Report interface for admin reports
export interface Report {
  reportId: string;
  reason: string;
  status: string;
  bookId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    userId: string;
    username: string;
    email: string;
    pfp: string;
  };
  book?: {
    id: string;
    title: string;
    coverImage: string;
  };
}

// Fetch all reports
export const getReports = async (): Promise<Report[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/reports/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }
  const data = await response.json();

  // Support both array and { data: array } responses
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.reports)) return data.reports;
  throw new Error("Invalid reports response");
};

// Update report status
export const updateReportStatus = async (reportId: string, status: string) => {
  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}/api/reports/${reportId}/status`,
    {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update report status");
  }
  return data.report;
};

// Comment report type
export interface CommentReport {
  id: string;
  commentId: string;
  userId: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  comment: null | {
    id: string;
    content: string;
    likes: number;
    parentCommentId: string | null;
    chapterId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  linecomment: null | {
    id: number | string;
    lineNumber: number;
    content: string;
    parentCommentId: string | null;
    createdAt: string;
    updatedAt: string;
    chapterId: string;
    userUserId: string;
  };
  user: {
    userId: string;
    username: string;
    pfp: string | null;
    name: string | null;
    bio: string | null;
    status: string;
    follower_count: number;
    readingList: number;
    createdAt: string;
    updatedAt: string;
  };
  /**
   * The owner of the comment. If null, the comment is already deleted.
   */
  commentOwner?: {
    userId: string;
    username: string;
    pfp: string | null;
    name: string | null;
    bio: string | null;
    status: string;
    follower_count: number;
    readingList: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}
// Fetch all comment reports
export const getCommentReports = async (): Promise<CommentReport[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/commentreports/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch comment reports");
  }
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.reports)) return data.reports;
  throw new Error("Invalid comment reports response");
};

// Update status of a comment report by ID
export const updateCommentReportStatus = async (
  id: string,
  status: string
): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}/api/commentreports/${id}/status`,
    {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to update comment report status");
  }
};

// Send a warning to a user about a comment
export const sendCommentWarning = async (params: {
  commentId: string;
  userId: string;
  reason: string;
  status: string;
}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/commentwarnings/warn`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to send warning");
  }
  return data;
};

// Comment warning type
export interface CommentWarning {
  id: string;
  commentId: string;
  userId: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  /**
   * The warned user object
   */
  user?: {
    userId: string;
    username: string;
    pfp: string | null;
    name: string | null;
    bio: string | null;
    status: string;
    follower_count: number;
    readingList: number;
    createdAt: string;
    updatedAt: string;
  };
  /**
   * The comment object (if available)
   */
  comment?: {
    id: string;
    content: string;
    likes: number;
    parentCommentId: string | null;
    chapterId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}
// Fetch all comment warnings
export const getCommentWarnings = async (): Promise<CommentWarning[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/commentwarnings/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch comment warnings");
  }
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.warnings)) return data.warnings;
  throw new Error("Invalid comment warnings response");
};

// Delete a comment warning by ID
export const deleteCommentWarning = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/commentwarnings/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete comment warning");
  }
};

// Delete a regular comment by ID
export const deleteComment = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete comment");
  }
};

// Delete a line comment by ID
export const deleteLineComment = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/linecomments/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete line comment");
  }
};

// App Banners API
export interface AppBanner {
  id: string;
  imagePath: string;
  createdAt: string;
}

export const uploadAppBanner = async (bannerFile: File): Promise<AppBanner> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("bannerImage", bannerFile);
  const response = await fetch(`${API_BASE_URL}/api/appbanners/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // 'Content-Type' should NOT be set for FormData
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to upload banner");
  }
  return data.banner || data;
};

export const getAppBanners = async (): Promise<AppBanner[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/appbanners/`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch banners");
  }
  return data.banners || data;
};

export const deleteAppBanner = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/appbanners/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete banner");
  }
};

// Create a warning for a book (admin only)
export const createBookWarning = async (params: {
  message: string;
  severity?: string;
  bookId: string;
  userId?: string;
}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/warnings`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create warning");
  }
  return data.warning || data;
};

// Book warning type
export interface BookWarning {
  id: string;
  message: string;
  severity: string;
  bookId: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  book?: {
    id: string;
    title: string;
    description?: string;
  };
  admin?: {
    adminId: string;
    username: string;
    email: string;
  };
}

// Fetch all book warnings
export const getBookWarnings = async (): Promise<BookWarning[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/warnings`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch book warnings");
  }
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.warnings)) return data.warnings;
  throw new Error("Invalid book warnings response");
};

// Delete a book warning by ID
export const deleteBookWarning = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/warnings/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete book warning");
  }
};
