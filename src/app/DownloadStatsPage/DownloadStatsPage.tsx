import client;

export default function DownloadStatsPage() {
  const handleDownload = () => {
    const statsRaw = localStorage.getItem("modshop_nudge_stats");
    if (!statsRaw) {
      alert("No stats found in localStorage.");
      return;
    }

    const stats = JSON.parse(statsRaw);

    const rows = [
      ["Nudge Type", "Shown", "Accepted/Completed"]
    ];

    rows.push(["gentle", stats.gentle.shown, stats.gentle.accepted]);
    rows.push(["alternative", stats.alternative.shown, stats.alternative.accepted]);
    rows.push(["block", stats.block.shown, stats.block.completed]);

    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "nudge_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Download Nudge Stats</h1>
      <p className="mb-6 text-gray-600">
        Export your local nudge stats (from <code>localStorage</code>) to a CSV file.
      </p>
      <button
        onClick={handleDownload}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Download CSV
      </button>
    </div>
  );
}
