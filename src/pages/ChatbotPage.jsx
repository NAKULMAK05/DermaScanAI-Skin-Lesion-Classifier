"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom";
import {
  Send,
  Bot,
  User,
  Loader2,
  ArrowRight,
  Brain,
  Microscope,
  Dna,
  Sparkles,
  MessageSquare,
  RefreshCw,
  Copy,
  CheckCheck,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const API_KEY = "AIzaSyDicwrWgGI6An8fVs8WmmUhMS0Wz2kNjiY"
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

// Sample suggested questions
const suggestedQuestions = [
  "What are the common types of skin cancer?",
  "How can I differentiate between a benign mole and melanoma?",
  "What factors increase the risk of skin lesions?",
  "How accurate is AI in diagnosing skin conditions?",
  "What should I do if I notice a changing mole?",
  "How does the CNN model analyze skin images?",
  "What's the difference between basal cell and squamous cell carcinoma?",
  "How often should I get a skin check?",
]

// Sample quick actions
const quickActions = [
  { icon: <RefreshCw className="h-4 w-4" />, label: "New Chat", action: "new-chat" },
  { icon: <HelpCircle className="h-4 w-4" />, label: "Help", action: "help" },
  { icon: <Brain className="h-4 w-4" />, label: "Capabilities", action: "capabilities" },
]

// Sample skin conditions for the sidebar
const skinConditions = [
  { name: "Melanoma", description: "A serious form of skin cancer" },
  { name: "Basal Cell Carcinoma", description: "Most common type of skin cancer" },
  { name: "Squamous Cell Carcinoma", description: "Second most common skin cancer" },
  { name: "Actinic Keratosis", description: "Precancerous skin growth" },
  { name: "Nevus", description: "Common mole" },
  { name: "Seborrheic Keratosis", description: "Benign skin growth" },
]

const ChatbotPage = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showConditionInfo, setShowConditionInfo] = useState(null)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Initialize chat with welcome message
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true)
      setTypingIndicator(true)

      try {
        const instructions =
          "You are a medical chatbot specialized in skin lesion analysis and dermatology. Provide helpful, accurate information about skin conditions, diagnosis methods, and general dermatology knowledge. Always clarify that you're an AI assistant and not a replacement for professional medical advice."
        const initialPrompt = "Please introduce yourself and explain how you can assist with skin lesion questions."

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `${instructions}\n\nUser: ${initialPrompt}` }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`API Error: ${errorData.error?.message || response.statusText}`)
        }

        const data = await response.json()
        const botResponse = data.candidates[0].content.parts[0].text

        // Simulate typing effect
        setTimeout(() => {
          setMessages([{ role: "bot", content: botResponse, timestamp: new Date() }])
          setTypingIndicator(false)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(`Failed to initialize chat: ${err.message}`)
        setTypingIndicator(false)
        setIsLoading(false)
      }
    }

    initializeChat()

    // Focus input field
    setTimeout(() => {
      inputRef.current?.focus()
    }, 500)
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingIndicator])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }])
    setTypingIndicator(true)
    setError("")

    try {
      const instructions =
        "You are a medical chatbot specialized in skin lesion analysis and dermatology. Provide helpful, accurate information about skin conditions, diagnosis methods, and general dermatology knowledge. Always clarify that you're an AI assistant and not a replacement for professional medical advice."

      const chatHistory = messages
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      const promptText = `${instructions}\n\n${chatHistory}\nUser: ${userMessage}`

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const botResponse = data.candidates[0].content.parts[0].text

      // Simulate typing effect
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", content: botResponse, timestamp: new Date() }])
        setTypingIndicator(false)
      }, 1000)
    } catch (err) {
      setError(`Failed to get response: ${err.message}`)
      setTypingIndicator(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question) => {
    setInput(question)
    inputRef.current?.focus()
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case "new-chat":
        setMessages([])
        const initializeChat = async () => {
          setIsLoading(true)
          setTypingIndicator(true)

          try {
            const instructions =
              "You are a medical chatbot specialized in skin lesion analysis and dermatology. Provide helpful, accurate information about skin conditions, diagnosis methods, and general dermatology knowledge. Always clarify that you're an AI assistant and not a replacement for professional medical advice."
            const initialPrompt = "Please introduce yourself and explain how you can assist with skin lesion questions."

            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: `${instructions}\n\nUser: ${initialPrompt}` }] }],
                generationConfig: {
                  temperature: 0.7,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 8192,
                },
              }),
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`API Error: ${errorData.error?.message || response.statusText}`)
            }

            const data = await response.json()
            const botResponse = data.candidates[0].content.parts[0].text

            // Simulate typing effect
            setTimeout(() => {
              setMessages([{ role: "bot", content: botResponse, timestamp: new Date() }])
              setTypingIndicator(false)
              setIsLoading(false)
            }, 1000)
          } catch (err) {
            setError(`Failed to initialize chat: ${err.message}`)
            setTypingIndicator(false)
            setIsLoading(false)
          }
        }

        initializeChat()
        break
      case "help":
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "# How to use the DermAI Medical Assistant\n\n- Type your questions about skin conditions, diagnosis, or treatments in the input field\n- Click on suggested questions to quickly get information\n- Use the sidebar to explore common skin conditions\n- Your conversation is private and not stored permanently\n\nRemember that this AI assistant provides general information and is not a substitute for professional medical advice.",
            timestamp: new Date(),
            isHelp: true,
          },
        ])
        break
      case "capabilities":
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "# DermAI Medical Assistant Capabilities\n\n- Provide information about common skin conditions and lesions\n- Explain diagnostic techniques used in dermatology\n- Describe treatment options for various skin conditions\n- Explain how our AI classification system works\n- Answer general questions about skin health and care\n\nI cannot:\n- Provide definitive medical diagnosis\n- Replace consultation with a healthcare professional\n- Analyze images directly in this chat interface (use our Prediction page for that)\n- Access your personal medical records",
            timestamp: new Date(),
            isHelp: true,
          },
        ])
        break
      default:
        break
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  }

  // Format message content with markdown-like syntax
  const formatMessage = (content) => {
    // Handle headers
    content = content.replace(/^# (.*$)/gm, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>')
    content = content.replace(/^## (.*$)/gm, '<h4 class="text-md font-bold mt-2 mb-1">$1</h4>')

    // Handle lists
    content = content.replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    content = content.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    content = content.replace(/^\d\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')

    // Handle bold and italic
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    content = content.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Handle line breaks
    content = content.replace(/\n/g, "<br>")

    return content
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <motion.header
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medical Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chat with our AI assistant about skin conditions, diagnosis, and treatment options
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Sidebar - only visible on large screens or when toggled */}
          <motion.div
            className={`lg:col-span-1 ${showSidebar ? "block" : "hidden lg:block"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              {/* Sidebar Header */}
              <div className="bg-primary/5 p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900 flex items-center">
                  <Sparkles className="h-4 w-4 text-primary mr-2" />
                  AI Medical Assistant
                </h2>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">QUICK ACTIONS</h3>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
                    >
                      {action.icon}
                      <span className="ml-1.5">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">SUGGESTED QUESTIONS</h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 flex items-center group transition-colors"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="line-clamp-2 text-black">{question}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Skin Conditions */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">COMMON SKIN CONDITIONS</h3>
                <div className="space-y-2">
                  {skinConditions.map((condition, index) => (
                    <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                      <button
                        onClick={() => setShowConditionInfo(showConditionInfo === index ? null : index)}
                        className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium flex items-center justify-between transition-colors"
                      >
                        <span>{condition.name}</span>
                        {showConditionInfo === index ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                      {showConditionInfo === index && (
                        <div className="p-3 text-sm text-gray-600 bg-white">
                          <p>{condition.description}</p>
                          <button
                            onClick={() => handleSuggestedQuestion(`Tell me more about ${condition.name}`)}
                            className="mt-2 text-primary hover:text-primary/80 text-xs flex items-center"
                          >
                            Ask about this <ArrowRight className="ml-1 h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  This AI assistant provides general information and is not a substitute for professional medical
                  advice.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col h-[700px]">
              {/* Chat Header */}
              <div className="bg-primary/5 p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">DermAI Assistant</h3>
                    <p className="text-xs text-gray-500">
                      {isLoading || typingIndicator ? (
                        <span className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Typing...
                        </span>
                      ) : (
                        <span>Online | Ready to assist</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Mobile sidebar toggle */}
                <button
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                </button>
              </div>

              {/* Messages Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex max-w-[85%] group">
                        {message.role === "bot" && (
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <div className={`p-2 rounded-full ${message.isHelp ? "bg-indigo-100" : "bg-primary/10"}`}>
                              <Bot className={`h-5 w-5 ${message.isHelp ? "text-indigo-600" : "text-primary"}`} />
                            </div>
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-primary text-white rounded-tr-none"
                              : message.isHelp
                                ? "bg-indigo-50 text-gray-800 rounded-tl-none"
                                : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                          }`}
                        >
                          <div
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                          />

                          {/* Message timestamp and actions */}
                          <div
                            className={`mt-2 flex justify-between items-center text-xs ${
                              message.role === "user" ? "text-white/70" : "text-gray-400"
                            }`}
                          >
                            <span>{formatTimestamp(message.timestamp)}</span>

                            {message.role === "bot" && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => copyToClipboard(message.content)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  aria-label="Copy message"
                                >
                                  {isCopied ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {message.role === "user" && (
                          <div className="flex-shrink-0 ml-3 mt-1">
                            <div className="bg-primary p-2 rounded-full">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {typingIndicator && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex max-w-[85%]">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="rounded-2xl px-6 py-4 bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
                  >
                    <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your question here..."
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      disabled={isLoading || typingIndicator}
                    />
                    {input && (
                      <button
                        type="button"
                        onClick={() => setInput("")}
                        className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || typingIndicator || !input.trim()}
                    className={`p-3 rounded-full ${
                      isLoading || typingIndicator || !input.trim()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"
                    } text-white shadow-md hover:shadow-lg transition-all`}
                  >
                    {isLoading || typingIndicator ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This AI assistant provides general information and is not a substitute for professional medical
                  advice.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="mt-16 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <motion.h2 className="text-3xl font-bold text-gray-900 mb-4" variants={itemVariants}>
              How Our Medical Assistant Helps You
            </motion.h2>
            <motion.p className="text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
              Powered by advanced AI to provide accurate information about skin conditions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" variants={itemVariants}>
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Medical Knowledge</h3>
              <p className="text-gray-600">
                Access comprehensive information about skin conditions, treatments, and diagnostic approaches from our
                AI trained on medical literature.
              </p>
            </motion.div>

            <motion.div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" variants={itemVariants}>
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Diagnostic Guidance</h3>
              <p className="text-gray-600">
                Learn about the signs and symptoms of various skin conditions and understand when to seek professional
                medical attention.
              </p>
            </motion.div>

            <motion.div className="bg-white rounded-xl p-6 shadow-md border border-gray-200" variants={itemVariants}>
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Dna className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Educational Resource</h3>
              <p className="text-gray-600">
                Enhance your understanding of dermatology with explanations of medical terms, procedures, and the
                science behind skin health.
              </p>
            </motion.div>
          </div>

          <motion.div className="mt-12 text-center" variants={itemVariants}>
            <Link
              to="/predict"
              className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              Try Our Skin Lesion Classifier <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ChatbotPage

