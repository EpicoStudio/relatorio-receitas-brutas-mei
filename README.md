# Relatório MEI

Aplicação web para gerar Relatório Mensal de Receitas Brutas para Microempreendedor Individual (MEI).

## ✅ Status do Projeto

- [x] Projeto Vite criado com React + TypeScript
- [x] Dependências instaladas (lucide-react, tailwindcss)
- [x] Componente com tipagem TypeScript corrigida
- [x] Tailwind CSS v4 configurado
- [ ] **PRÓXIMO PASSO: Deploy no Vercel**

## 🚀 Comandos para Continuar

### 1. Testar localmente (opcional)
```bash
npm run dev
```

### 2. Deploy no Vercel
```bash
npx vercel
```

Durante o deploy, responda:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → `N`
- **Project name?** → Enter (aceitar padrão)
- **Directory?** → Enter (aceitar `./`)
- **Override settings?** → `N`

Após o deploy, você receberá um URL como:
`https://relatorio-mei-xxxx.vercel.app`

### 3. Deploy de produção (após testar)
```bash
npx vercel --prod
```

## 📁 Estrutura do Projeto

```
relatorio-mei/
├── src/
│   ├── App.tsx          # Componente principal (tipado)
│   ├── index.css        # Tailwind CSS import
│   └── main.tsx         # Entry point
├── vite.config.ts       # Config Vite + Tailwind
├── package.json
└── README.md
```

## 🔧 Tecnologias

- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilos
- **Lucide React** - Ícones
- **Vercel** - Hospedagem gratuita
