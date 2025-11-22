import React, { useState, useEffect } from 'react';
import { User } from '../types/User';
import { Users, Shield, FileSpreadsheet, Eye } from 'lucide-react';
import { UserService } from '../services/userService';
import { exportToExcel } from '../utils/excelExport';
import UserViewModal from './UserViewModal';

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários. Verifique se o Supabase está configurado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      const users = await UserService.exportUsers();
      exportToExcel(users);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setError('Erro ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">Bazar da Rina - Gestão de Cadastros</p>
          </div>
        </div>

        <button
          onClick={handleExportToExcel}
          disabled={isExporting || users.length === 0}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exportando...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              Exportar CSV
            </>
          )}
        </button>
      </div>

      {/* View Modal */}
      {selectedUser && (
        <UserViewModal
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Usuários Cadastrados ({users.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando usuários...</p>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Nenhum usuário cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">E-mail</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{user.cpf}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{user.nomeCompleto}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.telefone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{user.cidade}, {user.estado}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}