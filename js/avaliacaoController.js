import database from "./data.js";

const carregarAvaliacao = (idEmpreendimento, idCategoria) => {
  const dadosAvaliacao = database.getEntidade("avaliacao");
  return dadosAvaliacao?.filter(
    ({ categorias_analise_id, empreendimento_id }) =>
      categorias_analise_id === idCategoria &&
      empreendimento_id === idEmpreendimento
  );
};

const calcularAvaliacao = (idEmpreendimento, idCategoria) => {
  const avaliacao = carregarAvaliacao(idEmpreendimento, idCategoria);

  const avaliacaoNivelB = avaliacao.filter(
    ({ resultado_char }) => resultado_char === "B"
  );

  const somaPontos = avaliacao.reduce((acc, cur) => {
    return cur.resultado_numerico ? acc + cur.resultado_numerico : acc;
  }, 0);

  const hitNivelB = avaliacaoNivelB.length === 4;
  const hitNivelBP = hitNivelB && somaPontos >= 1;
  const hitNivelMP = hitNivelB && somaPontos >= 3;

  return {
    nivelB: hitNivelB ? "Atingido" : "Não atingido",
    nivelBP: hitNivelBP ? "Atingido" : "Não atingido",
    nivelMP: hitNivelMP ? "Atingido" : "Não atingido",
  };
};

const registrarAvaliacao = (idEmpreendimento, idCategoria, avaliacoes) => {
  let novasAvaliacoes = [];
  let proximoIdSum = 1;

  const dadosAvaliacao = database.getEntidade("avaliacao");
  const dadosCriterios = database.getEntidade("criterios");

  const arrAvaliacoes = dadosAvaliacao?.filter(
    ({ categorias_analise_id, empreendimento_id }) =>
      categorias_analise_id !== idCategoria &&
      empreendimento_id !== idEmpreendimento
  );

  const criterios = dadosCriterios?.filter(
    ({ categorias_analise_id }) => categorias_analise_id === idCategoria
  );

  avaliacoes.forEach((idCriterio) => {
    let valor;
    let proximoId = 0;
    const result = criterios.find(({ id }) => id === idCriterio);
    valor = result["nivel"] || result["pontos"];

    if (arrAvaliacoes.length > 0) {
      proximoId = arrAvaliacoes[arrAvaliacoes.length - 1]["id"] + proximoIdSum;
    } else {
      proximoId = proximoIdSum;
    }

    const novaAvaliacao = {
      id: proximoId,
      empreendimento_id: idEmpreendimento,
      categorias_analise_id: idCategoria,
      criterio_id: idCriterio,
      resultado_numerico: null,
      resultado_char: null,
      data_avaliacao: new Date().toISOString().slice(0, 10),
    };

    if (result["nivel"]) {
      valor = result["nivel"];
      novaAvaliacao.resultado_char = result["nivel"];
    } else {
      novaAvaliacao.resultado_numerico = result["pontos"];
    }

    novasAvaliacoes.push(novaAvaliacao);
    proximoIdSum++;
  });

  arrAvaliacoes.push(...novasAvaliacoes);

  database.salvarAlteracoesEntidade("avaliacao", arrAvaliacoes);
};

export default {
  registrarAvaliacao,
  carregarAvaliacao,
  calcularAvaliacao,
};
