import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import ConfirmationModal from './components/ConfirmationModal';
import SuccessModal from './components/SuccessModal';
import AdminPanel from './components/AdminPanel';
import { User } from './types/User';
import { UserService } from './services/userService';

type AppState = 'form' | 'confirmation' | 'success' | 'admin';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [userData, setUserData] = useState<User | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Check if user already exists when CPF is entered
  const checkExistingUser = async (cpf: string): Promise<User | null> => {
    try {
      const cleanCPF = cpf.replace(/\D/g, '');
      if (cleanCPF.length === 11) {
        return await UserService.getUserByCPF(cpf);
      }
      return null;
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return null;
    }
  };

  const handleFormSubmit = (user: User) => {
    setUserData(user);
    setCurrentState('confirmation');
    setError('');
  };

  const handleConfirmSave = async () => {
    if (!userData) return;

    setIsLoading(true);
    setError('');
    
    try {
      const result = await UserService.saveUser(userData);
      console.log(result.message);
      setCurrentState('success');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro inesperado ao salvar usuário');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setCurrentState('form');
    setError('');
  };

  const handleSuccessClose = () => {
    setCurrentState('form');
    setUserData(null);
    setIsEdit(false);
    setError('');
  };

  const handleNewUser = () => {
    setCurrentState('form');
    setUserData(null);
    setIsEdit(false);
    setError('');
  };

  // Check if we're on the admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentState('admin');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-center">
            <div className="mb-4">
              <img 
                src="/logo.png" 
                alt="Bazar da Rina Logo" 
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-pink-700">Bazar da Rina</h1>
            <p className="text-lg text-pink-600">Cadastro/Atualização de Clientes</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentState === 'admin' ? (
          <AdminPanel />
        ) : (
          <UserForm 
            onSubmit={handleFormSubmit}
            initialData={userData || undefined}
            isEdit={isEdit}
          />
        )}

        {/* Confirmation Modal */}
        {currentState === 'confirmation' && userData && (
          <ConfirmationModal
            user={userData}
            onConfirm={handleConfirmSave}
            onCancel={handleCancelConfirmation}
            isLoading={isLoading}
          />
        )}

        {/* Success Modal */}
        {currentState === 'success' && (
          <SuccessModal
            isEdit={isEdit}
            onClose={handleSuccessClose}
            onNewUser={handleNewUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;