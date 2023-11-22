import database from "./data.js";

const carregarEmpreendimentos = () => {
  return database.getEntidade("empreendimentos");
};

export default {
  carregarEmpreendimentos,
};
