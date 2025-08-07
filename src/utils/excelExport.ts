import { User } from '../types/User';

export const exportToExcel = (users: User[]) => {
  // Prepare data for Excel
  const excelData = users.map(user => ({
    'CPF': user.cpf,
    'Nome Completo': user.nomeCompleto,
    'Telefone': user.telefone,
    'E-mail': user.email,
    'CEP': user.cep,
    'Logradouro': user.logradouro,
    'Número': user.numero,
    'Complemento': user.complemento || '',
    'Bairro': user.bairro,
    'Cidade': user.cidade,
    'Estado': user.estado,
    'Data de Cadastro': user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '',
    'Última Atualização': user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : ''
  }));

  // Convert to CSV format (simple Excel-compatible export)
  const headers = Object.keys(excelData[0] || {});
  const csvContent = [
    headers.join(','),
    ...excelData.map(row => 
      headers.map(header => {
        const value = row[header as keyof typeof row];
        // Escape commas and quotes in CSV
        return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `cadastros-bazar-rina-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};