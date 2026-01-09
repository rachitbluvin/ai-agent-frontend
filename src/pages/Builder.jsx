import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Builder = () => {
    const { user, logout } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState('auto'); // Default provider (auto pick)
    const [files, setFiles] = useState([]);
    const [fileMap, setFileMap] = useState({});
    const [activeFile, setActiveFile] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [chatId, setChatId] = useState('');
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const loadChats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/chat', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setChats(data.data || []);
            } catch {}
        };
        loadChats();
    }, [user]);

    const openChat = async (id) => {
        try {
            setChatId(id);
            const { data } = await axios.get(`http://localhost:5000/api/chat/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setMessages(data.data?.messages || []);
        } catch {}
    };

    const newChat = async () => {
        try {
            const title = prompt || 'New Chat';
            const { data } = await axios.post('http://localhost:5000/api/chat/start', { title }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChatId(data.data?.id);
            setMessages([]);
            const { data: list } = await axios.get('http://localhost:5000/api/chat', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChats(list.data || []);
        } catch {}
    };

    const handleSend = async () => {
        if (!prompt && uploadFiles.length === 0) return;
        setLoading(true);
        try {
            let data;
            if (editMode && uploadFiles.length > 0) {
                const form = new FormData();
                form.append('prompt', prompt);
                form.append('provider', provider);
                if (chatId) form.append('chatId', chatId);
                [...uploadFiles].slice(0, 6).forEach((f) => form.append('files', f, f.name));
                const { data: resp } = await axios.post('http://localhost:5000/api/ai/send', form, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                data = resp;
            } else {
                const { data: resp } = await axios.post('http://localhost:5000/api/ai/send', { prompt, provider, chatId }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                data = resp;
            }
            const intent = data.data?.intent;
            if (data.data?.chatId && data.data?.chatId !== chatId) {
                setChatId(data.data.chatId);
                const { data: chatResp } = await axios.get(`http://localhost:5000/api/chat/${data.data.chatId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setMessages(chatResp.data?.messages || []);
                const { data: list } = await axios.get('http://localhost:5000/api/chat', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setChats(list.data || []);
            } else if (chatId) {
                const { data: chatResp } = await axios.get(`http://localhost:5000/api/chat/${chatId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setMessages(chatResp.data?.messages || []);
            }
            if (intent === 'generate_project') {
                setFiles(data.data.files || []);
                setFileMap(data.data.fileMap || {});
                setActiveFile((data.data.files || [])[0] || '');
                setGeneratedCode('');
            } else if (intent === 'modify_files') {
                setGeneratedCode(`Files updated in ${data.data.folder}: ${data.data.files?.join(', ')}`);
            } else {
                setGeneratedCode(data.data.text || data.data.code || '');
            }
            setPrompt('');
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">AI Builder</h1>
                <div className="flex items-center gap-4">
                    <span>Welcome, {user?.username}</span>
                    <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
                </div>
            </nav>
            <div className="flex-grow grid grid-cols-12 p-4 gap-4">
                <div className="col-span-3 bg-white p-4 rounded shadow flex flex-col gap-4">
                    <button onClick={newChat} className="px-3 py-2 bg-gray-900 text-white rounded">New Chat</button>
                    <div className="border rounded h-48 overflow-auto">
                        <div className="p-2 text-sm font-semibold">Chats</div>
                        <ul>
                            {chats.map((c) => (
                                <li
                                    key={c._id}
                                    className={`px-2 py-1 cursor-pointer ${chatId === c._id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                                    onClick={() => openChat(c._id)}
                                >
                                    {c.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <h2 className="text-lg font-semibold">Controls</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">AI Model</label>
                        <select 
                            value={provider} 
                            onChange={(e) => setProvider(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            <option value="auto">Auto</option>
                            <option value="mock">Mock (Test)</option>
                            <option value="openai">OpenAI (GPT-4)</option>
                            <option value="gemini">Gemini</option>
                            <option value="claude">Claude</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prompt</label>
                        <textarea
                            className="w-full h-40 p-2 border rounded mt-1"
                            placeholder="Describe the website you want to build..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className={`w-full px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                    <div className="border-t pt-4">
                        <label className="inline-flex items-center gap-2">
                            <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
                            <span className="text-sm">Edit a file</span>
                        </label>
                        {editMode && (
                            <div className="mt-3 space-y-3">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setUploadFiles(e.target.files)}
                                    className="w-full"
                                />
                                <div className="text-xs text-gray-600">Upload up to 6 files per request</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-9 bg-white p-4 rounded shadow">
                    <div className="h-[60vh] overflow-auto space-y-6">
                        {messages.map((m, idx) => (
                            <div key={idx} className="border rounded p-3">
                                <div className="text-xs text-gray-500">{m.role}</div>
                                {m.role === 'user' ? (
                                    <div className="mt-2">{m.prompt}</div>
                                ) : (
                                    <div className="mt-2">
                                        {m.text && <div className="text-sm whitespace-pre-wrap">{m.text}</div>}
                                        {m.code && <pre className="bg-gray-900 text-white p-3 rounded text-xs whitespace-pre-wrap">{m.code}</pre>}
                                        {m.explanation && <div className="mt-2 text-xs text-gray-600">Explanation: {m.explanation}</div>}
                                        {m.summary && <div className="mt-1 text-xs text-gray-600">Summary: {m.summary}</div>}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="col-span-1 border rounded h-80 overflow-auto">
                            <div className="p-2 text-sm font-semibold">Files</div>
                            <ul>
                                {files.map((f) => (
                                    <li
                                        key={f}
                                        className={`px-2 py-1 cursor-pointer ${activeFile === f ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                                        onClick={() => setActiveFile(f)}
                                    >
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 border rounded h-80 overflow-auto">
                            <div className="p-2 text-sm font-semibold">{activeFile || 'Select a file'}</div>
                            <pre className="p-2 text-xs whitespace-pre-wrap">
                                {activeFile ? fileMap[activeFile] : ''}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Builder;
