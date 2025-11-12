import React, { useState } from 'react'
import {
  CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  Clock, Plus, Download, Eye, EyeOff,
  ArrowUpRight, ArrowDownLeft
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  customer: string
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  type: 'charge' | 'refund'
}

interface PaymentMethod {
  id: string
  type: string
  last4: string
  brand: string
  expiryDate: string
  isDefault: boolean
}

const PaymentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'methods' | 'invoices'>('overview')
  const [filterStatus, setFilterStatus] = useState('all')
  const [hideBalance, setHideBalance] = useState(false)

  // Données de transactions
  const transactions: Transaction[] = [
    { id: 'TXN001', date: '2025-11-10', customer: 'Jean Dupont', amount: 1250.00, method: 'Carte Visa', status: 'completed', type: 'charge' },
    { id: 'TXN002', date: '2025-11-10', customer: 'Marie Martin', amount: 850.50, method: 'Carte Mastercard', status: 'completed', type: 'charge' },
    { id: 'TXN003', date: '2025-11-09', customer: 'Pierre Bernard', amount: 500.00, method: 'Virement', status: 'pending', type: 'charge' },
    { id: 'TXN004', date: '2025-11-09', customer: 'Sophie Laurent', amount: 200.00, method: 'Carte Visa', status: 'refunded', type: 'refund' },
    { id: 'TXN005', date: '2025-11-08', customer: 'Luc Moreau', amount: 1500.00, method: 'Carte Amex', status: 'completed', type: 'charge' },
    { id: 'TXN006', date: '2025-11-08', customer: 'Claire Dubois', amount: 750.00, method: 'PayPal', status: 'failed', type: 'charge' },
  ]

  // Méthodes de paiement
  const paymentMethods: PaymentMethod[] = [
    { id: 'PM001', type: 'Carte Visa', last4: '4242', brand: 'Visa', expiryDate: '12/26', isDefault: true },
    { id: 'PM002', type: 'Carte Mastercard', last4: '5555', brand: 'Mastercard', expiryDate: '08/25', isDefault: false },
    { id: 'PM003', type: 'Compte Bancaire', last4: '1234', brand: 'Bank', expiryDate: 'N/A', isDefault: false },
  ]

  // Factures
  const invoices = [
    { id: 'INV001', date: '2025-11-10', customer: 'Client A', amount: 5000.00, status: 'paid', dueDate: '2025-11-15' },
    { id: 'INV002', date: '2025-11-09', customer: 'Client B', amount: 3500.00, status: 'pending', dueDate: '2025-11-20' },
    { id: 'INV003', date: '2025-11-08', customer: 'Client C', amount: 2200.00, status: 'overdue', dueDate: '2025-11-05' },
  ]

  // Statistiques
  const stats = [
    { label: 'Revenu Aujourd\'hui', value: hideBalance ? '••••' : '€2,100.50', icon: <DollarSign className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Transactions', value: hideBalance ? '••••' : '6', icon: <CreditCard className="w-6 h-6" />, color: 'bg-green-500' },
    { label: 'Taux de Réussite', value: hideBalance ? '••••' : '83.3%', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-purple-500' },
    { label: 'En Attente', value: hideBalance ? '••••' : '€500.00', icon: <Clock className="w-6 h-6" />, color: 'bg-orange-500' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'failed':
      case 'overdue':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'refunded':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const filteredTransactions = filterStatus === 'all'
    ? transactions
    : transactions.filter(t => t.status === filterStatus)

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Paiements
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Gestion complète de vos paiements et transactions
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                {hideBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                <span className="hidden sm:inline">{hideBalance ? 'Afficher' : 'Masquer'}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors whitespace-nowrap">
                <Plus size={20} />
                <span className="hidden sm:inline">Nouveau</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            {[
              { id: 'overview', label: 'Aperçu' },
              { id: 'transactions', label: 'Transactions' },
              { id: 'methods', label: 'Méthodes' },
              { id: 'invoices', label: 'Factures' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-6 py-4 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Aperçu */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Transactions récentes */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transactions Récentes</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 4).map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${txn.type === 'charge' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                              {txn.type === 'charge' ? (
                                <ArrowUpRight className={`w-4 h-4 ${txn.type === 'charge' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{txn.customer}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{txn.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${txn.type === 'charge' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                              {txn.type === 'charge' ? '-' : '+'}€{txn.amount.toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor(txn.status)}`}>
                              {txn.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Méthodes de paiement actives */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Méthodes de Paiement</h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-900">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{method.brand} •••• {method.last4}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Expire {method.expiryDate}</p>
                            </div>
                          </div>
                          {method.isDefault && (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full whitespace-nowrap">
                              Par défaut
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-700 transition"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="completed">Complétées</option>
                    <option value="pending">En attente</option>
                    <option value="failed">Échouées</option>
                    <option value="refunded">Remboursées</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition whitespace-nowrap">
                    <Download size={20} />
                    <span className="hidden sm:inline">Exporter</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">ID</th>
                        <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Client</th>
                        <th className="text-right py-3 px-4 text-gray-900 dark:text-white font-semibold">Montant</th>
                        <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold hidden sm:table-cell">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((txn) => (
                        <tr key={txn.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{txn.id}</td>
                          <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{txn.customer}</td>
                          <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-semibold">€{txn.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                              {getStatusIcon(txn.status)}
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Méthodes */}
            {activeTab === 'methods' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">{method.brand} •••• {method.last4}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expire {method.expiryDate}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Factures */}
            {activeTab === 'invoices' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Facture</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Client</th>
                      <th className="text-right py-3 px-4 text-gray-900 dark:text-white font-semibold">Montant</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold hidden sm:table-cell">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{invoice.id}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{invoice.customer}</td>
                        <td className="text-right py-3 px-4 text-gray-900 dark:text-white font-semibold">€{invoice.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentHub

