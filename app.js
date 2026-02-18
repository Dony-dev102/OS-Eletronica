document.addEventListener("DOMContentLoaded", function () {

  const numero = document.getElementById("numero");
  const valorTotal = document.getElementById("valorTotal");
  const status = document.getElementById("status");
  const data = document.getElementById("data");
  data.value = new Date().toISOString().split("T")[0];

  const maoObraSpan = document.getElementById("maoObra");
  const comissaoSpan = document.getElementById("comissao");
  const lista = document.getElementById("lista");

  const dataInicio = document.getElementById("dataInicio");
  const dataFim = document.getElementById("dataFim");
  const btnCalcular = document.getElementById("btnCalcular");
  const lucroTotal = document.getElementById("lucroTotal");

  const btnSalvar = document.getElementById("salvar");
  const checkPecas = document.querySelectorAll(".checkPeca");

  function formatar(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function obterOS() {
    return JSON.parse(localStorage.getItem("ordensServico")) || [];
  }

  function salvarOS(lista) {
    localStorage.setItem("ordensServico", JSON.stringify(lista));
  }

  function calcular() {
    let total = parseFloat(valorTotal.value) || 0;
    let totalPecas = 0;

    checkPecas.forEach(check => {
      const input = check.parentElement.parentElement.querySelector(".valorPeca");
      if (check.checked) {
        totalPecas += parseFloat(input.value) || 0;
      }
    });

    let maoObra = total - totalPecas;
    let comissao = maoObra * 0.33;

    maoObraSpan.textContent = formatar(maoObra);
    comissaoSpan.textContent = formatar(comissao);
  }

  valorTotal.addEventListener("input", calcular);

  checkPecas.forEach(check => {
    const input = check.parentElement.parentElement.querySelector(".valorPeca");

    check.addEventListener("change", function () {
      input.disabled = !check.checked;
      if (!check.checked) input.value = "";
      calcular();
    });

    input.addEventListener("input", calcular);
  });

  btnSalvar.addEventListener("click", function () {
    if (!numero.value || !valorTotal.value) {
      alert("Preencha número da OS e valor total.");
      return;
    }

    let total = parseFloat(valorTotal.value);
    let totalPecas = 0;
    let listaPecas = [];

    checkPecas.forEach(check => {
      const input = check.parentElement.parentElement.querySelector(".valorPeca");
      if (check.checked) {
        let valor = parseFloat(input.value) || 0;
        totalPecas += valor;
        listaPecas.push({
          nome: check.getAttribute("data-nome"),
          valor: valor
        });
      }
    });

    let maoObra = total - totalPecas;
       let comissao = maoObra * 0.33; 
       // let comissao = maoObra * 0.05; // versão 5% (comentada)
       //let comissao = maoObra * 0.40; // versão 40% ativa

    const novaOS = {
      numero: numero.value,
      valorTotal: total,
      pecas: totalPecas,
      pecasDetalhadas: listaPecas,
      maoObra,
      comissao,
      status: status.value,
      data: data.value
    };

    const listaOS = obterOS();
    listaOS.push(novaOS);
    salvarOS(listaOS);

    listar();

    numero.value = "";
    valorTotal.value = "";
    checkPecas.forEach(c => {
      c.checked = false;
      const inp = c.parentElement.parentElement.querySelector(".valorPeca");
      inp.value = "";
      inp.disabled = true;
    });
    calcular();
  });

  function listar(filtro = "todos") {
    lista.innerHTML = "";
    obterOS().forEach(os => {
      if (filtro !== "todos" && os.status !== filtro) return;

      const div = document.createElement("div");
      div.className = "card";

      // Define classe de destaque conforme status
      let classeOS = "";
      if (os.status === "finalizada") {
        classeOS = "os-finalizada";
      } else {
        classeOS = "os-pendente";
      }

      div.innerHTML = `
        <strong class="${classeOS}">OS ${os.numero}</strong><br>
        Status: ${os.status}<br>
        Total: ${formatar(os.valorTotal)}<br>
        Peças: ${formatar(os.pecas)}<br>
        Mão de Obra: ${formatar(os.maoObra)}<br>
        Comissão: ${formatar(os.comissao)}<br>
        Data: ${os.data}<br><br>

        <strong>Peças Utilizadas:</strong><br>
        ${os.pecasDetalhadas.length > 0
          ? os.pecasDetalhadas.map(p => `- ${p.nome} (${formatar(p.valor)})`).join("<br>")
          : "Nenhuma peça"}
        <br><br>

        <button onclick="editarOS('${os.numero}')">Editar</button>
        <button onclick="excluirOS('${os.numero}')">Excluir</button>
      `;

      window.excluirOS = function(numeroOS) {
        let listaOS = obterOS().filter(os => os.numero !== numeroOS);
        salvarOS(listaOS);
        listar();
      };

      window.editarOS = function(numeroOS) {
        let listaOS = obterOS();
        let os = listaOS.find(o => o.numero === numeroOS);

        numero.value = os.numero;
        valorTotal.value = os.valorTotal;
        status.value = os.status;
        data.value = os.data;

        // Reset peças
        checkPecas.forEach(check => {
          check.checked = false;
          const inp = check.parentElement.parentElement.querySelector(".valorPeca");
          inp.value = "";
          inp.disabled = true;
        });

        // Reaplicar peças salvas
        os.pecasDetalhadas.forEach(p => {
          checkPecas.forEach(check => {
            if (check.getAttribute("data-nome") === p.nome) {
              check.checked = true;
              const inp = check.parentElement.parentElement.querySelector(".valorPeca");
              inp.disabled = false;
              inp.value = p.valor;
            }
          });
        });

        // Remove antiga antes de salvar novamente
        listaOS = listaOS.filter(o => o.numero !== numeroOS);
        salvarOS(listaOS);

        calcular();
      };

      lista.appendChild(div);
    });
  }

  document.getElementById("buscarStatus").addEventListener("click", function() {
    const filtro = document.getElementById("filtroStatus").value;
    listar(filtro);
  });

  btnCalcular.addEventListener("click", function () {
    if (!dataInicio.value || !dataFim.value) {
      alert("Selecione as datas.");
      return;
    }

    const inicio = new Date(dataInicio.value);
    const fim = new Date(dataFim.value);

    let total = 0;
    obterOS().forEach(os => {
      let dataOS = new Date(os.data);
      if (os.status === "finalizada" && dataOS >= inicio && dataOS <= fim) {
        total += os.comissao;
      }
    });

    lucroTotal.textContent = "Lucro Técnico: " + formatar(total);
  });

  listar();

});
