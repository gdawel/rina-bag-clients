import React from 'react';
import { CheckCircle, UserPlus } from 'lucide-react';

interface SuccessModalProps {
  isEdit?: boolean;
  onClose: () => void;
  onNewUser?: () => void;
}

export default function SuccessModal({ isEdit = false, onClose, onNewUser }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {isEdit ? 'Cadastro Atualizado!' : 'Cadastro Realizado!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {isEdit 
              ? 'Os dados foram atualizados com sucesso.' 
              : 'O cadastro foi salvo com sucesso no sistema.'
            }
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}