export function normalizeCost(aiCostAnalysis) {
  if (!aiCostAnalysis) return null;

  const input =
    aiCostAnalysis?.input_tokens ??
    aiCostAnalysis?.prompt_tokens ??
    aiCostAnalysis?.tokens_in ??
    aiCostAnalysis?.promptTokens ??
    aiCostAnalysis?.inputTokens ??
    0;

  const output =
    aiCostAnalysis?.output_tokens ??
    aiCostAnalysis?.completion_tokens ??
    aiCostAnalysis?.tokens_out ??
    aiCostAnalysis?.completionTokens ??
    aiCostAnalysis?.outputTokens ??
    0;

  const total =
    aiCostAnalysis?.total_tokens ??
    aiCostAnalysis?.totalTokens ??
    aiCostAnalysis?.tokens_total ??
    aiCostAnalysis?.tokens ??
    0;

  const costUSD =
    aiCostAnalysis?.total_cost_usd ??
    aiCostAnalysis?.cost_usd ??
    aiCostAnalysis?.total_cost ??
    aiCostAnalysis?.costUSD ??
    aiCostAnalysis?.usd ??
    0;

  const model =
    aiCostAnalysis?.model ??
    aiCostAnalysis?.llm ??
    aiCostAnalysis?.model_name ??
    aiCostAnalysis?.modelName ??
    null;

  const tokensIn = Number(input || 0);
  const tokensOut = Number(output || 0);
  const totalTokens = Number(total || 0);

  return { tokensIn, tokensOut, totalTokens, costUSD: Number(costUSD || 0), model: model ? String(model) : null };
}

export function estimateCostUSD({ tokensIn = 0, tokensOut = 0 }) {
  const inRate = 0.0000005;
  const outRate = 0.0000015;
  return tokensIn * inRate + tokensOut * outRate;
}
