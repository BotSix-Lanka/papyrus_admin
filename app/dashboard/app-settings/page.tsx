"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { uploadAppBanner, getAppBanners, deleteAppBanner, AppBanner } from "@/lib/api"

export default function AppSettingsPage() {
  const [banner, setBanner] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [banners, setBanners] = useState<AppBanner[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const fetchBanners = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAppBanners()
      setBanners(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setBanner(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!banner) return
    setUploading(true)
    setUploadError(null)
    try {
      await uploadAppBanner(banner)
      setBanner(null)
      setPreview(null)
      await fetchBanners()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload banner')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteLoading(id)
    try {
      await deleteAppBanner(id)
      await fetchBanners()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete banner')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">App Settings</h1>
        <p className="text-muted-foreground">Manage app-wide settings and banners here.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upload App Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-md">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img src={preview} alt="Banner Preview" className="rounded border max-h-48 object-contain" />
            )}
            <Button onClick={handleUpload} disabled={!banner || uploading}>{uploading ? 'Uploading...' : 'Upload Banner'}</Button>
            {uploadError && <div className="text-xs text-red-600">{uploadError}</div>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading banners...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : banners.length === 0 ? (
            <div className="py-8 text-center text-gray-400">No banners uploaded yet.</div>
          ) : (
            <div className="flex flex-wrap gap-6">
              {banners.map(banner => (
                <div key={banner.id} className="flex flex-col items-center gap-2 border rounded p-2 bg-gray-50">
                  <img src={`https://api.papyruslk.com${banner.imagePath}`} alt="App Banner" className="max-h-32 rounded object-contain border" />
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)} disabled={deleteLoading === banner.id}>
                    {deleteLoading === banner.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 