# Frontend (Angular)

Projeto frontend em Angular. Este README contém instruções rápidas para desenvolver e executar o frontend localmente e descreve as integrações/rotas esperadas pelo backend.

Prerequisitos
- Node.js (recomendo >= 18)
- npm (ou yarn)

Instalação

1. Instale dependências:

```powershell
npm install
```

2. Rodar em modo de desenvolvimento (watch / live reload):

```powershell
npm start
# ou
ng serve
```

Abra o navegador em http://localhost:4200/.

Principais rotas da aplicação (frontend)
- /login — tela de autenticação
- /register — cadastro de usuário
- /list-os — listagem de Ordens de Serviço (é a página após login)
- /dashboard — área protegida (se usada)

API esperada (backend)
- O frontend espera um backend disponível em: http://localhost:3000 (padrão usado nas services). Ajuste se necessário.
- Endpoint de login: POST /auth/login — retorna { access_token, user }
- Endpoint de registro: POST /user/register
- Endpoint de ordens: GET /orders/{userId} — deve retornar um array de objetos com { id, title, createdAt }

Token / autenticação
- Após login, o token é salvo em localStorage com a chave `auth_token` e o objeto `user` é salvo como string JSON em `user`.
- Existe um HttpInterceptor (`src/app/interceptors/auth.interceptor.ts`) que adiciona `Authorization: Bearer <token>` nas requisições e trata respostas 401 (limpa sessão e redireciona para /login).

Onde ajustar a URL da API
- Se você usa outra URL base, atualize `apiUrl` nos serviços:
	- `src/app/services/auth.ts` (login/register)
	- `src/app/services/orders.ts` (getOrders)

Recursos implementados
- Angular Material usado para layout e controles (toolbars, icons, buttons, table, spinner).
- Header com nome do usuário e botão logout (aparece somente quando autenticado).
- Listagem de Ordens (`/list-os`) implementada com `MatTable`. Cabeçalho aparece sempre; se não houver dados a tabela mostra "Nenhuma ordem encontrada.".
- Interceptor para anexar token e tratar 401 (logout + redirect).

Desenvolvimento e debugging
- Para ver erros de TypeScript/compilação em tempo real use `ng serve`.
- A task `npm start` está configurada para rodar a aplicação em modo desenvolvimento (veja package.json se precisar ajustar).

Testes
- Unit tests: `ng test` (se configurado)
- E2E: `ng e2e` (se configurado)

Notas rápidas
- O componente `Header` é standalone e está em `src/app/header`.
- A listagem MatTable está em `src/app/pages/list-os`.
- Caso precise persistir tokens de forma diferente (cookies, secure storage), adapte `AuthService` e o interceptor.

Se quiser, eu atualizo este README com instruções específicas de deploy (por exemplo build para `/dist`) ou com variáveis de ambiente para configurar a URL do backend.
