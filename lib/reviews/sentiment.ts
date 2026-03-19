export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  positiveScore: number;
  negativeScore: number;
  neutralScore: number;
  confidence: number;
  keyPhrases: string[];
}

const POSITIVE_WORDS: Record<string, number> = {
  excellent: 3,
  amazing: 3,
  outstanding: 3,
  fantastic: 3,
  exceptional: 3,
  brilliant: 3,
  wonderful: 3,
  perfect: 3,
  love: 3,
  loves: 3,
  loved: 3,
  awesome: 2.5,
  great: 2,
  good: 1,
  nice: 1,
  helpful: 1.5,
  intuitive: 2,
  easy: 2,
  easy_to_use: 2,
  user_friendly: 2,
  efficient: 2,
  fast: 1.5,
  reliable: 2,
  solid: 2,
  recommend: 2,
  recommended: 2,
  useful: 1.5,
  valuable: 2,
  powerful: 2,
  smooth: 1.5,
  seamless: 2,
  clean: 1.5,
  modern: 1.5,
  beautiful: 1.5,
  impressive: 2,
  satisfied: 2,
  happy: 2,
  pleased: 2,
  excellent_customer_service: 3,
  responsive: 1.5,
  professional: 1.5,
  organized: 1.5,
  comprehensive: 1.5,
  customizable: 1.5,
  integrate: 1,
  integrates: 1,
  integration: 1,
  affordable: 2,
  value: 1.5,
  worth: 1.5,
  save_time: 2,
  time_saving: 2,
  productivity: 1.5,
  automation: 1.5,
  automate: 1.5,
  stable: 1.5,
  scalable: 1.5,
  lightweight: 1,
  decent: 1,
  fair: 1,
  flexible: 1.5,
  best: 2.5,
  better: 2,
  improved: 1.5,
  enhance: 1.5,
  enhanced: 1.5,
  great_value: 2,
  highly_recommend: 3,
  five_stars: 3,
  five_star: 3,
  top_notch: 3,
  exceeded: 2,
  exceeds: 2,
  delightful: 2,
  robust: 1.5,
  consistent: 1.5,
  clear: 1,
  straightforward: 1.5,
  simple: 1.5,
  functional: 1,
  effective: 1.5,
  well_designed: 2,
  innovative: 2,
  game_changer: 3,
  game_changing: 3,
  must_have: 2.5,
  time_saver: 2,
};

