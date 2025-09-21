import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { RotatingLines } from "react-loader-spinner";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ziva_score: '',
    anirudh_score: ''
  })

  // Sample data
  useEffect(() => {
    let savedMatches = []
    axios.get('https://fifabackend-production-28be.up.railway.app/fifa').then((res) => {
      savedMatches = res?.data || []
      setMatches(savedMatches)
      setLoading(false)
    }).catch((err) => {
      console.log('Error while get record', err)
      setLoading(false)
    })
  }, [])




  // Save to localStorage whenever matches change
  useEffect(() => {
    if (matches.length > 0) {
      localStorage.setItem('fifa-matches-react', JSON.stringify(matches))
    }
  }, [matches])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMatches = matches.length
    let totalGoals = 0
    const ziva = { wins: 0, draws: 0, losses: 0, goals: 0 }
    const anirudh = { wins: 0, draws: 0, losses: 0, goals: 0 }

    matches.forEach(match => {
      totalGoals += match.ziva_score + match.anirudh_score
      ziva.goals += match.ziva_score
      anirudh.goals += match.anirudh_score

      if (match.winner === 'Ziva') {
        ziva.wins++
        anirudh.losses++
      } else if (match.winner === 'Anirudh') {
        anirudh.wins++
        ziva.losses++
      } else {
        ziva.draws++
        anirudh.draws++
      }
    })

    const avgGoals = totalMatches ? (totalGoals / totalMatches).toFixed(1) : 0
    let currentLeader = 'Tie'
    if (ziva.wins > anirudh.wins) currentLeader = 'Ziva'
    else if (anirudh.wins > ziva.wins) currentLeader = 'Anirudh'

    return {
      totalMatches,
      totalGoals,
      avgGoals,
      currentLeader,
      ziva,
      anirudh
    }
  }, [matches])

  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(date)
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1)
    const pastDaysOfYear = (d - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    const ziva_score = parseInt(formData.ziva_score)
    const anirudh_score = parseInt(formData.anirudh_score)
    let winner
    if (ziva_score > anirudh_score) { winner = 'Ziva' }
    else if (anirudh_score > ziva_score) { winner = 'Anirudh' }
    else { winner = 'Draw' }
    const newMatch = {
      date: formData.date,
      ziva_score,
      anirudh_score,
      winner,
      week: getWeekNumber(new Date(formData.date)),
      matchNumber: matches.length + 1
    }
    setLoading(true)
    axios.post('https://fifabackend-production-28be.up.railway.app/fifaCreate', newMatch).then((res) => {
      setLoading(false)
    }).catch((err) => {
      console.log('Error while create record', err)
      setLoading(false)
    })
    setMatches(prev => [...prev, newMatch])
    setFormData(prev => ({ ...prev, ziva_score: '', anirudh_score: '' }))
  }

  // Chart data
  const barChartData = matches.map((match, index) => ({
    name: `Match ${index + 1}`,
    Ziva: match.ziva_score,
    Anirudh: match.anirudh_score
  }))

  const trendChartData = matches.reduce((acc, match, index) => {
    const totalMatches = index + 1
    const zivaWins = matches.slice(0, totalMatches).filter(m => m.winner === 'Ziva').length
    const anirudhWins = matches.slice(0, totalMatches).filter(m => m.winner === 'Anirudh').length

    acc.push({
      match: `Match ${totalMatches}`,
      ZivaWinRate: ((zivaWins / totalMatches) * 100).toFixed(1),
      AnirudhWinRate: ((anirudhWins / totalMatches) * 100).toFixed(1)
    })
    return acc
  }, [])

  const pieChartData = [
    { name: 'Ziva Wins', value: stats.ziva.wins, color: '#007AFF' },
    { name: 'Anirudh Wins', value: stats.anirudh.wins, color: '#34C759' },
    { name: 'Draws', value: stats.ziva.draws, color: '#8E8E93' }
  ]

  // Weekly summary
  const weeklyData = useMemo(() => {
    const weeks = {}
    matches.forEach(match => {
      if (!weeks[match.week]) {
        weeks[match.week] = { ziva: 0, anirudh: 0, draws: 0, matches: [] }
      }
      weeks[match.week].matches.push(match)
      if (match.winner === 'Ziva') weeks[match.week].ziva++
      else if (match.winner === 'Anirudh') weeks[match.week].anirudh++
      else weeks[match.week].draws++
    })
    return weeks
  }, [matches])

  return (
    <div className="min-h-screen bg-white">
      {loading ? (
        // 🔹 Loader Overlay
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <RotatingLines
            strokeColor="#09afe6ff"
            strokeWidth="5"
            animationDuration="0.50"
            width="96"
            visible={true}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <header className="text-center mb-16 pt-12">
            <h1 className="text-6xl font-bold mb-4 gradient-text">
              FIFA 24
            </h1>
            <p className="text-xl text-apple-text-secondary font-medium">
              Ziva vs Anirudh Championship
            </p>
          </header>

          {/* Match Entry Form */}
          <div className="apple-card p-8 mb-12 animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-apple-text">Add New Match</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-apple-text uppercase tracking-wider mb-2">
                  Match Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="apple-input"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-apple-text uppercase tracking-wider mb-2">
                    Ziva Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.ziva_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, ziva_score: e.target.value }))}
                    className="apple-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-apple-text uppercase tracking-wider mb-2">
                    Anirudh Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.anirudh_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, anirudh_score: e.target.value }))}
                    className="apple-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="apple-button w-full">
                Add Match
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Matches" value={stats.totalMatches} />
            <StatCard title="Total Goals" value={stats.totalGoals} />
            <StatCard title="Avg Goals/Match" value={stats.avgGoals} />
            <StatCard title="Current Leader" value={stats.currentLeader} />
          </div>

          {/* Player Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <PlayerCard
              name="Ziva"
              stats={stats.ziva}
              totalMatches={stats.totalMatches}
              isLeader={stats.currentLeader === 'Ziva'}
            />
            <PlayerCard
              name="Anirudh"
              stats={stats.anirudh}
              totalMatches={stats.totalMatches}
              isLeader={stats.currentLeader === 'Anirudh'}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <ChartCard title="Goals Per Match">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ziva" fill="#007AFF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Anirudh" fill="#34C759" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Performance Trend">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ZivaWinRate"
                    stroke="#007AFF"
                    strokeWidth={3}
                    dot={{ fill: '#007AFF', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="AnirudhWinRate"
                    stroke="#34C759"
                    strokeWidth={3}
                    dot={{ fill: '#34C759', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Win Distribution">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Weekly Summary */}
          <div className="apple-card p-8 mb-12">
            <h2 className="text-2xl font-semibold text-apple-text mb-8">Weekly Summary</h2>
            <div className="space-y-4">
              {Object.keys(weeklyData)
                .sort((a, b) => b - a)
                .map(week => {
                  const data = weeklyData[week]
                  let champion = 'Tie'
                  if (data.ziva > data.anirudh) champion = 'Ziva 🏆'
                  else if (data.anirudh > data.ziva) champion = 'Anirudh 🏆'

                  return (
                    <div key={week} className="bg-apple-surface rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Week {week}</h3>
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                          {champion}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <div className="text-2xl font-bold text-apple-blue">{data.ziva}</div>
                          <div className="text-sm text-apple-text-secondary font-medium uppercase tracking-wider">
                            Ziva Wins
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-apple-gray">{data.draws}</div>
                          <div className="text-sm text-apple-text-secondary font-medium uppercase tracking-wider">
                            Draws
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-apple-green">{data.anirudh}</div>
                          <div className="text-sm text-apple-text-secondary font-medium uppercase tracking-wider">
                            Anirudh Wins
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Match History */}
          <div className="apple-card p-8">
            <h2 className="text-2xl font-semibold text-apple-text mb-8">Match History</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {matches.slice().reverse().map((match, index) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 hover:bg-apple-surface rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-apple-text-secondary font-bold min-w-12">
                      #{match.matchNumber}
                    </div>
                    <div className="font-semibold text-lg">
                      {match.ziva_score} - {match.anirudh_score}
                    </div>
                    <div className="text-apple-text-secondary">
                      {new Date(match.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${match.winner === 'Ziva'
                      ? 'bg-blue-100 text-apple-blue'
                      : match.winner === 'Anirudh'
                        ? 'bg-green-100 text-apple-green'
                        : 'bg-gray-100 text-apple-gray'
                      }`}
                  >
                    {match.winner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}

// Stat Card Component
const StatCard = ({ title, value }) => (
  <div className="apple-card p-6 text-center animate-fade-in">
    <div className="text-3xl font-bold text-apple-blue mb-2">{value}</div>
    <div className="text-sm text-apple-text-secondary font-medium uppercase tracking-wider">
      {title}
    </div>
  </div>
)

// Player Card Component
const PlayerCard = ({ name, stats, totalMatches, isLeader }) => {
  const winRate = totalMatches ? ((stats.wins / totalMatches) * 100).toFixed(1) : 0

  return (
    <div className={`apple-card p-8 text-center animate-fade-in ${isLeader ? 'ring-2 ring-apple-green' : ''}`}>
      <div className="text-2xl font-bold mb-6">{name}</div>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <div className="text-xl font-bold text-apple-blue">{stats.wins}</div>
          <div className="text-xs text-apple-text-secondary font-medium uppercase tracking-wider">
            Wins
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-apple-gray">{stats.draws}</div>
          <div className="text-xs text-apple-text-secondary font-medium uppercase tracking-wider">
            Draws
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-red-500">{stats.losses}</div>
          <div className="text-xs text-apple-text-secondary font-medium uppercase tracking-wider">
            Losses
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-apple-green">{stats.goals}</div>
          <div className="text-xs text-apple-text-secondary font-medium uppercase tracking-wider">
            Goals
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-purple-600">{winRate}%</div>
          <div className="text-xs text-apple-text-secondary font-medium uppercase tracking-wider">
            Win Rate
          </div>
        </div>
      </div>
    </div>
  )
}

// Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="apple-card p-6 animate-fade-in">
    <h3 className="text-lg font-semibold text-apple-text mb-4">{title}</h3>
    {children}
  </div>
)


export default App
