module.exports = {
  // A propriedade bail setada como "true" significa se caso algum teste falhar, ele não vai continuar executando os seguintes.
  bail: true,
  coverageProvider: "v8",
  // A propriedade testMatch é para dizer qual o padrão dos arquivos de teste.
  testMatch: [
    // <rootDir> é uma váriavel global que representa a raiz do nosso projeto.
    "<rootDir>/src/**/*.spec.js"
  ]
}