const NEGATIVE_WORDS: Record<string, number> = {
  terrible: -3,
  horrible: -3,
  awful: -3,
  worst: -3,
  hate: -3,
  hates: -3,
  hated: -3,
  useless: -3,
  garbage: -3,
  trash: -3,
  broken: -2.5,
  buggy: -2.5,
  bugs: -2,
  crash: -2.5,
  crashes: -2.5,
  crashing: -2.5,
  slow: -1.5,
  sluggish: -2,
  expensive: -2,
  overpriced: -2.5,
  costly: -2,
  hidden_fees: -3,
  hidden_cost: -3,
  hidden_pricing: -3,
  unexpected_cost: -2.5,
  bait_and_switch: -3,
  confusing: -2,
  complicated: -2,
  complex: -2,
  difficult: -1.5,
  hard_to_use: -2,
  unintuitive: -2,
  overwhelming: -1.5,
  cluttered: -1.5,
  messy: -1.5,
  poor: -2,
  bad: -1.5,
  worse: -2,
  failing: -2,
  fails: -2,
  failed: -2,
  failure: -2,
  disappointment: -2,
  disappointing: -2,
  disappointed: -2,
  waste: -2,
  waste_of_time: -2.5,
  waste_of_money: -3,
  unreliable: -2.5,
  unstable: -2,
  glitchy: -2,
  laggy: -1.5,
  outdated: -1.5,
  old: -1,
  limited: -1.5,
  restrictive: -1.5,
  lacking: -1.5,
  lacks: -1.5,
  missing: -1,
  incomplete: -1.5,
  insufficient: -1.5,
  support_issues: -2,
  poor_support: -2.5,
  no_support: -3,
  unresponsive: -2,
  slow_support: -2,
  bad_support: -2.5,
  support_team: -1,
  support: -1,
  onboarding: -1,
  slow_onboarding: -2,
  difficult_onboarding: -2,
  steep_learning_curve: -2,
  learning_curve: -1.5,
  no_documentation: -2.5,
  poor_documentation: -2,
  lacks_documentation: -2,
  documentation: -0.5,
  no_tutorials: -2,
  confusing_ui: -2,
  bad_ui: -2,
  ugly: -1,
  slow_performance: -2,
  performance_issues: -2,
  performance: -1,
  loading_time: -1.5,
  load_time: -1.5,
  downtime: -2.5,
  outage: -2.5,
  outages: -2.5,
  crashed: -2.5,
  corrupts: -2.5,
  data_loss: -3,
  loses_data: -3,
  lost_data: -3,
  error: -2,
  errors: -2,
  error_prone: -2,
  glitch: -2,
  glitches: -2,
  issues: -1,
  problem: -1.5,
  problems: -1.5,
  problematically: -1.5,
  issue: -1,
  headache: -2,
  frustration: -2,
  frustrating: -2,
  frustrated: -2,
  annoying: -2,
  annoys: -2,
  rage: -2.5,
  rage_quit: -3,
  refund: -2,
  cancelled: -2,
  cancel: -2,
  cancellation: -2,
  scam: -3,
  fraudulent: -3,
  dishonest: -3,
  not_worth: -2,
  rip_off: -3,
  no_value: -2.5,
};

const NEGATION_WORDS = new Set([
  "not", "no", "never", "neither", "nobody", "nothing", "nowhere",
  "hardly", "barely", "scarcely", "seldom", "rarely", "without",
  "lack", "lacking", "none", "isn't", "wasn't", "weren't", "don't",
  "doesn't", "didn't", "won't", "wouldn't", "shouldn't", "couldn't",
  "can't", "cannot", "couldn't", "hasn't", "haven't", "hadn't",
  "aint", "ain't", "wasnt", "werent", "dont", "doesnt", "didnt",
  "wont", "wouldnt", "shouldnt", "couldnt", "cant", "cannot",
  "hasnt", "havent", "hadnt", "never", "nor",
]);

const INTENSIFIERS: Record<string, number> = {
  very: 1.5,
  extremely: 1.8,
  incredibly: 1.8,
  absolutely: 1.7,
  totally: 1.5,
  completely: 1.7,
  highly: 1.5,
  super: 1.5,
  really: 1.3,
  quite: 1.2,
  rather: 1.1,
  somewhat: 0.8,
  slightly: 0.6,
  barely: 0.4,
  kind_of: 0.7,
  sort_of: 0.7,
  type_of: 0.6,
  a_bit: 0.7,
  a_little: 0.7,
  too: 1.2,
  so: 1.3,
  most: 1.6,
  especially: 1.4,
  particularly: 1.3,
  remarkably: 1.5,
  unusually: 1.5,
  overly: 1.3,
  too_much: 1.4,
};

const COMPARISON_WORDS = new Set([
  "better", "worse", "best", "worst", "compared", "comparison",
  "opposed", "versus", "vs", "prefer", "preferable", "alternative",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 0);
}

