"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tooltip } from "@/app/components/ui/tooltip"
import { getImageUrl, getCommentReports, CommentReport, sendCommentWarning, getCommentWarnings, CommentWarning, deleteCommentWarning, deleteComment, deleteLineComment, updateCommentReportStatus } from "@/lib/api"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs"

export default function ReportsCommentsPage() {
  const [reports, setReports] = useState<CommentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warnModalOpen, setWarnModalOpen] = useState(false)
  const [warnTarget, setWarnTarget] = useState<CommentReport | null>(null)
  const [warnMessage, setWarnMessage] = useState("")
  const [warnStatus, setWarnStatus] = useState('warned')
  const [warnLoading, setWarnLoading] = useState(false)
  const [warnError, setWarnError] = useState<string | null>(null)
  const [warnSuccess, setWarnSuccess] = useState<string | null>(null)
  const [warnRecipient, setWarnRecipient] = useState<'report' | 'comment'>('report')

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'reports' | 'warns'>('reports')
  const [warnings, setWarnings] = useState<CommentWarning[]>([])
  const [warningsLoading, setWarningsLoading] = useState(false)
  const [warningsError, setWarningsError] = useState<string | null>(null)
  const [deleteWarnLoading, setDeleteWarnLoading] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getCommentReports()
        setReports(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch comment reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  useEffect(() => {
    if (warnModalOpen) {
      setWarnRecipient(warnTarget?.commentOwner ? 'report' : 'report')
    }
  }, [warnModalOpen, warnTarget])

  useEffect(() => {
    if (activeTab === 'warns') {
      setWarningsLoading(true)
      setWarningsError(null)
      getCommentWarnings()
        .then(setWarnings)
        .catch(err => setWarningsError(err instanceof Error ? err.message : 'Failed to fetch warnings'))
        .finally(() => setWarningsLoading(false))
    }
  }, [activeTab])

  const handleWarn = (report: CommentReport) => {
    setWarnTarget(report)
    setWarnMessage("")
    setWarnModalOpen(true)
    setWarnError(null)
    setWarnSuccess(null)
  }

  const handleWarnSend = async () => {
    if (!warnTarget) return;
    setWarnLoading(true)
    setWarnError(null)
    setWarnSuccess(null)
    try {
      const user = warnRecipient === 'comment' ? warnTarget.commentOwner : warnTarget.user;
      if (!user) throw new Error('No user to warn');
      await sendCommentWarning({
        commentId: warnTarget.commentId,
        userId: user.userId,
        reason: warnMessage,
        status: warnStatus,
      });
      setWarnSuccess('Warning sent successfully!');
      setTimeout(() => setWarnModalOpen(false), 1200);
    } catch (err) {
      setWarnError(err instanceof Error ? err.message : 'Failed to send warning');
    } finally {
      setWarnLoading(false);
    }
  }

  const handleDeleteComment = async (report: CommentReport) => {
    setDeleteLoading(report.id)
    try {
      if (report.comment) {
        await deleteComment(report.comment.id)
      } else if (report.linecomment) {
        await deleteLineComment(String(report.linecomment.id))
      } else {
        throw new Error('No comment or line comment to delete')
      }
      // Refresh reports
      const updated = await getCommentReports()
      setReports(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete comment')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleDeleteWarning = async (id: string) => {
    setDeleteWarnLoading(id)
    try {
      await deleteCommentWarning(id)
      // Refresh warnings
      const updated = await getCommentWarnings()
      setWarnings(updated)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete warning')
    } finally {
      setDeleteWarnLoading(null)
    }
  }

  const getWarnTargetUser = () => {
    if (warnRecipient === 'comment' && warnTarget?.commentOwner) return warnTarget.commentOwner
    return warnTarget?.user
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comment Moderation</h1>
        <p className="text-muted-foreground">Switch between comment reports and warnings.</p>
      </div>
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'reports' | 'warns')}>
        <TabsList>
          <TabsTrigger value="reports">Reports (Comments)</TabsTrigger>
          <TabsTrigger value="warns">Warn Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports Table (Comments)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-gray-500">Loading reports...</div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">{error}</div>
              ) : reports.length === 0 ? (
                <div className="py-8 text-center text-gray-400">No comment reports found.</div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full min-w-[900px] divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Report ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {reports.map((report) => (
                        <tr key={report.id} className="overflow-visible">
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{report.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <div className="w-7 h-7 flex-shrink-0">
                                {getImageUrl(report.user?.pfp) ? (
                                  <Image src={getImageUrl(report.user?.pfp)!} alt={report.user?.username} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">?</div>
                                )}
                              </div>
                              <span className="truncate max-w-[80px]">{report.user?.username || report.userId}</span>
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${report.user.status === 'online' ? 'bg-green-100 text-green-800' : report.user.status === 'offline' ? 'bg-gray-200 text-gray-600' : report.user.status === 'away' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{report.user.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            {report.comment ? 'Comment' : report.linecomment ? 'Line Comment' : '-'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[180px] truncate">
                            {report.commentOwner === null ? (
                              <span className="italic text-gray-400">Deleted</span>
                            ) : (
                              <Tooltip content={report.comment?.content || report.linecomment?.content || ''}>
                                <span className="cursor-pointer block truncate max-w-[170px]" title="Show full content">
                                  {report.comment?.content || report.linecomment?.content || '-'}
                                </span>
                              </Tooltip>
                            )}
                            {report.commentOwner && (
                              <Tooltip content={`By: ${report.commentOwner.username}`}>
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500">
                                  {report.commentOwner.pfp ? (
                                    <Image src={getImageUrl(report.commentOwner.pfp)!} alt={report.commentOwner.username} width={18} height={18} className="rounded-full object-cover w-4 h-4 inline-block" />
                                  ) : (
                                    <span className="w-4 h-4 rounded-full bg-gray-200 inline-flex items-center justify-center text-[10px] text-gray-400">?</span>
                                  )}
                                  {report.commentOwner.username}
                                </span>
                              </Tooltip>
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[120px] truncate">
                            <Tooltip content={report.reason}>
                              <span className="cursor-pointer block truncate max-w-[110px]" title="Show full reason">{report.reason}</span>
                            </Tooltip>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <select
                              className={`border rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:border-blue-400 ${statusUpdating === report.id ? 'opacity-50' : ''}`}
                              value={report.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value
                                setStatusUpdating(report.id)
                                try {
                                  await updateCommentReportStatus(report.id, newStatus)
                                  setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: newStatus } : r))
                                } catch (err) {
                                  alert(err instanceof Error ? err.message : 'Failed to update status')
                                } finally {
                                  setStatusUpdating(null)
                                }
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="resolved">Resolved</option>
                              <option value="dismissed">Dismissed</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => handleWarn(report)}>
                                Warn
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteComment(report)} disabled={deleteLoading === report.id || report.commentOwner === null}>
                                {deleteLoading === report.id ? 'Deleting...' : 'Delete Comment'}
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
        </TabsContent>
        <TabsContent value="warns">
          <Card>
            <CardHeader>
              <CardTitle>Warn Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {warningsLoading ? (
                <div className="py-8 text-center text-gray-500">Loading warnings...</div>
              ) : warningsError ? (
                <div className="py-8 text-center text-red-500">{warningsError}</div>
              ) : warnings.length === 0 ? (
                <div className="py-8 text-center text-gray-400">No warnings found.</div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full min-w-[700px] divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {warnings.map(warn => (
                        <tr key={warn.id}>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{warn.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <div className="w-7 h-7 flex-shrink-0">
                                {getImageUrl(warn.user?.pfp) ? (
                                  <Image src={getImageUrl(warn.user?.pfp)!} alt={warn.user?.username || ''} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">?</div>
                                )}
                              </div>
                              <span className="truncate max-w-[80px]">{warn.user?.username || warn.userId}</span>
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${warn.user?.status === 'online' ? 'bg-green-100 text-green-800' : warn.user?.status === 'offline' ? 'bg-gray-200 text-gray-600' : warn.user?.status === 'away' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{warn.user?.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[180px] truncate">
                            <Tooltip content={warn.comment?.content || ''}>
                              <span className="cursor-pointer block truncate max-w-[170px]" title="Show full content">{warn.comment?.content || '-'}</span>
                            </Tooltip>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[180px] truncate" title={warn.reason}>{warn.reason}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm capitalize">{warn.status}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">{new Date(warn.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteWarning(warn.id)} disabled={deleteWarnLoading === warn.id}>
                              {deleteWarnLoading === warn.id ? 'Deleting...' : 'Delete'}
                            </Button>
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

      {/* Warn Modal */}
      {warnModalOpen && warnTarget && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-0 relative border border-gray-200 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">Warn User</h2>
              <button onClick={() => setWarnModalOpen(false)} className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none" aria-label="Close">&times;</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Warn Recipient</div>
                <select
                  className="w-full border rounded px-2 py-1 text-sm bg-gray-50 mb-2"
                  value={warnRecipient}
                  onChange={e => setWarnRecipient(e.target.value as 'report' | 'comment')}
                >
                  <option value="report">Report Owner ({warnTarget.user?.username || warnTarget.userId})</option>
                  {warnTarget.commentOwner && (
                    <option value="comment">Comment Owner ({warnTarget.commentOwner.username})</option>
                  )}
                </select>
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">User</div>
                <div className="flex items-center gap-2">
                  {getImageUrl(getWarnTargetUser()?.pfp) ? (
                    <Image src={getImageUrl(getWarnTargetUser()?.pfp)!} alt={getWarnTargetUser()?.username || ''} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">?</div>
                  )}
                  <span className="font-medium">{getWarnTargetUser()?.username}</span>
                </div>
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Status</div>
                <select
                  className="w-full border rounded px-2 py-1 text-sm bg-gray-50"
                  value={warnStatus}
                  onChange={e => setWarnStatus(e.target.value)}
                  disabled={warnLoading}
                >
                  <option value="warned">Warned</option>
                  <option value="info">Info</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">Message</div>
                <textarea
                  className="w-full border rounded px-2 py-1 text-sm bg-gray-50 min-h-[80px]"
                  placeholder="Type your warning message here..."
                  value={warnMessage}
                  onChange={e => setWarnMessage(e.target.value)}
                  autoFocus
                />
              </div>
              {warnError && <div className="text-xs text-red-600">{warnError}</div>}
              {warnSuccess && <div className="text-xs text-green-600">{warnSuccess}</div>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setWarnModalOpen(false)} disabled={warnLoading}>Cancel</Button>
                <Button onClick={handleWarnSend} disabled={warnLoading || !warnMessage.trim()}>{warnLoading ? 'Sending...' : 'Send Warning'}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 