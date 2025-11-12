import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Users, DollarSign, ShoppingCart, Eye, Clock,
  Download, Filter, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'users', 'conversions']);

  // Données de revenus
  const revenueData: ChartDataPoint[] = [
    { name: 'Jan', revenue: 4000, target: 5000 },
    { name: 'Fév', revenue: 5200, target: 5000 },
    { name: 'Mar', revenue: 4800, target: 5000 },
    { name: 'Avr', revenue: 6100, target: 5500 },
    { name: 'Mai', revenue: 7200, target: 6000 },
    { name: 'Juin', revenue: 8100, target: 6500 },
  ];

  // Données d'utilisateurs
  const userGrowthData: ChartDataPoint[] = [
    { name: 'Semaine 1', nouveaux: 120, actifs: 2400 },
    { name: 'Semaine 2', nouveaux: 180, actifs: 2800 },
    { name: 'Semaine 3', nouveaux: 150, actifs: 3200 },
    { name: 'Semaine 4', nouveaux: 220, actifs: 3800 },
  ];

  // Données de conversion
  const conversionData: ChartDataPoint[] = [
    { name: 'Visite', value: 8500 },
    { name: 'Panier', value: 3200 },
    { name: 'Paiement', value: 1800 },
    { name: 'Confirmé', value: 1450 },
  ];

  // Données géographiques
  const geoData: ChartDataPoint[] = [
    { name: 'France', value: 35 },
    { name: 'Europe', value: 28 },
    { name: 'Amérique', value: 22 },
    { name: 'Asie', value: 15 },
  ];

  // Données de trafic par source
  const trafficSourceData: ChartDataPoint[] = [
    { name: 'Organique', value: 45 },
    { name: 'Direct', value: 25 },
    { name: 'Référent', value: 18 },
    { name: 'Publicité', value: 12 },
  ];

  // Cartes de métriques
  const metrics: MetricCard[] = [
    {
      title: 'Revenu Total',
      value: '€35,240',
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-white0',
    },
    {
      title: 'Utilisateurs Actifs',
      value: '3,842',
      change: 8.2,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-white0',
    },
    {
      title: 'Taux de Conversion',
      value: '17.05%',
      change: 3.1,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-white0',
    },
    {
      title: 'Vues de Page',
      value: '128,450',
      change: -2.4,
      icon: <Eye className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-2">Analyse complète de vos performances</p>
        </div>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Cartes de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className={`${metric.color} p-3 rounded-lg text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span className="text-sm font-semibold">{Math.abs(metric.change)}%</span>
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">{metric.title}</h3>
            <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenu */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Revenu vs Cible</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Croissance utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Croissance des Utilisateurs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="nouveaux" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="actifs" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Entonnoir de conversion */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Entonnoir de Conversion</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={conversionData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={180} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution géographique */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Distribution Géographique</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={geoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {geoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Source de trafic */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Source de Trafic</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau de synthèse */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Résumé Mensuel</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-slate-900 font-semibold">Métrique</th>
                <th className="text-right py-3 px-4 text-slate-900 font-semibold">Valeur</th>
                <th className="text-right py-3 px-4 text-slate-900 font-semibold">Mois Précédent</th>
                <th className="text-right py-3 px-4 text-slate-900 font-semibold">Variation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Revenu Total', value: '€35,240', prev: '€31,450', change: '+12.0%' },
                { metric: 'Commandes', value: '1,245', prev: '1,120', change: '+11.2%' },
                { metric: 'Panier Moyen', value: '€28.30', prev: '€28.05', change: '+0.9%' },
                { metric: 'Taux Rebond', value: '32.5%', prev: '35.2%', change: '-7.7%' },
                { metric: 'Durée Session', value: '3m 45s', prev: '3m 20s', change: '+12.6%' },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-700">{row.metric}</td>
                  <td className="text-right py-3 px-4 text-slate-900 font-semibold">{row.value}</td>
                  <td className="text-right py-3 px-4 text-slate-600">{row.prev}</td>
                  <td className={`text-right py-3 px-4 font-semibold ${row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {row.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