function cleanText(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/@\w+/g, "")
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function analyzeWithLexicon(text: string): {
  positiveScore: number;
  negativeScore: number;
  keyPhrases: string[];
  tokens: string[];
} {
  const cleaned = cleanText(text);
  const tokens = tokenize(cleaned);
  const words = [...tokens];
  const bigrams: string[] = [];
  const trigrams: string[] = [];

  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]}_${words[i + 1]}`);
  }
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.push(`${words[i]}_${words[i + 1]}_${words[i + 2]}`);
  }

  let positiveScore = 0;
  let negativeScore = 0;
  const keyPhrases: string[] = [];
  const allTokens = [...trigrams, ...bigrams, ...words];

  for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];

    let modifier = 1;
    let negationCount = 0;

    const windowSize = Math.min(4, i);
    for (let j = i - 1; j >= Math.max(0, i - windowSize); j--) {
      const prevToken = words[j];
      if (NEGATION_WORDS.has(prevToken)) {
        negationCount++;
      }
      if (INTENSIFIERS[prevToken]) {
        modifier *= INTENSIFIERS[prevToken];
      }
    }

    if (POSITIVE_WORDS[token]) {
      let score = POSITIVE_WORDS[token] * modifier;
      if (negationCount > 0 && negationCount % 2 !== 0) {
        score = -score * 0.7;
      }
      if (score > 0) positiveScore += score;
      else negativeScore += Math.abs(score);
      if (Math.abs(score) >= 2) keyPhrases.push(token.replace(/_/g, " "));
    }

    if (NEGATIVE_WORDS[token]) {
      let score = NEGATIVE_WORDS[token] * modifier;
      if (negationCount > 0 && negationCount % 2 !== 0) {
        score = -score * 0.7;
      }
      if (score < 0) negativeScore += Math.abs(score);
      else positiveScore += score;
      if (Math.abs(score) >= 1.5) keyPhrases.push(token.replace(/_/g, " "));
    }
  }

  return { positiveScore, negativeScore, keyPhrases, tokens };
}

export function analyzeSentiment(text: string, starRating?: number): SentimentResult {
  const { positiveScore, negativeScore, keyPhrases } = analyzeWithLexicon(text);

  let ratingInfluence = 0;
  if (starRating !== undefined) {
    const normalized = (starRating - 3) / 2;
    ratingInfluence = normalized * 1.5;
  }

  const adjustedPositive = positiveScore + Math.max(0, ratingInfluence);
  const adjustedNegative = negativeScore + Math.max(0, -ratingInfluence);

  const total = adjustedPositive + adjustedNegative;

  let neutralScore = 0;
  if (total === 0) {
    neutralScore = 1;
  } else {
    const ratio = Math.min(adjustedPositive, adjustedNegative) / Math.max(adjustedPositive, adjustedNegative);
    neutralScore = ratio * 0.5;
  }

  let sentiment: "positive" | "negative" | "neutral";
  let score: number;
  let confidence: number;

  const maxScore = Math.max(adjustedPositive, adjustedNegative, neutralScore);

  if (maxScore === adjustedPositive && adjustedPositive > adjustedNegative * 0.5) {
    sentiment = "positive";
    score = (adjustedPositive - adjustedNegative) / Math.max(total, 1);
    confidence = Math.min(1, adjustedPositive / Math.max(total, 1));
  } else if (maxScore === adjustedNegative && adjustedNegative > adjustedPositive * 0.5) {
    sentiment = "negative";
    score = (adjustedNegative - adjustedPositive) / Math.max(total, 1);
    confidence = Math.min(1, adjustedNegative / Math.max(total, 1));
  } else {
    sentiment = "neutral";
    score = 0;
    confidence = neutralScore;
  }

  score = Math.max(-1, Math.min(1, score));

  return {
    sentiment,
    score,
    positiveScore: adjustedPositive,
    negativeScore: adjustedNegative,
    neutralScore,
    confidence: Math.max(0.3, confidence),
    keyPhrases: [...new Set(keyPhrases)].slice(0, 10),
  };
}

export function getReviewSeverity(text: string, sentiment: "positive" | "negative" | "neutral"): number {
  if (sentiment !== "negative") return 0;

  const result = analyzeWithLexicon(text);
  const severity = Math.min(10, result.negativeScore * 2);

  const strongNegative = ["terrible", "horrible", "awful", "worst", "garbage", "useless", "scam"].some(
    w => text.toLowerCase().includes(w)
  );
  if (strongNegative) return Math.max(severity, 7);

  return Math.max(1, Math.round(severity));
}
