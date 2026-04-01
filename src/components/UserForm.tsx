import React, { useState, useEffect } from 'react';
import { User } from '../types/User';
import { validateCPF, formatCPF, formatPhone, formatCEP } from '../utils/cpfValidator';
import { searchCEP } from '../services/cepService';
import { brazilianStates } from '../data/states';
import { UserCheck, MapPin, Loader2 } from 'lucide-react';

interface UserFormProps {
  onSubmit: (user: User) => void;
  initialData?: User;
  isEdit?: boolean;
}

export default function UserForm({ onSubmit, initialData, isEdit = false }: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    cpf: '',
    nomeCompleto: '',
    telefone: '',
    email: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formatação conforme o campo
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCEPBlur = async () => {
    const cleanCEP = formData.cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      setIsLoadingCEP(true);
      const cepData = await searchCEP(cleanCEP);
      
      if (cepData) {
        setFormData(prev => ({
          ...prev,
          logradouro: cepData.logradouro,
          bairro: cepData.bairro,
          cidade: cepData.localidade,
          estado: cepData.uf
        }));
        setErrors(prev => ({ ...prev, cep: '' }));
      } else {
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
      }
      setIsLoadingCEP(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-pink-100 rounded-lg">
          <UserCheck className="w-6 h-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Atualizar Cadastro' : 'Dados para Emissão da Nota Fiscal'}
          </h1>
          <p className="text-gray-600">Bazar da Rina</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                maxLength={14}
                disabled={isEdit}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.cpf ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${
                  isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.nomeCompleto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                placeholder="Digite o nome completo"
              />
              {errors.nomeCompleto && <p className="text-red-600 text-sm mt-1">{errors.nomeCompleto}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  maxLength={15}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.telefone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                  placeholder="(11) 99999-9999"
                />
                {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCEPBlur}
                  maxLength={9}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.cep ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                  placeholder="00000-000"
                />
                {isLoadingCEP && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-600 animate-spin" />
                )}
              </div>
              {errors.cep && <p className="text-red-600 text-sm mt-1">{errors.cep}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logradouro *
              </label>
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.logradouro ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                placeholder="Rua, Avenida, etc."
              />
              {errors.logradouro && <p className="text-red-600 text-sm mt-1">{errors.logradouro}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.numero ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                placeholder="123"
              />
              {errors.numero && <p className="text-red-600 text-sm mt-1">{errors.numero}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complemento
              </label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder="Apto, Casa, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro *
              </label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.bairro ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                placeholder="Nome do bairro"
              />
              {errors.bairro && <p className="text-red-600 text-sm mt-1">{errors.bairro}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.cidade ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                placeholder="Nome da cidade"
              />
              {errors.cidade && <p className="text-red-600 text-sm mt-1">{errors.cidade}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.estado ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
              >
                <option value="">Selecione o estado</option>
                {brazilianStates.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
              {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado}</p>}
            </div>
          </div>
        </div>

        {/* Botão Submit */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
          >
            {isEdit ? 'Atualizar Cadastro' : 'Prosseguir para Confirmação'}
          </button>
        </div>
      </form>
    </div>
  );
}