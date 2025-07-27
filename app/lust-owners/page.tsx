"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, Play, Lock, Edit3, Save, X, Upload, Trash2, FileVideo, Link, Crown, Users } from "lucide-react"
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
  type: "text" | "video"
  videoUrl?: string
  videoTitle?: string
}

interface Chat {
  id: number
  title: string
  contentType: "text" | "video"
  isPublic: boolean
  messages: Message[]
}

export default function LustOwners() {
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
            "Welcome to LUST - This is a public chat that everyone can see. Explore the forbidden content that lies within.",
          timestamp: "10:30 PM",
          type: "text",
        },
        {
          id: 2,
          content: "This content can be copied and selected. Users have full access to interact with the text.",
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

  // Save to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem("lustChats", JSON.stringify(chats))
  }, [chats])

  // Load from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("lustChats")
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats)
        if (parsedChats.length > 0) {
          setChats(parsedChats)
        }
      } catch (error) {
        console.error("Error loading saved chats:", error)
      }
    }
  }, [])

  const createNewChat = (contentType: "text" | "video") => {
    const newChat: Chat = {
      id: chats.length + 1,
      title: `${contentType === "video" ? "Video" : "Text"} Chat ${chats.length + 1}`,
      contentType,
      isPublic: false,
      messages: [], // Empty by default
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
          id: Date.now() + Math.random(), // Ensure unique IDs for multiple files
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

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const startEditingTitle = (chatId: number, currentTitle: string) => {
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
    setChats(
      chats.map((chat) =>
        chat.id === activeChat ? { ...chat, messages: chat.messages.filter((msg) => msg.id !== messageId) } : chat,
      ),
    )
  }

  const deleteChat = (chatId: number) => {
    if (chats.length <= 1) return // Don't delete the last chat

    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)

    if (activeChat === chatId) {
      setActiveChat(updatedChats[0].id)
    }
  }

  const copyMembersLink = () => {
    const membersUrl = `${window.location.origin}/lust-members`
    navigator.clipboard.writeText(membersUrl)
    alert("Members link copied to clipboard!")
  }

  const currentChat = chats.find((chat) => chat.id === activeChat)

  return (
    <div className="min-h-screen bg-black text-red-500 overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/lust-bg.png)" }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70" />

      {/* Main Content */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar - Chat List */}
        <div className="w-80 border-r border-red-900/50 bg-black/90 backdrop-blur-sm">
          <div className="p-6 border-b border-red-900/50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-red-400 tracking-wider">LUST</h1>
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded">OWNER</span>
              </div>
            </div>

            <Button
              onClick={copyMembersLink}
              className="w-full mb-4 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-700 text-blue-300"
            >
              <Users className="h-4 w-4 mr-2" />
              Copy Members Link
            </Button>

            {!showContentTypeSelector ? (
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
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-260px)]">
            <div className="p-4 space-y-2">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-all border-red-900/30 ${
                    activeChat === chat.id ? "bg-red-900/30 border-red-600" : "bg-black/50 hover:bg-red-900/20"
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {editingChatTitle === chat.id ? (
                        <div className="flex-1 mr-2">
                          <Input
                            value={newChatTitle}
                            onChange={(e) => setNewChatTitle(e.target.value)}
                            className="bg-black/50 border-red-700 text-red-200 h-8 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveChatTitle()
                              if (e.key === "Escape") cancelTitleEdit()
                            }}
                            autoFocus
                          />
                          <div className="flex space-x-1 mt-1">
                            <Button onClick={saveChatTitle} size="sm" className="h-6 text-xs bg-green-900/50">
                              <Save className="h-2 w-2" />
                            </Button>
                            <Button
                              onClick={cancelTitleEdit}
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs bg-transparent"
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 flex-1">
                            <h3 className="font-medium text-red-300 truncate">{chat.title}</h3>
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
                            {!chat.isPublic && (
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
                          </div>
                          <div className="flex items-center space-x-1">
                            {chat.isPublic && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">PUBLIC</span>
                            )}
                            <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                              {chat.contentType.toUpperCase()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {editingChatTitle !== chat.id && (
                      <p className="text-sm text-red-500/70 mt-1">
                        {chat.messages.length === 0 ? "Empty - Add content" : `${chat.messages.length} items`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-black/80 backdrop-blur-sm">
          {/* Chat Header */}
          <div className="p-6 border-b border-red-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-red-400">{currentChat?.title}</h2>
                <span className="text-xs bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-full flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  OWNER MODE
                </span>
                {currentChat?.isPublic && (
                  <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full">
                    PUBLIC - Everyone can see this
                  </span>
                )}
                {currentChat?.contentType === "text" && (
                  <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">EDITABLE</span>
                )}
                {currentChat?.contentType === "video" && (
                  <span className="text-xs bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full">MULTI-VIDEO</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-red-600">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Content Available</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {currentChat?.messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-red-400/70 text-lg">This channel is empty</p>
                  <p className="text-red-500/50 text-sm mt-2">
                    {currentChat.contentType === "text"
                      ? "Add text content below to get started"
                      : "Add videos below to get started"}
                  </p>
                </div>
              ) : (
                currentChat?.messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {message.type === "text" ? (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardContent className="p-4">
                          {editingMessage === message.id ? (
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
                                  variant="outline"
                                  className="border-red-700 bg-transparent"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-red-200 leading-relaxed">{message.content}</p>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-red-900/30">
                                <span className="text-xs text-red-500/70">{message.timestamp}</span>
                                <div className="flex items-center space-x-2">
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
                                  <span className="text-xs text-green-600/70">Copyable</span>
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
                            {editingMessage === message.id ? (
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
                                    variant="outline"
                                    className="border-red-700 bg-transparent"
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
                                <span>Available</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs text-red-500/70">{message.timestamp}</span>
                              <span className="text-xs text-green-600/70">Full Access</span>
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

          {/* Add Content Section */}
          {currentChat && (
            <div className="p-4 border-t border-red-900/50 bg-red-950/20">
              {currentChat.contentType === "text" ? (
                <div className="space-y-3">
                  <Textarea
                    value={newTextContent}
                    onChange={(e) => setNewTextContent(e.target.value)}
                    placeholder="Add new text content..."
                    className="bg-black/50 border-red-700 text-red-200 min-h-[80px]"
                  />
                  <Button
                    onClick={addTextMessage}
                    disabled={!newTextContent.trim()}
                    className="bg-red-900/50 hover:bg-red-800/50 border border-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
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
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 text-center text-xs text-green-500/70">
        Content is available for copying • Full access for owners • Normal browser functionality enabled
      </div>
    </div>
  )
}
