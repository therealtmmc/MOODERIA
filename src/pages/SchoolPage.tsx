import React, { useState, useEffect, useRef } from"react";
import { useStore } from"@/context/StoreContext";
import { Folder, FileText, Image as ImageIcon, Film, File, Plus, ArrowLeft, MoreVertical, Edit2, Trash2, X, Upload, Brain, Play, ChevronRight, ChevronLeft } from"lucide-react";
import { motion, AnimatePresence } from"motion/react";
import { cn } from"@/lib/utils";
import localforage from"localforage";
import * as mammoth from"mammoth/mammoth.browser";

export default function SchoolPage() {
 const { state, dispatch } = useStore();
 const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
 const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
 const [newFolderName, setNewFolderName] = useState("");
 const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
 const [editingFileId, setEditingFileId] = useState<string | null>(null);
 const [editName, setEditName] = useState("");
 const fileInputRef = useRef<HTMLInputElement>(null);
 
 const [previewFile, setPreviewFile] = useState<{ id: string, name: string, type: string } | null>(null);
 const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [previewText, setPreviewText] = useState<string | null>(null);
 const [isLoadingPreview, setIsLoadingPreview] = useState(false);

 // Flashcards state
 const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
 const [newDeckName, setNewDeckName] = useState("");
 const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
 const [playingDeckId, setPlayingDeckId] = useState<string | null>(null);
 const [flashcardQuestion, setFlashcardQuestion] = useState("");
 const [flashcardAnswer, setFlashcardAnswer] = useState("");
 const [currentCardIndex, setCurrentCardIndex] = useState(0);
 const [isFlipped, setIsFlipped] = useState(false);

 const currentFolder = state.schoolFolders.find(f => f.id === currentFolderId);
 const folders = state.schoolFolders.filter(f => f.parentId === currentFolderId);
 const files = state.schoolFiles.filter(f => f.folderId === currentFolderId);
 const flashcardDecks = (state.flashcardDecks || []).filter(f => f.folderId === currentFolderId);
 const editingDeck = state.flashcardDecks?.find(d => d.id === editingDeckId);
 const playingDeck = state.flashcardDecks?.find(d => d.id === playingDeckId);

 const handleCreateFolder = () => {
 if (!newFolderName.trim()) return;
 dispatch({
 type:"ADD_SCHOOL_FOLDER",
 payload: {
 id: crypto.randomUUID(),
 name: newFolderName.trim(),
 parentId: currentFolderId,
 createdAt: Date.now(),
 }
 });
 setNewFolderName("");
 setIsCreateFolderModalOpen(false);
 };

 const handleRenameFolder = (id: string) => {
 if (!editName.trim()) return;
 dispatch({ type:"RENAME_SCHOOL_FOLDER", payload: { id, name: editName.trim() } });
 setEditingFolderId(null);
 };

 const handleRenameFile = (id: string) => {
 if (!editName.trim()) return;
 dispatch({ type:"RENAME_SCHOOL_FILE", payload: { id, name: editName.trim() } });
 setEditingFileId(null);
 };

 const handleDeleteFolder = (id: string) => {
 if (confirm("Are you sure you want to delete this folder and all its contents?")) {
 dispatch({ type:"DELETE_SCHOOL_FOLDER", payload: id });
 }
 };

 const handleDeleteFile = async (id: string) => {
 if (confirm("Are you sure you want to delete this file?")) {
 await localforage.removeItem(`file_${id}`);
 dispatch({ type:"DELETE_SCHOOL_FILE", payload: id });
 }
 };

 const handleCreateDeck = () => {
 if (!newDeckName.trim()) return;
 dispatch({
 type:"ADD_FLASHCARD_DECK",
 payload: {
 id: crypto.randomUUID(),
 name: newDeckName.trim(),
 folderId: currentFolderId,
 cards: [],
 createdAt: Date.now()
 }
 });
 setNewDeckName("");
 setIsCreateDeckModalOpen(false);
 };

 const handleAddFlashcard = () => {
 if (!flashcardQuestion.trim() || !flashcardAnswer.trim() || !editingDeck) return;
 dispatch({
 type:"UPDATE_FLASHCARD_DECK",
 payload: {
 ...editingDeck,
 cards: [...editingDeck.cards, { id: crypto.randomUUID(), question: flashcardQuestion.trim(), answer: flashcardAnswer.trim() }]
 }
 });
 setFlashcardQuestion("");
 setFlashcardAnswer("");
 };

 const handleDeleteFlashcard = (cardId: string) => {
 if (!editingDeck) return;
 dispatch({
 type:"UPDATE_FLASHCARD_DECK",
 payload: {
 ...editingDeck,
 cards: editingDeck.cards.filter(c => c.id !== cardId)
 }
 });
 };

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 const id = crypto.randomUUID();
 
 // Store file in localforage
 try {
 await localforage.setItem(`file_${id}`, file);
 
 dispatch({
 type:"ADD_SCHOOL_FILE",
 payload: {
 id,
 name: file.name,
 folderId: currentFolderId,
 type: file.type || file.name.split('.').pop() ||'unknown',
 size: file.size,
 createdAt: Date.now(),
 }
 });
 
 dispatch({ type:"UPDATE_STATISTIC", payload: { key:"filesUploaded", amount: 1 } });
 } catch (err) {
 console.error("Failed to save file", err);
 alert("Failed to save file. It might be too large.");
 }
 
 if (fileInputRef.current) fileInputRef.current.value ="";
 };

 const openPreview = async (fileMeta: any) => {
 setPreviewFile(fileMeta);
 setIsLoadingPreview(true);
 setPreviewUrl(null);
 setPreviewText(null);
 
 try {
 const fileBlob = await localforage.getItem<Blob>(`file_${fileMeta.id}`);
 if (!fileBlob) throw new Error("File not found");

 if (fileMeta.type.startsWith('image/') || fileMeta.type.startsWith('video/')) {
 const url = URL.createObjectURL(fileBlob);
 setPreviewUrl(url);
 } else if (fileMeta.name.endsWith('.docx')) {
 const arrayBuffer = await fileBlob.arrayBuffer();
 const result = await mammoth.extractRawText({ arrayBuffer });
 setPreviewText(result.value);
 } else {
 // For pptx or other unsupported preview types, we just offer download
 const url = URL.createObjectURL(fileBlob);
 setPreviewUrl(url);
 }
 } catch (err) {
 console.error("Preview failed", err);
 setPreviewText("Failed to load file preview.");
 } finally {
 setIsLoadingPreview(false);
 }
 };

 const closePreview = () => {
 if (previewUrl) URL.revokeObjectURL(previewUrl);
 setPreviewFile(null);
 setPreviewUrl(null);
 setPreviewText(null);
 };

 const getFileIcon = (type: string, name: string) => {
 if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
 if (type.startsWith('video/')) return <Film className="w-8 h-8 text-purple-500" />;
 if (name.endsWith('.docx') || name.endsWith('.doc')) return <FileText className="w-8 h-8 text-blue-700" />;
 if (name.endsWith('.pptx') || name.endsWith('.ppt')) return <FileText className="w-8 h-8 text-orange-500" />;
 return <File className="w-8 h-8 text-gray-500" />;
 };

 return (
 <div className={cn("p-4 pt-8 pb-24 min-h-screen space-y-6 transition-colors duration-500", state.isStarkTheme &&"stark-theme bg-black")}>
 <header className="flex items-center justify-between">
 <div>
 <h1 className={cn("text-3xl font-black", state.isStarkTheme ?"text-green-500 font-mono uppercase tracking-tighter" :"text-[#46178f]")}>
 {state.isStarkTheme ?"SYS.ARCHIVE" :"School"}
 </h1>
 <p className={cn("font-bold", state.isStarkTheme ?"text-green-600/70 font-mono text-xs uppercase tracking-widest" :"text-gray-500")}>
 {state.isStarkTheme ?"DATA.STORAGE.ACCESS()" :"Your Personal Files"}
 </p>
 </div>
 </header>

 {/* Breadcrumbs */}
 <div className={cn("flex items-center gap-2 p-3 rounded-xl", state.isStarkTheme ?"bg-green-900/20 border-green-500/30" :"bg-white")}>
 <button 
 onClick={() => setCurrentFolderId(null)}
 className={cn("font-bold hover:underline", state.isStarkTheme ?"text-green-400 font-mono" :"text-indigo-600")}
 >
 {state.isStarkTheme ?"ROOT" :"Home"}
 </button>
 {currentFolder && (
 <>
 <span className={state.isStarkTheme ?"text-green-600" :"text-gray-400"}>/</span>
 <span className={cn("font-bold", state.isStarkTheme ?"text-green-500 font-mono" :"text-gray-800")}>{currentFolder.name}</span>
 </>
 )}
 </div>

 {/* Actions */}
 <div className="flex flex-col sm:flex-row gap-3">
 <button
 onClick={() => setIsCreateFolderModalOpen(true)}
 className={cn("flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95", 
 state.isStarkTheme ?"bg-black border-green-500 text-green-400 hover:bg-green-900/30 font-mono" :"bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
 )}
 >
 <Folder className="w-5 h-5" /> New Folder
 </button>
 <button
 onClick={() => setIsCreateDeckModalOpen(true)}
 className={cn("flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95", 
 state.isStarkTheme ?"bg-black border-green-500 text-green-400 hover:bg-green-900/30 font-mono" :"bg-pink-100 text-pink-700 hover:bg-pink-200"
 )}
 >
 <Brain className="w-5 h-5" /> Flashcards
 </button>
 <button
 onClick={() => fileInputRef.current?.click()}
 className={cn("flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95", 
 state.isStarkTheme ?"bg-green-500 text-black border-green-400 hover:bg-green-400 font-mono" :"bg-indigo-600 text-white hover:bg-indigo-700"
 )}
 >
 <Upload className="w-5 h-5" /> Upload File
 </button>
 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
 </div>

 {/* Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
 {folders.map(folder => (
 <div key={folder.id} className={cn("p-4 rounded-2xl flex flex-col items-center gap-2 relative group cursor-pointer transition-transform hover:scale-105", 
 state.isStarkTheme ?"bg-black border-green-500/30 hover:-green-500" :"bg-white hover:"
 )}>
 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
 <button onClick={(e) => { e.stopPropagation(); setEditingFolderId(folder.id); setEditName(folder.name); }} className={cn("p-1 rounded-md", state.isStarkTheme ?"hover:bg-green-900/50 text-green-400" :"hover:bg-gray-100 text-gray-500")}><Edit2 className="w-4 h-4" /></button>
 <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }} className={cn("p-1 rounded-md", state.isStarkTheme ?"hover:bg-red-900/50 text-red-500" :"hover:bg-red-50 text-red-500")}><Trash2 className="w-4 h-4" /></button>
 </div>
 
 {editingFolderId === folder.id ? (
 <div className="w-full flex flex-col gap-2" onClick={e => e.stopPropagation()}>
 <input 
 autoFocus
 value={editName}
 onChange={e => setEditName(e.target.value)}
 onKeyDown={e => e.key ==='Enter' && handleRenameFolder(folder.id)}
 className={cn("w-full text-center text-sm p-1 rounded", state.isStarkTheme ?"bg-green-900/20 border-green-500 text-green-400 font-mono" :" border-gray-300")}
 />
 <div className="flex gap-1 justify-center">
 <button onClick={() => handleRenameFolder(folder.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
 <button onClick={() => setEditingFolderId(null)} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
 </div>
 </div>
 ) : (
 <div onClick={() => setCurrentFolderId(folder.id)} className="flex flex-col items-center w-full">
 <Folder className={cn("w-12 h-12 mb-2", state.isStarkTheme ?"text-green-500" :"text-amber-400 fill-amber-100")} />
 <span className={cn("font-bold text-sm text-center w-full truncate px-2", state.isStarkTheme ?"text-green-400 font-mono" :"text-gray-800")}>{folder.name}</span>
 </div>
 )}
 </div>
 ))}

 {files.map(file => (
 <div key={file.id} className={cn("p-4 rounded-2xl flex flex-col items-center gap-2 relative group cursor-pointer transition-transform hover:scale-105", 
 state.isStarkTheme ?"bg-black border-green-500/30 hover:-green-500" :"bg-white hover:"
 )}>
 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
 <button onClick={(e) => { e.stopPropagation(); setEditingFileId(file.id); setEditName(file.name); }} className={cn("p-1 rounded-md", state.isStarkTheme ?"hover:bg-green-900/50 text-green-400" :"hover:bg-gray-100 text-gray-500")}><Edit2 className="w-4 h-4" /></button>
 <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }} className={cn("p-1 rounded-md", state.isStarkTheme ?"hover:bg-red-900/50 text-red-500" :"hover:bg-red-50 text-red-500")}><Trash2 className="w-4 h-4" /></button>
 </div>

 {editingFileId === file.id ? (
 <div className="w-full flex flex-col gap-2" onClick={e => e.stopPropagation()}>
 <input 
 autoFocus
 value={editName}
 onChange={e => setEditName(e.target.value)}
 onKeyDown={e => e.key ==='Enter' && handleRenameFile(file.id)}
 className={cn("w-full text-center text-sm p-1 rounded", state.isStarkTheme ?"bg-green-900/20 border-green-500 text-green-400 font-mono" :" border-gray-300")}
 />
 <div className="flex gap-1 justify-center">
 <button onClick={() => handleRenameFile(file.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Save</button>
 <button onClick={() => setEditingFileId(null)} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
 </div>
 </div>
 ) : (
 <div onClick={() => openPreview(file)} className="flex flex-col items-center w-full">
 {getFileIcon(file.type, file.name)}
 <span className={cn("font-bold text-sm text-center w-full truncate px-2 mt-2", state.isStarkTheme ?"text-green-400 font-mono" :"text-gray-800")}>{file.name}</span>
 <span className={cn("text-[10px]", state.isStarkTheme ?"text-green-600/70 font-mono" :"text-gray-400")}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
 </div>
 )}
 </div>
 ))}

 {flashcardDecks.map(deck => (
 <div key={deck.id} className={cn("p-4 rounded-2xl flex flex-col items-center gap-2 relative group cursor-pointer transition-transform hover:scale-105", 
 state.isStarkTheme ?"bg-black border-green-500/30 hover:-green-500" :"bg-white border-pink-100 hover: hover:-pink-300"
 )}>
 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
 <button onClick={(e) => { e.stopPropagation(); setEditingDeckId(deck.id); }} className={cn("p-1 rounded-md", state.isStarkTheme ?"hover:bg-green-900/50 text-green-400" :"hover:bg-gray-100 text-gray-500")}><Edit2 className="w-4 h-4" /></button>
 <button onClick={(e) => { e.stopPropagation(); dispatch({ type:"DELETE_FLASHCARD_DECK", payload: deck.id }); }} className={cn("p-1 rounded-md", state.isStarkTheme ?"hover:bg-red-900/50 text-red-500" :"hover:bg-red-50 text-red-500")}><Trash2 className="w-4 h-4" /></button>
 </div>
 
 <div onClick={() => { setPlayingDeckId(deck.id); setCurrentCardIndex(0); setIsFlipped(false); }} className="flex flex-col items-center w-full">
 <Brain className={cn("w-12 h-12 mb-2", state.isStarkTheme ?"text-green-500" :"text-pink-500")} />
 <span className={cn("font-bold text-sm text-center w-full truncate px-2", state.isStarkTheme ?"text-green-400 font-mono" :"text-gray-800")}>{deck.name}</span>
 <span className={cn("text-[10px]", state.isStarkTheme ?"text-green-600/70 font-mono" :"text-gray-400")}>{deck.cards.length} cards</span>
 </div>
 </div>
 ))}

 {folders.length === 0 && files.length === 0 && flashcardDecks.length === 0 && (
 <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
 <Folder className={cn("w-16 h-16 mb-4 opacity-20", state.isStarkTheme ?"text-green-500" :"text-gray-400")} />
 <p className={cn("font-bold", state.isStarkTheme ?"text-green-500/50 font-mono uppercase" :"text-gray-400")}>This folder is empty</p>
 </div>
 )}
 </div>

 {/* Create Folder Modal */}
 <AnimatePresence>
 {isCreateFolderModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className={cn("w-full max-w-sm p-6 rounded-3xl shadow-2xl", state.isStarkTheme ?"bg-black border-green-500 font-mono" :"bg-white")}
 >
 <h3 className={cn("text-xl font-black mb-4", state.isStarkTheme ?"text-green-400" :"text-gray-800")}>New Folder</h3>
 <input 
 autoFocus
 value={newFolderName}
 onChange={e => setNewFolderName(e.target.value)}
 placeholder="Folder name..."
 className={cn("w-full p-3 rounded-xl mb-4 outline-none", 
 state.isStarkTheme ?"bg-green-900/20 border-green-500/50 text-green-400 placeholder:text-green-700 focus:-green-400" :"bg-gray-50 focus:-indigo-500"
 )}
 />
 <div className="flex gap-3">
 <button onClick={() => setIsCreateFolderModalOpen(false)} className={cn("flex-1 py-3 rounded-xl font-bold", state.isStarkTheme ?"text-green-500 hover:bg-green-900/30" :"text-gray-500 hover:bg-gray-100")}>Cancel</button>
 <button onClick={handleCreateFolder} className={cn("flex-1 py-3 rounded-xl font-bold", state.isStarkTheme ?"bg-green-500 text-black hover:bg-green-400" :"bg-indigo-600 text-white hover:bg-indigo-700")}>Create</button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Create Deck Modal */}
 <AnimatePresence>
 {isCreateDeckModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className={cn("w-full max-w-sm p-6 rounded-3xl shadow-2xl", state.isStarkTheme ?"bg-black border-green-500 font-mono" :"bg-white")}
 >
 <h3 className={cn("text-xl font-black mb-4", state.isStarkTheme ?"text-green-400" :"text-gray-800")}>New Flashcard Deck</h3>
 <input 
 autoFocus
 value={newDeckName}
 onChange={e => setNewDeckName(e.target.value)}
 placeholder="Deck name..."
 className={cn("w-full p-3 rounded-xl mb-4 outline-none", 
 state.isStarkTheme ?"bg-green-900/20 border-green-500/50 text-green-400 placeholder:text-green-700 focus:-green-400" :"bg-gray-50 focus:-pink-500"
 )}
 />
 <div className="flex gap-3">
 <button onClick={() => setIsCreateDeckModalOpen(false)} className={cn("flex-1 py-3 rounded-xl font-bold", state.isStarkTheme ?"text-green-500 hover:bg-green-900/30" :"text-gray-500 hover:bg-gray-100")}>Cancel</button>
 <button onClick={handleCreateDeck} className={cn("flex-1 py-3 rounded-xl font-bold", state.isStarkTheme ?"bg-green-500 text-black hover:bg-green-400" :"bg-pink-600 text-white hover:bg-pink-700")}>Create</button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Edit Deck Modal */}
 <AnimatePresence>
 {editingDeck && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className={cn("w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl", state.isStarkTheme ?"bg-black border-green-500 font-mono" :"bg-white")}
 >
 <div className={cn("p-4 flex justify-between items-center -b", state.isStarkTheme ?"border-green-500/30 bg-green-900/20" :"")}>
 <h3 className={cn("font-bold truncate pr-4", state.isStarkTheme ?"text-green-400" :"text-gray-800")}>Edit: {editingDeck.name}</h3>
 <button onClick={() => setEditingDeckId(null)} className={cn("p-2 rounded-full", state.isStarkTheme ?"hover:bg-green-500/20 text-green-500" :"hover:bg-gray-100 text-gray-500")}>
 <X className="w-6 h-6" />
 </button>
 </div>
 
 <div className="flex-1 overflow-auto p-4 space-y-4">
 {editingDeck.cards.map((card, index) => (
 <div key={card.id} className={cn("p-4 rounded-xl relative", state.isStarkTheme ?"bg-green-900/10 border-green-500/30" :"bg-gray-50")}>
 <button onClick={() => handleDeleteFlashcard(card.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-md"><Trash2 className="w-4 h-4" /></button>
 <div className="mb-2">
 <span className={cn("text-xs font-bold uppercase", state.isStarkTheme ?"text-green-600" :"text-gray-500")}>Q{index + 1}:</span>
 <p className={cn("font-medium", state.isStarkTheme ?"text-green-400" :"text-gray-800")}>{card.question}</p>
 </div>
 <div>
 <span className={cn("text-xs font-bold uppercase", state.isStarkTheme ?"text-green-600" :"text-gray-500")}>A{index + 1}:</span>
 <p className={cn("font-medium", state.isStarkTheme ?"text-green-300" :"text-gray-700")}>{card.answer}</p>
 </div>
 </div>
 ))}

 <div className={cn("p-4 rounded-xl -dashed", state.isStarkTheme ?"border-green-500/50" :"border-gray-300")}>
 <h4 className={cn("font-bold mb-3", state.isStarkTheme ?"text-green-400" :"text-gray-700")}>Add New Card</h4>
 <input 
 value={flashcardQuestion}
 onChange={e => setFlashcardQuestion(e.target.value)}
 placeholder="Question..."
 className={cn("w-full p-3 rounded-xl mb-3 outline-none", 
 state.isStarkTheme ?"bg-black border-green-500/50 text-green-400 placeholder:text-green-700 focus:-green-400" :"bg-white focus:-pink-500"
 )}
 />
 <textarea 
 value={flashcardAnswer}
 onChange={e => setFlashcardAnswer(e.target.value)}
 placeholder="Answer..."
 rows={3}
 className={cn("w-full p-3 rounded-xl mb-3 outline-none resize-none", 
 state.isStarkTheme ?"bg-black border-green-500/50 text-green-400 placeholder:text-green-700 focus:-green-400" :"bg-white focus:-pink-500"
 )}
 />
 <button 
 onClick={handleAddFlashcard}
 disabled={!flashcardQuestion.trim() || !flashcardAnswer.trim()}
 className={cn("w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2", 
 state.isStarkTheme 
 ?"bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 disabled:bg-green-900 disabled:text-green-500" 
 :"bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50 disabled:bg-gray-300"
 )}
 >
 <Plus className="w-5 h-5" /> Add Card
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Play Deck Modal */}
 <AnimatePresence>
 {playingDeck && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className={cn("w-full max-w-3xl flex flex-col", state.isStarkTheme ?"font-mono" :"")}
 >
 <div className="flex justify-between items-center mb-6">
 <h3 className={cn("text-2xl font-black", state.isStarkTheme ?"text-green-400" :"text-white")}>{playingDeck.name}</h3>
 <button onClick={() => setPlayingDeckId(null)} className={cn("p-2 rounded-full", state.isStarkTheme ?"hover:bg-green-500/20 text-green-500" :"hover:bg-white/20 text-white")}>
 <X className="w-8 h-8" />
 </button>
 </div>
 
 {playingDeck.cards.length === 0 ? (
 <div className={cn("p-12 text-center rounded-3xl", state.isStarkTheme ?"bg-black border-green-500 text-green-400" :"bg-white text-gray-800")}>
 <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
 <p className="font-bold text-xl">This deck is empty.</p>
 <p className="opacity-70 mt-2">Edit the deck to add some cards first.</p>
 </div>
 ) : (
 <div className="flex flex-col items-center">
 <div className="text-white/70 font-bold mb-4">
 Card {currentCardIndex + 1} of {playingDeck.cards.length}
 </div>
 
 <div 
 className="w-full aspect-video perspective-1000 cursor-pointer"
 onClick={() => setIsFlipped(!isFlipped)}
 >
 <motion.div
 className="w-full h-full relative preserve-3d transition-transform duration-500"
 animate={{ rotateX: isFlipped ? 180 : 0 }}
 >
 {/* Front (Question) */}
 <div className={cn("absolute inset-0 backface-hidden rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl", 
 state.isStarkTheme ?"bg-black border-green-500 shadow-[0_0_30px_rgba(0,255,65,0.2)]" :"bg-white border-pink-100"
 )}>
 <span className={cn("absolute top-6 left-6 font-black text-xl opacity-30", state.isStarkTheme ?"text-green-500" :"text-pink-500")}>Q</span>
 <h2 className={cn("text-3xl md:text-4xl font-black", state.isStarkTheme ?"text-green-400" :"text-gray-800")}>
 {playingDeck.cards[currentCardIndex].question}
 </h2>
 <p className={cn("absolute bottom-6 font-bold text-sm opacity-50", state.isStarkTheme ?"text-green-500" :"text-gray-400")}>Click to flip</p>
 </div>
 
 {/* Back (Answer) */}
 <div className={cn("absolute inset-0 backface-hidden rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl", 
 state.isStarkTheme ?"bg-green-900 border-green-400 shadow-[0_0_30px_rgba(0,255,65,0.4)]" :"bg-pink-50 border-pink-300"
 )} style={{ transform:"rotateX(180deg)" }}>
 <span className={cn("absolute top-6 left-6 font-black text-xl opacity-30", state.isStarkTheme ?"text-green-400" :"text-pink-500")}>A</span>
 <h2 className={cn("text-2xl md:text-3xl font-bold", state.isStarkTheme ?"text-green-300" :"text-gray-800")}>
 {playingDeck.cards[currentCardIndex].answer}
 </h2>
 </div>
 </motion.div>
 </div>
 
 <div className="flex gap-4 mt-8">
 <button 
 onClick={() => {
 setIsFlipped(false);
 setTimeout(() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1)), 150);
 }}
 disabled={currentCardIndex === 0}
 className={cn("p-4 rounded-full font-bold flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50", 
 state.isStarkTheme ?"bg-green-900 text-green-400 hover:bg-green-800" :"bg-white/20 text-white hover:bg-white/30"
 )}
 >
 <ChevronLeft className="w-8 h-8" />
 </button>
 <button 
 onClick={() => {
 setIsFlipped(false);
 setTimeout(() => setCurrentCardIndex(Math.min(playingDeck.cards.length - 1, currentCardIndex + 1)), 150);
 }}
 disabled={currentCardIndex === playingDeck.cards.length - 1}
 className={cn("p-4 rounded-full font-bold flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50", 
 state.isStarkTheme ?"bg-green-500 text-black hover:bg-green-400" :"bg-pink-500 text-white hover:bg-pink-400"
 )}
 >
 <ChevronRight className="w-8 h-8" />
 </button>
 </div>
 </div>
 )}
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* File Preview Modal */}
 <AnimatePresence>
 {previewFile && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 20 }}
 className={cn("w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl", state.isStarkTheme ?"bg-black border-green-500 font-mono" :"bg-white")}
 >
 <div className={cn("p-4 flex justify-between items-center -b", state.isStarkTheme ?"border-green-500/30 bg-green-900/20" :"")}>
 <h3 className={cn("font-bold truncate pr-4", state.isStarkTheme ?"text-green-400" :"text-gray-800")}>{previewFile.name}</h3>
 <button onClick={closePreview} className={cn("p-2 rounded-full", state.isStarkTheme ?"hover:bg-green-500/20 text-green-500" :"hover:bg-gray-100 text-gray-500")}>
 <X className="w-6 h-6" />
 </button>
 </div>
 
 <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[50vh] bg-gray-50/50 dark:bg-black/50">
 {isLoadingPreview ? (
 <div className={cn("animate-pulse font-bold", state.isStarkTheme ?"text-green-500" :"text-gray-400")}>Loading preview...</div>
 ) : (
 <>
 {previewFile.type.startsWith('image/') && previewUrl && (
 <img src={previewUrl} alt={previewFile.name} className="max-w-full max-h-full object-contain rounded-lg" />
 )}
 {previewFile.type.startsWith('video/') && previewUrl && (
 <video src={previewUrl} controls className="max-w-full max-h-full rounded-lg" />
 )}
 {previewText && (
 <div className={cn("w-full h-full text-left whitespace-pre-wrap p-6 rounded-xl overflow-auto", state.isStarkTheme ?"bg-green-900/10 text-green-400" :"bg-white text-gray-800")}>
 {previewText}
 </div>
 )}
 {!previewFile.type.startsWith('image/') && !previewFile.type.startsWith('video/') && !previewText && previewUrl && (
 <div className="flex flex-col items-center gap-4">
 <FileText className={cn("w-24 h-24", state.isStarkTheme ?"text-green-500/50" :"text-gray-300")} />
 <p className={cn("font-bold", state.isStarkTheme ?"text-green-400" :"text-gray-600")}>Preview not available for this file type.</p>
 <a 
 href={previewUrl} 
 download={previewFile.name}
 className={cn("px-6 py-3 rounded-xl font-bold flex items-center gap-2", state.isStarkTheme ?"bg-green-500 text-black hover:bg-green-400" :"bg-indigo-600 text-white hover:bg-indigo-700")}
 >
 <Upload className="w-5 h-5 rotate-180" /> Download File
 </a>
 </div>
 )}
 </>
 )}
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
}
