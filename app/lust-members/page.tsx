"use client"

import { useState, useEffect } from "react"
import { Play, Users, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

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

export default function LustMembers() {
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

  // Load from localStorage and sync with owner updates
  useEffect(() => {
    const loadChats = () => {
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
    }

    // Load initially
    loadChats()

    // Listen for storage changes (when owner updates)
    const handleStorageChange = () => {
      loadChats()
    }

    window.addEventListener("storage", handleStorageChange)

    // Also poll for changes every second to sync with owner updates
    const interval = setInterval(loadChats, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-red-400 tracking-wider">LUST</h1>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">MEMBER</span>
              </div>
            </div>

            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-400 mb-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">View Access</span>
              </div>
              <p className="text-xs text-red-500/70">You can view and copy all content. Full text selection enabled.</p>
            </div>
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
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-red-300 truncate">{chat.title}</h3>
                      <div className="flex items-center space-x-1">
                        {chat.isPublic && (
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">PUBLIC</span>
                        )}
                        <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                          {chat.contentType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-red-500/70 mt-1">
                      {chat.messages.length === 0 ? "Empty channel" : `${chat.messages.length} items`}
                    </p>
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
                <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  MEMBER VIEW
                </span>
                {currentChat?.isPublic && (
                  <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full">
                    PUBLIC - Everyone can see this
                  </span>
                )}
                <span className="text-xs bg-gray-900/30 text-gray-400 px-3 py-1 rounded-full">READ ONLY</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
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
                  <p className="text-red-500/50 text-sm mt-2">No content has been added yet</p>
                </div>
              ) : (
                currentChat?.messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {message.type === "text" ? (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardContent className="p-4">
                          <p className="text-red-200 leading-relaxed">{message.content}</p>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-red-900/30">
                            <span className="text-xs text-red-500/70">{message.timestamp}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-green-500/70">Text can be copied</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-red-950/30 border-red-900/50">
                        <CardHeader>
                          <CardTitle className="text-red-400 flex items-center justify-between">
                            <div className="flex items-center">
                              <Play className="h-4 w-4 mr-2" />
                              {message.videoTitle || message.content}
                            </div>
                            <span className="text-xs text-gray-500/70">View Only</span>
                          </CardTitle>
                        </CardHeader>
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
                      </Card>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Bottom Notice for Members */}
          <div className="p-4 border-t border-red-900/50 bg-red-950/20">
            <div className="flex items-center justify-center space-x-2 text-green-600/70">
              <span className="text-sm">
                Member Access • Content can be copied • Text selection enabled • Normal browser functionality
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
