import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Builder = () => {
    const { user, logout } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState('mock'); // Default provider
    const [files, setFiles] = useState([]);
    const [fileMap, setFileMap] = useState({});
    const [activeFile, setActiveFile] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/ai/generate', { prompt, provider }, config);
            setGeneratedCode(data.data.code);
        } catch (error) {
            console.error("Error generating code:", error);
            alert("Failed to generate code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateProject = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/ai/generate-project', { prompt, provider }, config);
            setFiles(data.data.files || []);
            setFileMap(data.data.fileMap || {});
            setActiveFile((data.data.files || [])[0] || '');
        } catch (error) {
            console.error("Error generating project:", error);
            alert("Failed to generate project. Please try again.");
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
            <div className="flex-grow flex p-4 gap-4">
                <div className="w-1/3 bg-white p-4 rounded shadow flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Controls</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">AI Model</label>
                        <select 
                            value={provider} 
                            onChange={(e) => setProvider(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
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
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Generating...' : 'Generate Website'}
                    </button>
                    <button
                        onClick={handleGenerateProject}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'}`}
                    >
                        {loading ? 'Working...' : 'Generate Project Files'}
                    </button>
                </div>

                <div className="w-2/3 bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Generated Output</h2>
                    <div className="bg-gray-900 text-white p-4 rounded h-[calc(100vh-200px)] overflow-auto font-mono text-sm whitespace-pre-wrap">
                        {generatedCode || "// Your generated code will appear here..."}
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
