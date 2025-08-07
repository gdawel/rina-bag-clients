import React from 'react';
import { User } from '../types/User';
import { CheckCircle, User as UserIcon, MapPin, Phone, Mail } from 'lucide-react';
import { brazilianStates } from '../data/states';

interface ConfirmationModalProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmationModal({ user, onConfirm, onCancel, isLoading = false }: ConfirmationModalProps) {
  const getStateName = (uf: string) => {
    const state = brazilianStates.find(s => s.value === uf);
    return state ? state.label : uf;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Confirmar Cadastro</h2>
              <p className="text-gray-600">Verifique os dados antes de salvar</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Dados Pessoais */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="text-gray-900">{user.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                  <p className="text-gray-900">{user.nomeCompleto}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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

          {/* Endereço */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">CEP</p>
                  <p className="text-gray-900">{user.cep}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Logradouro</p>
                  <p className="text-gray-900">{user.logradouro}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Número</p>
                  <p className="text-gray-900">{user.numero}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Complemento</p>
                  <p className="text-gray-900">{user.complemento || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  <p className="text-gray-900">{getStateName(user.estado)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Voltar e Editar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirmar e Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}