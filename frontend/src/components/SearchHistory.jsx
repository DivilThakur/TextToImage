import React, { useState, useEffect } from 'react';
import { History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function SearchHistory({ onSelectHistory, isOpen, onClose }) {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        // Load search history from localStorage
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(history);
    }, [isOpen]);

    const clearHistory = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling
        localStorage.removeItem('searchHistory');
        setSearchHistory([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg z-50"
                >
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Search History</h3>
                            <button
                                onClick={clearHistory}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Clear All
                            </button>
                        </div>
                        
                        {searchHistory.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No search history</p>
                        ) : (
                            <div className="max-h-60 overflow-y-auto">
                                {searchHistory.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer group"
                                        onClick={() => onSelectHistory(item)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <History className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700">{item}</span>
                                        </div>
                                        <X 
                                            className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newHistory = searchHistory.filter((_, i) => i !== index);
                                                localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                                                setSearchHistory(newHistory);
                                            }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SearchHistory; 