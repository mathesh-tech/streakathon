import { Trophy, Filter, Search, Award, Download, MoreVertical, Edit2, Ban } from "lucide-react";

export default function AdminLeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: "Siva Mathesh", rollNo: "732921IT112", department: "IT - C", streak: 12, points: 1450, trend: "up" },
    { rank: 2, name: "Priya Sharma", rollNo: "732921IT084", department: "IT - B", streak: 8, points: 1240, trend: "up" },
    { rank: 3, name: "Rahul Verma", rollNo: "732921IT091", department: "IT - B", streak: 5, points: 1120, trend: "down" },
    { rank: 4, name: "Ananya Patel", rollNo: "732921IT023", department: "IT - A", streak: 15, points: 1080, trend: "up" },
    { rank: 5, name: "Karthik Raj", rollNo: "732921IT056", department: "IT - A", streak: 3, points: 950, trend: "same" },
  ];

  return (
    <div className="flex-1 w-full p-4 md:p-8 space-y-8 max-w-screen-2xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-500">Leaderboard Management</h1>
          <p className="text-muted-foreground">Monitor rankings, adjust credits, and manage disputes.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors font-medium text-sm">
            <Download className="h-4 w-4 mr-2" /> Export Rankings
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by student name or roll no..." 
            className="w-full h-10 bg-background/50 border border-black/10 rounded-xl px-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="h-10 px-4 bg-background/50 border border-black/10 rounded-xl text-sm focus:outline-none">
            <option>All Sections</option>
            <option>IT - A</option>
            <option>IT - B</option>
            <option>IT - C</option>
          </select>
          <button className="h-10 px-4 bg-background/50 border border-black/10 rounded-xl flex items-center justify-center gap-2 hover:bg-black/5 transition-colors text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-black/5 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Rank</th>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Section</th>
                <th className="px-6 py-4 font-semibold text-center">Active Streak</th>
                <th className="px-6 py-4 font-semibold text-right">Total Points</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboardData.map((student, i) => (
                <tr key={i} className="hover:bg-black/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        student.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                        student.rank === 2 ? 'bg-gray-300/20 text-gray-300' : 
                        student.rank === 3 ? 'bg-orange-500/20 text-orange-500' : 'text-muted-foreground'
                      }`}>
                        #{student.rank}
                      </span>
                      {student.rank <= 3 && <Trophy className={`w-4 h-4 ${
                        student.rank === 1 ? 'text-yellow-500' : 
                        student.rank === 2 ? 'text-gray-300' : 'text-orange-500'
                      }`} />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.rollNo}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{student.department}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
                      🔥 {student.streak}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                    {student.points.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-indigo-500/20 text-indigo-400 rounded-md transition-colors" title="Edit Points">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-destructive/20 text-destructive rounded-md transition-colors" title="Disqualify/Ban">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
