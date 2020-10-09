module.exports = {
  importStatementFormatter: ({ importStatement }) => {
    importStatement = importStatement.replace(/;/, "")
    return importStatement
      .replace(/'/g, '"')
      .replace(/\.js"$/, '"')
  }
}
