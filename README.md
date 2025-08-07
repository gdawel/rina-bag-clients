# Bazar da Rina - Sistema de Cadastro

Sistema de cadastro de clientes para o Bazar da Rina com validação de CPF, busca automática de endereço por CEP e painel administrativo.

## Funcionalidades

- ✅ Cadastro de clientes com validação de CPF
- ✅ Busca automática de endereço via CEP (ViaCEP)
- ✅ Prevenção de CPF e email duplicados
- ✅ Painel administrativo para visualizar cadastros
- ✅ Exportação de dados para CSV
- ✅ Interface responsiva e moderna
- ✅ Banco de dados Supabase (PostgreSQL)

## Configuração

### 1. Configurar Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para Settings > API e copie:
   - Project URL
   - Anon public key

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Executar as Migrações

As migrações SQL estão em `supabase/migrations/`. Execute-as no SQL Editor do Supabase:

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o conteúdo do arquivo `supabase/migrations/create_users_table.sql`

## Como executar localmente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (veja acima)

3. Execute o projeto:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## Deployment

### Frontend (Netlify/Vercel)

1. Faça build do projeto:
```bash
npm run build
```

2. Configure as variáveis de ambiente no serviço de deploy:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. Faça deploy da pasta `dist`

## Acesso ao Painel Admin

Acesse `/admin` na URL do site para visualizar o painel administrativo.

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── lib/                # Configuração do Supabase
├── services/           # Serviços de dados
├── types/              # Definições de tipos TypeScript
├── utils/              # Utilitários (validação, formatação)
├── data/               # Dados estáticos
└── App.tsx             # Componente principal

supabase/
└── migrations/         # Migrações SQL
```

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL)
- **Validações**: CPF, Email, CEP
- **APIs**: ViaCEP para busca de endereços

## Funcionalidades do Banco de Dados

- **Tabela users**: Armazena todos os dados dos clientes
- **Constraints**: CPF e email únicos
- **RLS**: Row Level Security habilitado
- **Triggers**: Atualização automática de `updated_at`
- **Indexes**: Otimização para consultas por CPF e email