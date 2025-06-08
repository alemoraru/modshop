'use client';

import React from 'react';

const NudgeExportPage = () => {
  const handleExport = () => {
    const stored = localStorage.getItem('modshop_nudge_stats');
    if (!stored) {
      alert('No nudge data found.');
      return;
    }

    const stats = JSON.parse(stored);

    const headers = ['Nudge Type', 'Shown', 'Accepted/Completed', 'Savings ($)'];
    const rows = [
      ['gentle', stats.gentle.shown, stats.gentle.accepted, stats.gentle.savings.toFixed(2)],
      ['alternative', stats.alternative.shown, stats.alternative.accepted, stats.alternative.savings.toFixed(2)],
      ['block', stats.block.shown, stats.block.completed, stats.block.savings.toFixed(2)]
    ];

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nudge_stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Export Nudge Stats</h1>
      <p className="mb-6 text-gray-600">Click below to download your current nudge stats as a CSV file.</p>
      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200"
      >
        Download CSV
      </button>
    </main>
  );
};

export default NudgeExportPage;
