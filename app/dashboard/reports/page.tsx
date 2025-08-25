"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getReports, Report, getImageUrl, updateReportStatus, createBookWarning, deleteBookWarning } from "@/lib/api"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs"
import { getBookWarnings, BookWarning } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

// Improved Modal component
function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 ">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-0 relative border border-gray-200 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900">Report Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none" aria-label="Close">&times;</button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

type Book = {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  backgroundMusic?: string | null;
  viewCount?: number;
  likes?: number;
  published?: boolean;
  tags?: string[];
  userId?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Array<{
    id: string;
    title: string;
    content?: string;
    order?: number;
    likes?: number;
    views?: number;
    chapterImage?: string | null;
    published?: boolean;
    bookId?: string;
    createdAt: string;
    updatedAt: string;
  }>;
};

type Chapter = {
  id: string;
  title: string;
  content?: string;
  order?: number;
  likes?: number;
  views?: number;
  chapterImage?: string | null;
  published?: boolean;
  bookId?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookModalReport, setBookModalReport] = useState<Report | null>(null)
  const [chapterModalOpen, setChapterModalOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [warnBookModalOpen, setWarnBookModalOpen] = useState(false)
  const [warnMessage, setWarnMessage] = useState("")
  const [warnSeverity, setWarnSeverity] = useState("medium")
  const [warnLoading, setWarnLoading] = useState(false)
  const [warnError, setWarnError] = useState<string | null>(null)
  const [warnSuccess, setWarnSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'reports' | 'warnings'>('reports')
  const [bookWarnings, setBookWarnings] = useState<BookWarning[]>([])
  const [bookWarningsLoading, setBookWarningsLoading] = useState(false)
  const [bookWarningsError, setBookWarningsError] = useState<string | null>(null)
  const [warnRecipient, setWarnRecipient] = useState<'book' | 'report'>('book')

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getReports()
        setReports(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  useEffect(() => {
    if (activeTab === 'warnings') {
      setBookWarningsLoading(true)
      setBookWarningsError(null)
      getBookWarnings()
        .then(setBookWarnings)
        .catch(err => setBookWarningsError(err instanceof Error ? err.message : 'Failed to fetch warnings'))
        .finally(() => setBookWarningsLoading(false))
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports (Books)</h1>
        <p className="text-muted-foreground">View and manage user reports and warnings on books.</p>
      </div>
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'reports' | 'warnings')}>
        <TabsList>
          <TabsTrigger value="reports">Reports (Books)</TabsTrigger>
          <TabsTrigger value="warnings">Book Warnings</TabsTrigger>
        </TabsList>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports Table</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-gray-500">Loading reports...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">{error}</div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Report ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {reports.map((report) => (
                        <tr key={report.reportId} className="overflow-visible">
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{report.reportId}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <div className="w-7 h-7 flex-shrink-0">
                                {getImageUrl(report.user?.pfp) ? (
                                  <Image src={getImageUrl(report.user?.pfp)!} alt={report.user?.username || report.userId} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">?</div>
                                )}
                              </div>
                              <span className="truncate max-w-[80px]">{report.user?.username || report.userId}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <div className="flex items-center gap-2 min-w-[140px]">
                              <div className="w-7 h-10 flex-shrink-0">
                                {getImageUrl(report.book?.coverImage) ? (
                                  <Image src={getImageUrl(report.book?.coverImage)!} alt={report.book?.title || report.bookId} width={28} height={40} className="rounded object-cover w-7 h-10" />
                                ) : (
                                  <div className="w-7 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">?</div>
                                )}
                              </div>
                              <button
                                className="truncate max-w-[90px] text-blue-600 hover:underline focus:outline-none"
                                onClick={() => {
                                  if (report.book) {
                                    setSelectedBook(report.book as Book);
                                    setBookModalReport(report);
                                    setBookModalOpen(true);
                                  } else {
                                    setSelectedBook(null);
                                    setBookModalReport(null);
                                  }
                                }}
                                title="View Book Details"
                                disabled={!report.book}
                              >
                                {report.book?.title || report.bookId}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[120px] truncate">{report.reason}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm capitalize">{report.status}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedReport(report); setModalOpen(true); }}>View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="warnings">
          <Card>
            <CardHeader>
              <CardTitle>Book Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookWarningsLoading ? (
                <div className="py-8 text-center text-gray-500">Loading warnings...</div>
              ) : bookWarningsError ? (
                <div className="py-8 text-center text-red-500">{bookWarningsError}</div>
              ) : bookWarnings.length === 0 ? (
                <div className="py-8 text-center text-gray-400">No warnings found.</div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {bookWarnings.map((warn) => (
                        <tr key={warn.id}>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{warn.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{warn.book?.title || warn.bookId}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[180px] truncate" title={warn.message}>{warn.message}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm capitalize">{warn.severity}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{warn.admin?.username || warn.adminId}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{new Date(warn.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
                              onClick={async () => {
                                setBookWarningsLoading(true);
                                try {
                                  await deleteBookWarning(warn.id);
                                  const updated = await getBookWarnings();
                                  setBookWarnings(updated);
                                } catch (err) {
                                  alert(err instanceof Error ? err.message : 'Failed to delete warning');
                                } finally {
                                  setBookWarningsLoading(false);
                                }
                              }}
                              disabled={bookWarningsLoading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal for viewing report details */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedReport && (
          <ReportDetailsModalContent
            report={selectedReport}
            statusLoading={statusLoading}
            statusError={statusError}
            statusSuccess={statusSuccess}
            onStatusUpdate={async (newStatus) => {
              if (!selectedReport) return;
              try {
                setStatusLoading(true);
                setStatusError(null);
                await updateReportStatus(selectedReport.reportId, newStatus);
                setSelectedReport((prev) => prev ? { ...prev, status: newStatus } : prev);
                setReports((prev) => prev.map(r => r.reportId === selectedReport.reportId ? { ...r, status: newStatus } : r));
                setStatusSuccess('Status updated successfully!');
                setTimeout(() => setStatusSuccess(null), 2000);
              } catch (err) {
                setStatusError(err instanceof Error ? err.message : 'Failed to update status');
              } finally {
                setStatusLoading(false);
              }
            }}
          />
        )}
      </Modal>

      {/* Book Details Modal */}
      {bookModalOpen && selectedBook !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-0 relative border border-gray-200 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">Book Details</h2>
              <button onClick={() => setBookModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none" aria-label="Close">&times;</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex gap-6 items-start">
                <div>
                  {getImageUrl(selectedBook.coverImage) ? (
                    <Image src={getImageUrl(selectedBook.coverImage)!} alt={selectedBook.title} width={80} height={120} className="rounded object-cover border w-20 h-32" />
                  ) : (
                    <div className="w-20 h-32 rounded bg-gray-200 flex items-center justify-center text-lg text-gray-400 border">?</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xl font-bold">{selectedBook.title}</div>
                  <div className="text-gray-600 text-sm">{selectedBook.description}</div>
                  <div className="text-xs text-gray-500">Book ID: {selectedBook.id}</div>
                  <div className="text-xs text-gray-500">Category: {selectedBook.categoryId || '-'}</div>
                  <div className="text-xs text-gray-500">Tags: {selectedBook.tags?.join(', ') || '-'}</div>
                  <div className="text-xs text-gray-500">Likes: {selectedBook.likes} | Views: {selectedBook.viewCount}</div>
                  <div className="text-xs text-gray-500">Published: {selectedBook.published ? 'Yes' : 'No'}</div>
                  <div className="text-xs text-gray-500">Created: {new Date(selectedBook.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Updated: {new Date(selectedBook.updatedAt).toLocaleString()}</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">Chapters</div>
                {selectedBook.chapters && selectedBook.chapters.length > 0 ? (
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    {(selectedBook.chapters as Chapter[]).map((ch) => (
                      <li key={ch.id} className="border rounded px-2 py-1 flex flex-col">
                        <button
                          className="font-medium text-blue-600 hover:underline text-left"
                          onClick={() => { setSelectedChapter(ch); setChapterModalOpen(true); }}
                        >
                          {ch.title}
                        </button>
                        <span className="text-xs text-gray-500">ID: {ch.id} | Order: {ch.order} | Likes: {ch.likes} | Views: {ch.views}</span>
                        <span className="text-xs text-gray-400">Created: {new Date(ch.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-gray-400">No chapters found.</div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 rounded bg-yellow-600 text-white font-semibold hover:bg-yellow-700 focus:outline-none"
                  onClick={() => {
                    setWarnBookModalOpen(true)
                    setWarnMessage("")
                    setWarnSeverity("medium")
                    setWarnError(null)
                    setWarnSuccess(null)
                    setWarnRecipient('book')
                  }}
                >
                  Warn Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Details Modal */}
      {chapterModalOpen && selectedChapter && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-0 relative border border-gray-200 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">Chapter Details</h2>
              <button onClick={() => setChapterModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none" aria-label="Close">&times;</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="text-xl font-bold">{selectedChapter.title}</div>
              <div className="text-gray-600 whitespace-pre-line">{selectedChapter.content || <span className='italic text-gray-400'>No content</span>}</div>
              <div className="text-xs text-gray-500">ID: {selectedChapter.id}</div>
              <div className="text-xs text-gray-500">Order: {selectedChapter.order}</div>
              <div className="text-xs text-gray-500">Likes: {selectedChapter.likes} | Views: {selectedChapter.views}</div>
              <div className="text-xs text-gray-500">Created: {new Date(selectedChapter.createdAt).toLocaleString()}</div>
              <div className="text-xs text-gray-500">Updated: {new Date(selectedChapter.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Warn Book Modal */}
      {warnBookModalOpen && selectedBook && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-0 relative border border-gray-200 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">Warn Book</h2>
              <button onClick={() => setWarnBookModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none" aria-label="Close">&times;</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Book</div>
                <div className="font-medium">{selectedBook.title}</div>
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Severity</div>
                <select
                  className="w-full border rounded px-2 py-1 text-sm bg-gray-50"
                  value={warnSeverity}
                  onChange={e => setWarnSeverity(e.target.value)}
                  disabled={warnLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Message</div>
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm bg-gray-50 min-h-[80px]"
                  placeholder="Type your warning message here..."
                  value={warnMessage}
                  onChange={e => setWarnMessage(e.target.value)}
                  disabled={warnLoading}
                />
              </div>
              {warnError && <div className="text-xs text-red-600">{warnError}</div>}
              {warnSuccess && <div className="text-xs text-green-600">{warnSuccess}</div>}
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Warn Recipient</div>
                <select
                  className="w-full border rounded px-2 py-1 text-sm bg-gray-50 mb-2"
                  value={warnRecipient}
                  onChange={e => setWarnRecipient(e.target.value as 'book' | 'report')}
                  disabled={warnLoading}
                >
                  <option value="book">Book Owner ({selectedBook.userId})</option>
                  {bookModalReport && (
                    <option value="report">Report Owner ({bookModalReport.user?.username || bookModalReport.userId})</option>
                  )}
                </select>
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Recipient Info</div>
                <div className="flex items-center gap-2">
                  {warnRecipient === 'book' ? (
                    <span className="text-xs text-gray-700">User ID: {selectedBook.userId}</span>
                  ) : (
                    <span className="text-xs text-gray-700">User: {bookModalReport?.user?.username || bookModalReport?.userId}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 focus:outline-none"
                  onClick={() => setWarnBookModalOpen(false)}
                  disabled={warnLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-yellow-600 text-white font-semibold hover:bg-yellow-700 focus:outline-none disabled:opacity-50"
                  onClick={async () => {
                    setWarnLoading(true)
                    setWarnError(null)
                    setWarnSuccess(null)
                    try {
                      await createBookWarning({
                        message: warnMessage,
                        severity: warnSeverity,
                        bookId: selectedBook.id,
                        userId: warnRecipient === 'book' ? selectedBook.userId : (bookModalReport?.user?.userId || bookModalReport?.userId)
                      })
                      setWarnSuccess('Warning sent successfully!')
                      setTimeout(() => setWarnBookModalOpen(false), 1200)
                    } catch (err) {
                      setWarnError(err instanceof Error ? err.message : 'Failed to send warning')
                    } finally {
                      setWarnLoading(false)
                    }
                  }}
                  disabled={warnLoading || !warnMessage.trim()}
                >
                  {warnLoading ? 'Sending...' : 'Send Warning'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ReportDetailsModalContent({ report, onStatusUpdate, statusLoading, statusError, statusSuccess }: {
  report: Report,
  onStatusUpdate: (newStatus: string) => Promise<void>,
  statusLoading: boolean,
  statusError: string | null,
  statusSuccess: string | null
}) {
  const [statusValue, setStatusValue] = useState(report.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="font-semibold text-xs text-gray-500">User</div>
          {getImageUrl(report.user?.pfp) ? (
            <img src={getImageUrl(report.user?.pfp)!} alt={report.user?.username || report.userId} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-400 border">?</div>
          )}
          <span className="text-sm font-medium text-gray-800 mt-1">{report.user?.username || report.userId}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="font-semibold text-xs text-gray-500">Book</div>
          {getImageUrl(report.book?.coverImage) ? (
            <img src={getImageUrl(report.book?.coverImage)!} alt={report.book?.title || report.bookId} className="w-10 h-16 rounded object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-16 rounded bg-gray-200 flex items-center justify-center text-lg text-gray-400 border">?</div>
          )}
          <span className="text-sm font-medium text-gray-800 mt-1">{report.book?.title || report.bookId}</span>
        </div>
      </div>
      <hr className="my-2 border-gray-100" />
      <div>
        <div className="font-semibold text-xs text-gray-500 mb-1">Reason</div>
        <div className="text-gray-900 text-sm whitespace-pre-line bg-gray-50 rounded p-2 border border-gray-100">{report.reason}</div>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <div className="font-semibold text-xs text-gray-500 mb-1">Status</div>
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:border-blue-400"
              value={statusValue}
              onChange={e => setStatusValue(e.target.value)}
              disabled={statusLoading}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              className="ml-2 px-2 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              onClick={() => onStatusUpdate(statusValue)}
              disabled={statusLoading || statusValue === report.status}
            >
              {statusLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
          {statusError && <div className="text-xs text-red-600 mt-1">{statusError}</div>}
          {statusSuccess && <div className="text-xs text-green-600 mt-1">{statusSuccess}</div>}
        </div>
        <div>
          <div className="font-semibold text-xs text-gray-500 mb-1">Created At</div>
          <div className="text-gray-800 text-xs">{new Date(report.createdAt).toLocaleString()}</div>
        </div>
        <div>
          <div className="font-semibold text-xs text-gray-500 mb-1">Updated At</div>
          <div className="text-gray-800 text-xs">{new Date(report.updatedAt).toLocaleString()}</div>
        </div>
        <div>
          <div className="font-semibold text-xs text-gray-500 mb-1">Report ID</div>
          <div className="text-gray-800 text-xs">{report.reportId}</div>
        </div>
      </div>
    </div>
  );
} 