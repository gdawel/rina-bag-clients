import React from 'react';
import { User } from '../types/User';
import { X, User as UserIcon, MapPin, Phone, Mail, Calendar, Hash } from 'lucide-react';
import { brazilianStates } from '../data/states';

interface UserViewModalProps {
  user: User;
  onClose: () => void;
}

export default function UserViewModal({ user, onClose }: UserViewModalProps) {
  const getStateName = (uf: string) => {
    const state = brazilianStates.find(s => s.value === uf);
    return state ? state.label : uf;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalhes do Cliente</h2>
              <p className="text-gray-600">Informações completas do cadastro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* System Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Informações do Sistema</h3>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ID do Sistema</p>
                  <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data de Cadastro</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Última Atualização</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Data */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
            </div>
            <div className="bg-pink-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="text-gray-900 font-semibold">{user.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                  <p className="text-gray-900 font-semibold">{user.nomeCompleto}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Telefone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{user.telefone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">E-mail</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h3>
            </div>
            <div className="bg-green-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">CEP</p>
                  <p className="text-gray-900 font-semibold">{user.cep}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Logradouro</p>
                  <p className="text-gray-900">{user.logradouro}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Número</p>
                  <p className="text-gray-900">{user.numero}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Complemento</p>
                  <p className="text-gray-900">{user.complemento || 'Não informado'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bairro</p>
                  <p className="text-gray-900">{user.bairro}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cidade</p>
                  <p className="text-gray-900">{user.cidade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <p className="text-gray-900">{getStateName(user.estado)} ({user.estado})</p>
                </div>
              </div>
              
              {/* Complete Address */}
              <div className="pt-3 border-t border-green-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Endereço Completo</p>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-gray-900">
                    {user.logradouro}, {user.numero}
                    {user.complemento && `, ${user.complemento}`}
                    <br />
                    {user.bairro} - {user.cidade}/{user.estado}
                    <br />
                    CEP: {user.cep}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}