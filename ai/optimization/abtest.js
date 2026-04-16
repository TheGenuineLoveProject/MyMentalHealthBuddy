function chooseVariant(promptId, variants = ["A", "B"]) {
  const index = Math.floor(Math.random() * variants.length);
  return {
    promptId,
    variant: variants[index]
  };
}

module.exports = { chooseVariant };
