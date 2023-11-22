const nomeBanco = "aqua-database.json";

const lerArquivoJson = async (filePath) => {
  return fetch(filePath)
    .then((res) => res.json())
    .then((dados) => dados);
};

const salvarAlteracoesEntidade = (nomeEntidade, dados) => {
  const allData = JSON.parse(localStorage.getItem(nomeBanco));
  allData[nomeEntidade] = dados;
  localStorage.setItem(nomeBanco, JSON.stringify(allData));
};

const carregarBanco = async () => {
  if (localStorage.getItem(nomeBanco) === null) {
    const dados = await lerArquivoJson("../database/" + nomeBanco);
    localStorage.setItem(nomeBanco, JSON.stringify(dados));
  }
};

const getEntidade = (nomeEntidade) => {
  const dados = JSON.parse(localStorage.getItem(nomeBanco));
  return dados[nomeEntidade];
};

export default {
  salvarAlteracoesEntidade,
  carregarBanco,
  getEntidade,
};
