"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Plus,
  Play,
  Lock,
  Edit3,
  Save,
  X,
  Upload,
  Trash2,
  FileVideo,
  Link,
  Download,
  Copy,
  Smartphone,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: number
  content: string
  timestamp: string
  type: "text" | "video" | "file"
  videoUrl?: string
  videoTitle?: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

interface Chat {
  id: number
  title: string
  contentType: "text" | "video"
  isPublic: boolean
  messages: Message[]
}

export default function LustMethodsSite() {
  const [deviceType, setDeviceType] = useState<"phone" | "pc" | null>(null)
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Public Chat - Welcome",
      contentType: "text",
      isPublic: true,
      messages: [
        {
          id: 1,
          content:
            "Welcome to LUST METHODS - This is a public chat that everyone can see. Explore the forbidden content that lies within.",
          timestamp: "10:30 PM",
          type: "text",
        },
        {
          id: 2,
          content: "This content is available for copying and downloading.",
          timestamp: "10:32 PM",
          type: "text",
        },
        {
          id: 3,
          content: "Create new chats to access exclusive video or text content. Each realm holds different secrets.",
          timestamp: "10:35 PM",
          type: "text",
        },
      ],
    },
  ])

  const [activeChat, setActiveChat] = useState<number>(1)
  const [showContentTypeSelector, setShowContentTypeSelector] = useState(false)
  const [editingMessage, setEditingMessage] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [newTextContent, setNewTextContent] = useState("")
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [editingChatTitle, setEditingChatTitle] = useState<number | null>(null)
  const [newChatTitle, setNewChatTitle] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textFileInputRef = useRef<HTMLInputElement>(null)

  const [isOwner, setIsOwner] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  // Owner password
  const OWNER_PASSWORD = "ramiz3mk1"

  const checkPassword = () => {
    if (passwordInput === OWNER_PASSWORD) {
      setIsOwner(true)
      setShowPasswordPrompt(false)
      setPasswordInput("")
    } else {
      alert("Wrong password!")
      setPasswordInput("")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const downloadVideo = (videoUrl: string, title: string) => {
    const link = document.createElement("a")
    link.href = videoUrl
    link.download = title || "video.mp4"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName || "file"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return "🖼️"
    if (fileType.startsWith("video/")) return "🎥"
    if (fileType.startsWith("audio/")) return "🎵"
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("word") || fileType.includes("document")) return "📝"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    if (fileType.includes("powerpoint") || fileType.includes("presentation")) return "📋"
    if (fileType.includes("zip") || fileType.includes("rar")) return "📦"
    return "📁"
  }

  useEffect(() => {
    const savedChats = localStorage.getItem("lustChats")
    if (savedChats) {
      setChats(JSON.parse(savedChats))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("lustChats", JSON.stringify(chats))
  }, [chats])

  const createNewChat = (contentType: "text" | "video") => {
    const newChat: Chat = {
      id: Date.now(),
      title: `${contentType === "video" ? "Video" : "Text"} Chat ${chats.length + 1}`,
      contentType,
      isPublic: true,
      messages: [],
    }
    setChats([...chats, newChat])
    setActiveChat(newChat.id)
    setShowContentTypeSelector(false)
  }

  const addTextMessage = () => {
    if (!newTextContent.trim()) return

    const currentChat = chats.find((chat) => chat.id === activeChat)
    if (!currentChat) return

    const newMessage: Message = {
      id: Date.now(),
      content: newTextContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    }

    setChats(
      chats.map((chat) => (chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage] } : chat)),
    )
    setNewTextContent("")
  }

  const addVideoByUrl = () => {
    if (!newVideoUrl.trim()) return

    const currentChat = chats.find((chat) => chat.id === activeChat)
    if (!currentChat) return

    const newMessage: Message = {
      id: Date.now(),
      content: newVideoTitle.trim() || "Video Content",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "video",
      videoUrl: newVideoUrl,
      videoTitle: newVideoTitle.trim() || "Video Content",
    }

    setChats(
      chats.map((chat) => (chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage] } : chat)),
    )
    setNewVideoUrl("")
    setNewVideoTitle("")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const currentChat = chats.find((chat) => chat.id === activeChat)
    if (!currentChat) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file)
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          content: file.name,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "video",
          videoUrl: videoUrl,
          videoTitle: file.name,
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage] } : chat,
          ),
        )
      }
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleTextFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const currentChat = chats.find((chat) => chat.id === activeChat)
    if (!currentChat) return

    Array.from(files).forEach((file) => {
      const fileUrl = URL.createObjectURL(file)

      // Check if it's a video file
      if (file.type.startsWith("video/")) {
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          content: file.name,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "video",
          videoUrl: fileUrl,
          videoTitle: file.name,
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage] } : chat,
          ),
        )
      } else {
        // Handle as regular file
        const newMessage: Message = {
          id: Date.now() + Math.random(),
          content: file.name,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "file",
          fileUrl: fileUrl,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage] } : chat,
          ),
        )
      }
    })

    // Reset file input
    if (textFileInputRef.current) {
      textFileInputRef.current.value = ""
    }
  }

  const startEditingTitle = (chatId: number, currentTitle: string) => {
    if (!isOwner) return
    setEditingChatTitle(chatId)
    setNewChatTitle(currentTitle)
  }

  const saveChatTitle = () => {
    if (!newChatTitle.trim() || !editingChatTitle) return

    setChats(chats.map((chat) => (chat.id === editingChatTitle ? { ...chat, title: newChatTitle.trim() } : chat)))
    setEditingChatTitle(null)
    setNewChatTitle("")
  }

  const cancelTitleEdit = () => {
    setEditingChatTitle(null)
    setNewChatTitle("")
  }

  const startEditing = (messageId: number, content: string) => {
    if (!isOwner) return
    setEditingMessage(messageId)
    setEditContent(content)
  }

  const saveEdit = () => {
    if (!editContent.trim() || !editingMessage) return

    setChats(
      chats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === editingMessage ? { ...msg, content: editContent, videoTitle: editContent } : msg,
              ),
            }
          : chat,
      ),
    )
    setEditingMessage(null)
    setEditContent("")
  }

  const cancelEdit = () => {
    setEditingMessage(null)
    setEditContent("")
  }

  const deleteMessage = (messageId: number) => {
    if (!isOwner) return
    setChats(
      chats.map((chat) =>
        chat.id === activeChat ? { ...chat, messages: chat.messages.filter((msg) => msg.id !== messageId) } : chat,
      ),
    )
  }

  const deleteChat = (chatId: number) => {
    if (!isOwner || chats.length <= 1) return
    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)
    if (activeChat === chatId) {
      setActiveChat(updatedChats[0].id)
    }
  }

  const currentChat = chats.find((chat) => chat.id === activeChat)

  // Device Selection Screen
  if (!deviceType) {
    return (
      <div className="min-h-screen bg-black text-red-500 overflow-hidden">
        {/* Background Image */}
        <div
          className="fixed inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/lust-bg.png)" }}
        />

        {/* Overlay */}
        <div className="fixed inset-0 bg-black/70" />

        {/* Device Selection */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-8xl font-bold text-red-500 tracking-wider mb-4">LUST METHODS</h1>
              <p className="text-red-300 text-xl md:text-2xl">Choose your device type for optimal experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Phone Option */}
              <Card
                className="bg-black/60 border-red-900/50 backdrop-blur-sm hover:bg-black/70 transition-all cursor-pointer"
                onClick={() => setDeviceType("phone")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-6 bg-blue-900/30 rounded-full border border-blue-500/30">
                      <Smartphone className="w-16 h-16 text-blue-400" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-blue-400 mb-2">Mobile Version</CardTitle>
                  <p className="text-red-400/70">Optimized for phones and tablets</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Touch-friendly interface</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Swipe navigation</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Mobile video player</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Responsive design</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PC Option */}
              <Card
                className="bg-black/60 border-red-900/50 backdrop-blur-sm hover:bg-black/70 transition-all cursor-pointer"
                onClick={() => setDeviceType("pc")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-6 bg-purple-900/30 rounded-full border border-purple-500/30">
                      <Monitor className="w-16 h-16 text-purple-400" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-purple-400 mb-2">Desktop Version</CardTitle>
                  <p className="text-red-400/70">Full-featured desktop experience</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Large screen layout</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Keyboard shortcuts</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Multi-panel view</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-300">
                      <span className="text-sm">✓ Advanced features</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-red-400/70 text-sm">You can change this anytime by refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mobile Layout
  if (deviceType === "phone") {
    return (
      <div className="min-h-screen bg-black text-red-500 overflow-hidden">
        {/* Background Image */}
        <div
          className="fixed inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/lust-bg.png)" }}
        />

        {/* Overlay */}
        <div className="fixed inset-0 bg-black/80" />

        {/* Password Prompt Modal */}
        {showPasswordPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <Card className="bg-black/95 border-red-900/50 p-4 w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-red-400 text-center text-lg">Owner Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  className="bg-black/50 border-red-700 text-red-200"
                  onKeyDown={(e) => e.key === "Enter" && checkPassword()}
                />
                <div className="flex space-x-2">
                  <Button onClick={checkPassword} className="flex-1 bg-red-900/50 hover:bg-red-800/50">
                    Unlock
                  </Button>
                  <Button onClick={() => setShowPasswordPrompt(false)} variant="outline" className="border-red-700">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile Main Content */}
        <div className="relative z-10 flex flex-col h-screen">
          {/* Mobile Header */}
          <div className="p-4 border-b border-red-900/50 bg-black/90">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-red-400 tracking-wider">LUST METHODS</h1>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setDeviceType(null)}
                  size="sm"
                  variant="outline"
                  className="border-red-700 text-red-400 text-xs"
                >
                  Switch Device
                </Button>
                {isOwner && <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded">OWNER</span>}
              </div>
            </div>

            {/* Mobile Chat Selector */}
            <div className="mb-4">
              <select
                value={activeChat}
                onChange={(e) => setActiveChat(Number(e.target.value))}
                className="w-full bg-black/50 border border-red-700 text-red-200 p-2 rounded"
              >
                {chats.map((chat) => (
                  <option key={chat.id} value={chat.id}>
                    {chat.title} ({chat.messages.length} items)
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Controls */}
            {isOwner ? (
              !showContentTypeSelector ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowContentTypeSelector(true)}
                    className="flex-1 bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Channel
                  </Button>
                  {currentChat && chats.length > 1 && (
                    <Button
                      onClick={() => deleteChat(activeChat)}
                      variant="outline"
                      className="border-red-700 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => createNewChat("text")}
                    className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300"
                  >
                    📝 Text Channel
                  </Button>
                  <Button
                    onClick={() => createNewChat("video")}
                    className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300"
                  >
                    🎥 Video Channel
                  </Button>
                  <Button
                    onClick={() => setShowContentTypeSelector(false)}
                    variant="outline"
                    className="w-full border-red-700 text-red-400"
                  >
                    Cancel
                  </Button>
                </div>
              )
            ) : (
              <Button
                onClick={() => setShowPasswordPrompt(true)}
                className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300"
              >
                <Lock className="h-4 w-4 mr-2" />
                Owner Login
              </Button>
            )}
          </div>

          {/* Mobile Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {currentChat?.messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-red-400/70">This channel is empty</p>
                  <p className="text-red-500/50 text-sm mt-2">{isOwner ? "Add content below" : "No content yet"}</p>
                </div>
              ) : (
                currentChat?.messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "text" ? (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardContent className="p-3">
                          {editingMessage === message.id && isOwner ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="bg-black/50 border-red-700 text-red-200 min-h-[80px]"
                              />
                              <div className="flex space-x-2">
                                <Button onClick={saveEdit} size="sm" className="bg-green-900/50 hover:bg-green-800/50">
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  size="sm"
                                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-red-200 leading-relaxed text-sm whitespace-pre-wrap">
                                {message.content}
                              </p>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-red-900/30">
                                <span className="text-xs text-red-500/70">{message.timestamp}</span>
                                <div className="flex items-center space-x-2">
                                  {isOwner && (
                                    <>
                                      <Button
                                        onClick={() => startEditing(message.id, message.content)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-400"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteMessage(message.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    onClick={() => copyToClipboard(message.content)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-green-400"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ) : message.type === "file" ? (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardContent className="p-3">
                          {editingMessage === message.id && isOwner ? (
                            <div className="space-y-3">
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="bg-black/50 border-red-700 text-red-200 text-sm"
                              />
                              <div className="flex space-x-2">
                                <Button onClick={saveEdit} size="sm" className="bg-green-900/50 hover:bg-green-800/50">
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  size="sm"
                                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="text-2xl">{getFileIcon(message.fileType || "")}</div>
                                <div className="flex-1">
                                  <p className="text-red-200 font-medium text-sm">{message.fileName}</p>
                                  <p className="text-red-400/70 text-xs">
                                    {message.fileSize ? formatFileSize(message.fileSize) : "Unknown size"}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => downloadFile(message.fileUrl || "", message.fileName || "file")}
                                  size="sm"
                                  className="bg-green-900/50 hover:bg-green-800/50 text-green-200"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                              {message.fileType?.startsWith("image/") && (
                                <div className="mb-3">
                                  <img
                                    src={message.fileUrl || "/placeholder.svg"}
                                    alt={message.fileName}
                                    className="max-w-full h-auto rounded border border-red-900/50"
                                    style={{ maxHeight: "200px" }}
                                  />
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-3 border-t border-red-900/30">
                                <span className="text-xs text-red-500/70">{message.timestamp}</span>
                                <div className="flex items-center space-x-2">
                                  {isOwner && (
                                    <>
                                      <Button
                                        onClick={() => startEditing(message.id, message.fileName || message.content)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-400"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteMessage(message.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                  <span className="text-xs text-green-600/70">File Available</span>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            {editingMessage === message.id && isOwner ? (
                              <div className="flex-1 mr-2">
                                <Input
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="bg-black/50 border-red-700 text-red-200 text-sm"
                                />
                                <div className="flex space-x-2 mt-2">
                                  <Button
                                    onClick={saveEdit}
                                    size="sm"
                                    className="bg-green-900/50 hover:bg-green-800/50"
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={cancelEdit}
                                    size="sm"
                                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <CardTitle className="text-red-400 flex items-center text-sm">
                                  <Play className="h-3 w-3 mr-2" />
                                  {message.videoTitle || message.content}
                                </CardTitle>
                                <div className="flex items-center space-x-1">
                                  {isOwner && (
                                    <>
                                      <Button
                                        onClick={() => startEditing(message.id, message.videoTitle || message.content)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-400"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteMessage(message.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    onClick={() => downloadVideo(message.videoUrl || "", message.videoTitle || "video")}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-green-400"
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </CardHeader>
                        {editingMessage !== message.id && (
                          <CardContent className="pt-0">
                            <div className="relative bg-black rounded-lg overflow-hidden">
                              <video className="w-full h-48 object-cover" controls playsInline>
                                <source src={message.videoUrl || "/placeholder.mp4"} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-green-400">
                                <Download className="h-3 w-3 mr-1 inline" />
                                Available
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-red-500/70">{message.timestamp}</span>
                              <span className="text-xs text-green-600/70">Download Enabled</span>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Mobile Add Content */}
          {currentChat && isOwner && (
            <div className="p-4 border-t border-red-900/50 bg-red-950/20">
              {currentChat.contentType === "text" ? (
                <div className="space-y-3">
                  <Textarea
                    value={newTextContent}
                    onChange={(e) => setNewTextContent(e.target.value)}
                    placeholder="Add new text... (Press Enter for new lines)"
                    className="bg-black/50 border-red-700 text-red-200 min-h-[60px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={addTextMessage}
                      disabled={!newTextContent.trim()}
                      className="flex-1 bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                    <input
                      ref={textFileInputRef}
                      type="file"
                      multiple
                      onChange={handleTextFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => textFileInputRef.current?.click()}
                      className="bg-blue-900/50 hover:bg-blue-800/50 border border-blue-700"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-red-500/70 text-center">
                    Upload any file type including videos alongside text messages
                  </p>
                </div>
              ) : (
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-red-900/50">
                    <TabsTrigger value="url" className="data-[state=active]:bg-red-900/50 text-red-300 text-xs">
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="file" className="data-[state=active]:bg-red-900/50 text-red-300 text-xs">
                      File
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-3 mt-4">
                    <Input
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="Video title..."
                      className="bg-black/50 border-red-700 text-red-200"
                    />
                    <Input
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="Video URL..."
                      className="bg-black/50 border-red-700 text-red-200"
                    />
                    <Button
                      onClick={addVideoByUrl}
                      disabled={!newVideoUrl.trim()}
                      className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                  </TabsContent>
                  <TabsContent value="file" className="space-y-3 mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Videos
                    </Button>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-black text-red-500 overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/lust-bg.png)" }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70" />

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <Card className="bg-black/90 border-red-900/50 p-6">
            <CardHeader>
              <CardTitle className="text-red-400 text-center">Owner Access Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter owner password..."
                className="bg-black/50 border-red-700 text-red-200"
                onKeyDown={(e) => e.key === "Enter" && checkPassword()}
              />
              <div className="flex space-x-2">
                <Button onClick={checkPassword} className="bg-red-900/50 hover:bg-red-800/50">
                  Unlock
                </Button>
                <Button onClick={() => setShowPasswordPrompt(false)} variant="outline" className="border-red-700">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Desktop Main Content */}
      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
        <div className="w-80 border-r border-red-900/50 bg-black/90 backdrop-blur-sm">
          <div className="p-6 border-b border-red-900/50">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-red-400 tracking-wider">LUST METHODS</h1>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setDeviceType(null)}
                  size="sm"
                  variant="outline"
                  className="border-red-700 text-red-400 text-xs"
                >
                  Switch Device
                </Button>
                {isOwner && <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded">OWNER</span>}
              </div>
            </div>

            {/* Desktop Owner Controls */}
            {isOwner ? (
              !showContentTypeSelector ? (
                <Button
                  onClick={() => setShowContentTypeSelector(true)}
                  className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Channel
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-400 mb-3">Choose channel type:</p>
                  <Button
                    onClick={() => createNewChat("text")}
                    className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300 mb-2"
                  >
                    📝 Text Channel
                  </Button>
                  <Button
                    onClick={() => createNewChat("video")}
                    className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300 mb-2"
                  >
                    🎥 Video Channel
                  </Button>
                  <Button
                    onClick={() => setShowContentTypeSelector(false)}
                    variant="outline"
                    className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                  >
                    Cancel
                  </Button>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowPasswordPrompt(true)}
                  className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700 text-red-300"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Owner Login
                </Button>
                <p className="text-xs text-red-500/70 text-center">Public viewing mode - Content is read-only</p>
              </div>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-2">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-all border-red-900/30 ${
                    activeChat === chat.id ? "bg-red-900/30 border-red-600" : "bg-black/50 hover:bg-red-900/20"
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      {editingChatTitle === chat.id && isOwner ? (
                        <div className="flex-1 mr-2">
                          <Input
                            value={newChatTitle}
                            onChange={(e) => setNewChatTitle(e.target.value)}
                            className="bg-black/50 border-red-700 text-red-200 h-7 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveChatTitle()
                              if (e.key === "Escape") cancelTitleEdit()
                            }}
                            autoFocus
                          />
                          <div className="flex space-x-1 mt-1">
                            <Button
                              onClick={saveChatTitle}
                              size="sm"
                              className="h-5 text-xs bg-green-900/50 hover:bg-green-800/50 px-2 text-black font-semibold"
                            >
                              <Save className="h-2 w-2 mr-1" />
                              Save
                            </Button>
                            <Button
                              onClick={cancelTitleEdit}
                              size="sm"
                              className="h-5 text-xs bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-2"
                            >
                              <X className="h-2 w-2 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 flex-1">
                            <h3 className="font-medium text-red-300 truncate text-sm">{chat.title}</h3>
                            {isOwner && (
                              <>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEditingTitle(chat.id, chat.title)
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0 text-red-400 hover:text-red-300"
                                >
                                  <Edit3 className="h-2 w-2" />
                                </Button>
                                {chats.length > 1 && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteChat(chat.id)
                                    }}
                                    size="sm"
                                    variant="ghost"
                                    className="h-4 w-4 p-0 text-red-600 hover:text-red-500"
                                  >
                                    <Trash2 className="h-2 w-2" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {chat.isPublic && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-1 py-0.5 rounded border border-green-700/30">
                                PUBLIC
                              </span>
                            )}
                            <span className="text-xs bg-red-900/30 text-red-400 px-1 py-0.5 rounded border border-red-700/30">
                              {chat.contentType.toUpperCase()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {editingChatTitle !== chat.id && (
                      <p className="text-xs text-red-500/70 mt-1">
                        {chat.messages.length === 0 ? "Empty channel" : `${chat.messages.length} items`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Desktop Main Chat Area */}
        <div className="flex-1 flex flex-col bg-black/80 backdrop-blur-sm">
          {/* Desktop Chat Header */}
          <div className="p-6 border-b border-red-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-red-400">{currentChat?.title}</h2>
                {currentChat?.isPublic && (
                  <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full">
                    PUBLIC - Everyone can see this
                  </span>
                )}
                {isOwner ? (
                  <span className="text-xs bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full">OWNER MODE</span>
                ) : (
                  <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">VIEW ONLY</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-red-600">
                <Download className="h-4 w-4" />
                <span className="text-sm">Download Available</span>
              </div>
            </div>
          </div>

          {/* Desktop Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {currentChat?.messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-red-400/70 text-lg">This channel is empty</p>
                  <p className="text-red-500/50 text-sm mt-2">
                    {isOwner
                      ? currentChat.contentType === "text"
                        ? "Add text content below to get started"
                        : "Add videos below to get started"
                      : "No content has been added yet"}
                  </p>
                </div>
              ) : (
                currentChat?.messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {message.type === "text" ? (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardContent className="p-4">
                          {editingMessage === message.id && isOwner ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="bg-black/50 border-red-700 text-red-200 min-h-[100px]"
                              />
                              <div className="flex space-x-2">
                                <Button onClick={saveEdit} size="sm" className="bg-green-900/50 hover:bg-green-800/50">
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  size="sm"
                                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-red-200 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-red-900/30">
                                <span className="text-xs text-red-500/70">{message.timestamp}</span>
                                <div className="flex items-center space-x-2">
                                  {isOwner && (
                                    <>
                                      <Button
                                        onClick={() => startEditing(message.id, message.content)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteMessage(message.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-600 hover:text-red-500"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    onClick={() => copyToClipboard(message.content)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs text-green-500/70">Can be copied</span>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ) : message.type === "file" ? (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardContent className="p-3">
                          {editingMessage === message.id && isOwner ? (
                            <div className="space-y-3">
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="bg-black/50 border-red-700 text-red-200 text-sm"
                              />
                              <div className="flex space-x-2">
                                <Button onClick={saveEdit} size="sm" className="bg-green-900/50 hover:bg-green-800/50">
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  size="sm"
                                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="text-2xl">{getFileIcon(message.fileType || "")}</div>
                                <div className="flex-1">
                                  <p className="text-red-200 font-medium text-sm">{message.fileName}</p>
                                  <p className="text-red-400/70 text-xs">
                                    {message.fileSize ? formatFileSize(message.fileSize) : "Unknown size"}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => downloadFile(message.fileUrl || "", message.fileName || "file")}
                                  size="sm"
                                  className="bg-green-900/50 hover:bg-green-800/50 text-green-200"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                              {message.fileType?.startsWith("image/") && (
                                <div className="mb-3">
                                  <img
                                    src={message.fileUrl || "/placeholder.svg"}
                                    alt={message.fileName}
                                    className="max-w-full h-auto rounded border border-red-900/50"
                                    style={{ maxHeight: "200px" }}
                                  />
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-3 border-t border-red-900/30">
                                <span className="text-xs text-red-500/70">{message.timestamp}</span>
                                <div className="flex items-center space-x-2">
                                  {isOwner && (
                                    <>
                                      <Button
                                        onClick={() => startEditing(message.id, message.fileName || message.content)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-400"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteMessage(message.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                  <span className="text-xs text-green-600/70">File Available</span>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            {editingMessage === message.id && isOwner ? (
                              <div className="flex-1 mr-4">
                                <Input
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="bg-black/50 border-red-700 text-red-200"
                                />
                                <div className="flex space-x-2 mt-2">
                                  <Button
                                    onClick={saveEdit}
                                    size="sm"
                                    className="bg-green-900/50 hover:bg-green-800/50"
                                  >
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={cancelEdit}
                                    size="sm"
                                    className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <CardTitle className="text-red-400 flex items-center">
                                  <Play className="h-4 w-4 mr-2" />
                                  {message.videoTitle || message.content}
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                  {isOwner && (
                                    <>
                                      <Button
                                        onClick={() => startEditing(message.id, message.videoTitle || message.content)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                      >
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        onClick={() => deleteMessage(message.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-red-600 hover:text-red-500"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    onClick={() => downloadVideo(message.videoUrl || "", message.videoTitle || "video")}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </CardHeader>
                        {editingMessage !== message.id && (
                          <CardContent>
                            <div className="relative bg-black rounded-lg overflow-hidden">
                              <video className="w-full h-64 object-cover" controls>
                                <source src={message.videoUrl || "/placeholder.mp4"} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-green-400 flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                Available
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs text-red-500/70">{message.timestamp}</span>
                              <span className="text-xs text-green-600/70">Download Enabled</span>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Desktop Add Content Section - Only for Owner */}
          {currentChat && isOwner && (
            <div className="p-4 border-t border-red-900/50 bg-red-950/20">
              {currentChat.contentType === "text" ? (
                <div className="space-y-3">
                  <Textarea
                    value={newTextContent}
                    onChange={(e) => setNewTextContent(e.target.value)}
                    placeholder="Add new text content... (Press Enter for new lines)"
                    className="bg-black/50 border-red-700 text-red-200 min-h-[80px]"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={addTextMessage}
                      disabled={!newTextContent.trim()}
                      className="bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                    <input
                      ref={textFileInputRef}
                      type="file"
                      multiple
                      onChange={handleTextFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => textFileInputRef.current?.click()}
                      className="bg-blue-900/50 hover:bg-blue-800/50 border border-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files & Videos
                    </Button>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-red-900/50">
                    <TabsTrigger value="url" className="data-[state=active]:bg-red-900/50 text-red-300">
                      <Link className="h-4 w-4 mr-2" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="file" className="data-[state=active]:bg-red-900/50 text-red-300">
                      <FileVideo className="h-4 w-4 mr-2" />
                      File Upload
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-3 mt-4">
                    <Input
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="Video title (optional)..."
                      className="bg-black/50 border-red-700 text-red-200"
                    />
                    <Input
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="Enter video URL..."
                      className="bg-black/50 border-red-700 text-red-200"
                    />
                    <Button
                      onClick={addVideoByUrl}
                      disabled={!newVideoUrl.trim()}
                      className="bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video by URL
                    </Button>
                  </TabsContent>
                  <TabsContent value="file" className="space-y-3 mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video Files
                    </Button>
                    <p className="text-xs text-red-500/70 text-center">Select multiple video files to upload at once</p>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}

          {/* Desktop View Only Notice */}
          {!isOwner && (
            <div className="p-4 border-t border-red-900/50 bg-red-950/20">
              <div className="flex items-center justify-center space-x-2 text-green-600/70">
                <Download className="h-4 w-4" />
                <span className="text-sm">Download & Copy Available • Full Access Mode</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
