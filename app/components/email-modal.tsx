"use client"

import { useState } from "react"
import { X, Send, User } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import RichTextEditor from "@/app/components/rich-text-editor"
import { User as UserType } from "@/lib/api"

interface EmailModalProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
  onSend: (emailData: { to: string; subject: string; message: string }) => void
}

export default function EmailModal({ user, isOpen, onClose, onSend }: EmailModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen || !user) return null

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return

    setLoading(true)
    try {
      await onSend({
        to: user.email,
        subject: subject.trim(),
        message: message.trim()
      })
      
      // Reset form
      setSubject("")
      setMessage("")
      onClose()
    } catch (error) {
      console.error('Failed to send email:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSubject("")
    setMessage("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Send Email</h3>
              <p className="text-sm text-gray-500">Send a message to {user.name || user.username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user.name || user.username}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              Message
            </label>
            <RichTextEditor
              value={message}
              onChange={setMessage}
              placeholder="Enter your message..."
              className="w-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!subject.trim() || !message.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 