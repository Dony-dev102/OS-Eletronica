# Sistema de Ordem de Serviço (OS)

Sistema web para gerenciamento de Ordens de Serviço,
permitindo cadastro, 
edição,
cálculo de Mão de Obra,
Comissão, controle de peças e filtro por status.  

Desenvolvido com **HTML**, 
**CSS** 
e **JavaScript** puro, 
utilizando **LocalStorage** para persistência dos dados.

---

## 🛠 Funcionalidades

- Cadastro de nova OS com:
  - Número da OS
  - Valor Total
  - Status (Orçamento, Aprovado, Aguardando Peça, Pintando, Pronto, Finalizada)
  - Seleção de peças utilizadas com valores
  - Cálculo automático de Mão de Obra (`Valor Total - Peças`)
  - Cálculo automático de Comissão (% sobre Mão de Obra)

- Lista de OS cadastradas, com:
  - Destaque visual de OS **Finalizadas** (verde) e **Pendentes** (laranja)
  - Detalhes de peças utilizadas
  - Botões para **Editar** e **Excluir**

- Filtro por status:
  - Todos
  - Aprovado
  - Finalizada
  - Pendente (mapeia Orçamento, Aguardando Peça, Pintando e Pronto)

- Lucro técnico por período:
  - Calcula a soma das comissões das OS finalizadas entre duas datas selecionadas

- Responsivo, funciona em desktop e mobile

---

## 📁 Estrutura do Projeto
/projeto-os/
│
├─ index.html # Página principal
├─ style.css # Estilo do sistema
├─ app.js # Lógica de funcionamento
└─ /background/ # Pasta para imagem de fundo (opcional)
└─ background.jpg
    
    
    
    💻 Tecnologias

HTML5

CSS3

JavaScript (ES6+)

LocalStorage

⚠️ Observações

Este sistema não possui backend, então os dados são salvos localmente no navegador.

O filtro “Pendente” considera automaticamente as OS com status: Orçamento, Aguardando Peça, Pintando ou Pronto.

Compatível com navegadores modernos; alguns recursos de CSS podem não funcionar em versões muito antigas.
