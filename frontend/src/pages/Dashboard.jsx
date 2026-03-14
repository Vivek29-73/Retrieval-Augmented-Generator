import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    getMe,
    logoutUser,
    uploadDocuments,
    getDocuments,
    deleteDocument,
    askQuestion,
    getHistory
} from "../api"

// history item component with dropdown
function HistoryItem({ item }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="history-item">
            <div
                className="history-question"
                onClick={() => setOpen(!open)}
            >
                <span>{item.question}</span>
                <span className="history-arrow">{open ? "▲" : "▼"}</span>
            </div>

            {open && (
                <div className="history-answer">
                    <p>{item.answer}</p>
                    {item.sources && item.sources.length > 0 && (
                        <div className="sources">
                            {item.sources.map((source, i) => (
                                <p key={i} className="source-item">
                                    {source.filename} - score: {source.score.toFixed(2)}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function Dashboard() {
    const [user, setUser] = useState(null)
    const [documents, setDocuments] = useState([])
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [sources, setSources] = useState([])
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("documents")
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()
        loadDocuments()
        loadHistory()
    }, [])

    async function checkAuth() {
        const data = await getMe()
        if(!data.user) {
            navigate("/")
        } else {
            setUser(data.user)
        }
    }

    async function loadDocuments() {
        const data = await getDocuments()
        if(data.documents) {
            setDocuments(data.documents)
        }
    }

    async function loadHistory() {
        const data = await getHistory()
        if(data.history) {
            setHistory(data.history)
        }
    }

    async function handleUpload(e) {
        const files = e.target.files
        if(!files || files.length === 0) return
        setUploadLoading(true)
        setError("")
        const data = await uploadDocuments(files)
        if(data.success) {
            await loadDocuments()
        } else {
            setError(data.error || "upload failed")
        }
        setUploadLoading(false)
        e.target.value = ""
        // reset file input after upload
    }

    async function handleDelete(documentId) {
        const data = await deleteDocument(documentId)
        if(data.success) {
            await loadDocuments()
        }
    }

    async function handleAsk() {
        if(!question.trim()) return
        setLoading(true)
        setError("")
        setAnswer("")
        setSources([])
        const data = await askQuestion(question)
        if(data.answer) {
            setAnswer(data.answer)
            setSources(data.sources || [])
            await loadHistory()
        } else {
            setError(data.error || "something went wrong")
        }
        setLoading(false)
    }

    async function handleLogout() {
        await logoutUser()
        navigate("/")
    }

    return (
        <div className="dashboard">

            <div className="header">
                <h1>RAG Assistant</h1>
                <div className="header-right">
                    {user && <span>Hello, {user.name}</span>}
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === "documents" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("documents")}
                >
                    Documents
                </button>
                <button
                    className={activeTab === "ask" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("ask")}
                >
                    Ask Question
                </button>
                <button
                    className={activeTab === "history" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("history")}
                >
                    History
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            {activeTab === "documents" && (
                <div className="tab-content">
                    <h3>Upload Documents</h3>
                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleUpload}
                        disabled={uploadLoading}
                    />
                    {uploadLoading && <p>uploading and processing...</p>}

                    <h3>Your Documents</h3>
                    {documents.length === 0 ? (
                        <p>no documents uploaded yet</p>
                    ) : (
                        documents.map(doc => (
                            <div key={doc._id} className="document-item">
                                <div>
                                    <p className="doc-name">{doc.filename}</p>
                                    <p className="doc-info">
                                        {doc.totalChunks} chunks
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "ask" && (
                <div className="tab-content">
                    <h3>Ask a Question</h3>
                    <textarea
                        placeholder="ask anything about your documents..."
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        rows={4}
                    />
                    <button onClick={handleAsk} disabled={loading}>
                        {loading ? "thinking..." : "Ask"}
                    </button>

                    {answer && (
                        <div className="answer-box">
                            <h4>Answer</h4>
                            <p>{answer}</p>
                            {sources.length > 0 && (
                                <div className="sources">
                                    <h4>Sources</h4>
                                    {sources.map((source, i) => (
                                        <p key={i} className="source-item">
                                            {source.filename} - score: {source.score.toFixed(2)}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "history" && (
                <div className="tab-content">
                    <h3>Conversation History</h3>
                    {history.length === 0 ? (
                        <p>no history yet</p>
                    ) : (
                        history.map(item => (
                            <HistoryItem key={item._id} item={item} />
                        ))
                    )}
                </div>
            )}

        </div>
    )
}

export default Dashboard