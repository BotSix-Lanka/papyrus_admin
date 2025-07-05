"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getReports, Report, getImageUrl, updateReportStatus } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tooltip } from "@/app/components/ui/tooltip"

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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and manage user reports on the platform.</p>
      </div>
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
              <table className="w-full min-w-[900px] divide-y divide-gray-200">
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
                          <span className="truncate max-w-[90px]">{report.book?.title || report.bookId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap align-middle text-sm max-w-[120px] truncate">
                        <Tooltip content={report.reason}>
                          <span className="cursor-pointer block truncate max-w-[110px]" title="Show full reason">{report.reason}</span>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap align-middle text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                          ${report.status === 'open' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                          ${report.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          ${report.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
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