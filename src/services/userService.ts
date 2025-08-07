import { supabase } from '../lib/supabase';
import { User } from '../types/User';

export class UserService {
  // Get all users
  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Erro ao buscar usuários');
    }

    return data.map(user => ({
      ...user,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));
  }

  // Get user by CPF
  static async getUserByCPF(cpf: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('cpf', cpf)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching user by CPF:', error);
      throw new Error('Erro ao buscar usuário');
    }

    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // Create or update user
  static async saveUser(userData: User): Promise<{ message: string; id: string }> {
    try {
      // Check if user exists by CPF
      const existingUser = await this.getUserByCPF(userData.cpf);

      if (existingUser) {
        // Check if email is being used by another user
        const { data: emailCheck, error: emailError } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .neq('cpf', userData.cpf)
          .single();

        if (emailError && emailError.code !== 'PGRST116') {
          throw new Error('Erro ao verificar e-mail');
        }

        if (emailCheck) {
          throw new Error('Este e-mail já está sendo usado por outro usuário');
        }

        // Update existing user
        const { data, error } = await supabase
          .from('users')
          .update({
            nomeCompleto: userData.nomeCompleto,
            telefone: userData.telefone,
            email: userData.email,
            cep: userData.cep,
            logradouro: userData.logradouro,
            numero: userData.numero,
            complemento: userData.complemento || '',
            bairro: userData.bairro,
            cidade: userData.cidade,
            estado: userData.estado
          })
          .eq('cpf', userData.cpf)
          .select()
          .single();

        if (error) {
          if (error.code === '23505' && error.message.includes('email')) {
            throw new Error('Este e-mail já está sendo usado por outro usuário');
          }
          throw new Error('Erro ao atualizar usuário');
        }

        return { message: 'Usuário atualizado com sucesso', id: data.id };
      } else {
        // Check if email already exists
        const { data: emailCheck, error: emailError } = await supabase
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .single();

        if (emailError && emailError.code !== 'PGRST116') {
          throw new Error('Erro ao verificar e-mail');
        }

        if (emailCheck) {
          throw new Error('Este e-mail já está sendo usado por outro usuário');
        }

        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert({
            cpf: userData.cpf,
            nomeCompleto: userData.nomeCompleto,
            telefone: userData.telefone,
            email: userData.email,
            cep: userData.cep,
            logradouro: userData.logradouro,
            numero: userData.numero,
            complemento: userData.complemento || '',
            bairro: userData.bairro,
            cidade: userData.cidade,
            estado: userData.estado
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            if (error.message.includes('cpf')) {
              throw new Error('Este CPF já está cadastrado no sistema');
            } else if (error.message.includes('email')) {
              throw new Error('Este e-mail já está sendo usado por outro usuário');
            }
          }
          throw new Error('Erro ao cadastrar usuário');
        }

        return { message: 'Usuário cadastrado com sucesso', id: data.id };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro inesperado ao salvar usuário');
    }
  }

  // Export users data for Excel (simplified - returns raw data)
  static async exportUsers(): Promise<User[]> {
    return this.getAllUsers();
  }
}