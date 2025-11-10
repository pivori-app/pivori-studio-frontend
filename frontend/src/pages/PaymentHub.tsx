import React, { useState } from 'react';
import {
  CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  Clock, X, Plus, Filter, Download, Eye, EyeOff, RefreshCw,
  ArrowUpRight, ArrowDownLeft, Zap
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'charge' | 'refund';
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expiryDate: string;
  isDefault: boolean;
}

const PaymentHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'methods' | 'invoices'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [hideBalance, setHideBalance] = useState(false);

  // Données de transactions
  const transactions: Transaction[] = [
    { id: 'TXN001', date: '2025-11-10', customer: 'Jean Dupont', amount: 1250.00, method: 'Carte Visa', status: 'completed', type: 'charge' },
    { id: 'TXN002', date: '2025-11-10', customer: 'Marie Martin', amount: 850.50, method: 'Carte Mastercard', status: 'completed', type: 'charge' },
    { id: 'TXN003', date: '2025-11-09', customer: 'Pierre Bernard', amount: 500.00, method: 'Virement', status: 'pending', type: 'charge' },
    { id: 'TXN004', date: '2025-11-09', customer: 'Sophie Laurent', amount: 200.00, method: 'Carte Visa', status: 'refunded', type: 'refund' },
    { id: 'TXN005', date: '2025-11-08', customer: 'Luc Moreau', amount: 1500.00, method: 'Carte Amex', status: 'completed', type: 'charge' },
    { id: 'TXN006', date: '2025-11-08', customer: 'Claire Dubois', amount: 750.00, method: 'PayPal', status: 'failed', type: 'charge' },
  ];

  // Méthodes de paiement
  const paymentMethods: PaymentMethod[] = [
    { id: 'PM001', type: 'Carte Visa', last4: '4242', brand: 'Visa', expiryDate: '12/26', isDefault: true },
    { id: 'PM002', type: 'Carte Mastercard', last4: '5555', brand: 'Mastercard', expiryDate: '08/25', isDefault: false },
    { id: 'PM003', type: 'Compte Bancaire', last4: '1234', brand: 'Bank', expiryDate: 'N/A', isDefault: false },
  ];

  // Factures
  const invoices = [
    { id: 'INV001', date: '2025-11-10', customer: 'Client A', amount: 5000.00, status: 'paid', dueDate: '2025-11-15' },
    { id: 'INV002', date: '2025-11-09', customer: 'Client B', amount: 3500.00, status: 'pending', dueDate: '2025-11-20' },
    { id: 'INV003', date: '2025-11-08', customer: 'Client C', amount: 2200.00, status: 'overdue', dueDate: '2025-11-05' },
  ];

  // Statistiques
  const stats = [
    { label: 'Revenu Aujourd\'hui', value: hideBalance ? '••••' : '€2,100.50', icon: <DollarSign className="w-6 h-6" />, color: 'bg-green-500' },
    { label: 'Transactions', value: hideBalance ? '••••' : '6', icon: <CreditCard className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Taux de Réussite', value: hideBalance ? '••••' : '83.3%', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-purple-500' },
    { label: 'En Attente', value: hideBalance ? '••••' : '€500.00', icon: <Clock className="w-6 h-6" />, color: 'bg-orange-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredTransactions = filterStatus === 'all'
    ? transactions
    : transactions.filter(t => t.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Payment Hub</h1>
          <p className="text-slate-600 mt-2">Gestion complète de vos paiements et transactions</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition"
          >
            {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {hideBalance ? 'Afficher' : 'Masquer'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Nouveau Paiement
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'overview', label: 'Aperçu' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'methods', label: 'Méthodes de Paiement' },
            { id: 'invoices', label: 'Factures' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-medium transition ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
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
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Transactions Récentes</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 4).map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${txn.type === 'charge' ? 'bg-red-100' : 'bg-green-100'}`}>
                            {txn.type === 'charge' ? (
                              <ArrowUpRight className={`w-4 h-4 ${txn.type === 'charge' ? 'text-red-600' : 'text-green-600'}`} />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{txn.customer}</p>
                            <p className="text-sm text-slate-600">{txn.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${txn.type === 'charge' ? 'text-red-600' : 'text-green-600'}`}>
                            {txn.type === 'charge' ? '-' : '+'}€{txn.amount.toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(txn.status)}`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Méthodes de paiement actives */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Méthodes de Paiement</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition border-2 border-transparent hover:border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{method.brand} •••• {method.last4}</p>
                            <p className="text-sm text-slate-600">Expire {method.expiryDate}</p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
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
              <div className="flex gap-4 mb-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="completed">Complétées</option>
                  <option value="pending">En attente</option>
                  <option value="failed">Échouées</option>
                  <option value="refunded">Remboursées</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:border-slate-400 transition">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Date</th>
                      <th className="text-right py-3 px-4 text-slate-900 font-semibold">Montant</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Méthode</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Statut</th>
                      <th className="text-center py-3 px-4 text-slate-900 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-4 text-slate-700 font-mono text-sm">{txn.id}</td>
                        <td className="py-3 px-4 text-slate-900">{txn.customer}</td>
                        <td className="py-3 px-4 text-slate-600">{txn.date}</td>
                        <td className="text-right py-3 px-4 text-slate-900 font-semibold">€{txn.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-700">{txn.method}</td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(txn.status)}`}>
                            {getStatusIcon(txn.status)}
                            {txn.status}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Détails</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Méthodes de paiement */}
          {activeTab === 'methods' && (
            <div className="space-y-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Plus className="w-4 h-4" />
                Ajouter une Méthode
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex gap-2">
                      {method.isDefault && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <div className="mb-8">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-mono tracking-widest mb-4">•••• •••• •••• {method.last4}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm opacity-75">Titulaire</p>
                        <p className="font-semibold">{method.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-75">Expire</p>
                        <p className="font-semibold">{method.expiryDate}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-white text-slate-900 rounded text-sm font-medium hover:bg-slate-100 transition">
                        Modifier
                      </button>
                      <button className="flex-1 px-3 py-2 border border-white text-white rounded text-sm font-medium hover:bg-white hover:text-slate-900 transition">
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Factures */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Facture</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Échéance</th>
                      <th className="text-right py-3 px-4 text-slate-900 font-semibold">Montant</th>
                      <th className="text-left py-3 px-4 text-slate-900 font-semibold">Statut</th>
                      <th className="text-center py-3 px-4 text-slate-900 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-4 text-slate-700 font-mono text-sm">{inv.id}</td>
                        <td className="py-3 px-4 text-slate-900">{inv.customer}</td>
                        <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                        <td className="py-3 px-4 text-slate-600">{inv.dueDate}</td>
                        <td className="text-right py-3 px-4 text-slate-900 font-semibold">€{inv.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(inv.status)}`}>
                            {getStatusIcon(inv.status)}
                            {inv.status}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Télécharger</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHub;

