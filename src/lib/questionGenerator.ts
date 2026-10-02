import type { ClassLevel, Term, QuizQuestion } from './supabase';

// Deterministic PRNG seeded by student ID + term + question index
// Ensures each student gets unique questions and no repeats
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function pickFromArray<T>(arr: T[], seed: string): T {
  const idx = Math.floor(seededRandom(seed) * arr.length);
  return arr[idx];
}

function shuffleOptions(options: string[], correct: string, seed: string): { options: string[]; correctPosition: number } {
  const shuffled = [...options];
  // Fisher-Yates with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctPosition = shuffled.indexOf(correct);
  return { options: shuffled, correctPosition };
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

// Nigerian primary math curriculum topics by class and term
interface TopicDef {
  topic: string;
  generator: (seed: string, classLevel: ClassLevel) => { question: string; options: string[]; correct: string; difficulty: string };
}

const classMaxNumbers: Record<ClassLevel, number> = {
  'Primary 1': 20,
  'Primary 2': 100,
  'Primary 3': 1000,
  'Primary 4': 10000,
  'Primary 5': 100000,
  'Primary 6': 1000000,
};

const classLevels: ClassLevel[] = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];

function getNum(classLevel: ClassLevel, seed: string, minVal: number = 1): number {
  const max = classMaxNumbers[classLevel];
  const val = Math.floor(seededRandom(seed) * Math.min(max, 50)) + minVal;
  return val;
}

function getNumRange(min: number, max: number, seed: string): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

function generateWrongAnswers(correct: number, seed: string): string[] {
  const wrongs: number[] = [];
  let attempt = 0;
  while (wrongs.length < 3 && attempt < 20) {
    const offset = getNumRange(1, Math.max(5, Math.floor(Math.abs(correct) * 0.3) + 2), seed + attempt);
    const sign = seededRandom(seed + 'sign' + attempt) > 0.5 ? 1 : -1;
    const wrong = correct + sign * offset;
    if (wrong !== correct && wrong >= 0 && !wrongs.includes(wrong)) {
      wrongs.push(wrong);
    }
    attempt++;
  }
  while (wrongs.length < 3) {
    const wrong = correct + getNumRange(1, 10, seed + 'fill' + wrongs.length);
    if (!wrongs.includes(wrong) && wrong !== correct) {
      wrongs.push(wrong);
    }
  }
  return wrongs.map(formatNumber);
}

function makeOptions(correct: number, seed: string): { options: string[]; correctStr: string } {
  const correctStr = formatNumber(correct);
  const wrongs = generateWrongAnswers(correct, seed);
  const allOptions = [correctStr, ...wrongs];
  return { options: allOptions, correctStr };
}

// Topic definitions per term per class
const termTopics: Record<Term, string[]> = {
  'First Term': [
    'Whole Numbers',
    'Counting and Writing',
    'Place Value',
    'Addition',
    'Subtraction',
    'Multiplication',
    'Number Lines',
    'Fractions',
    'Odd and Even Numbers',
    'Roman Numerals',
  ],
  'Second Term': [
    'Decimals',
    'Division',
    'Factors and Multiples',
    'Money',
    'Time',
    'Measurement',
    'Geometry',
    'Area and Perimeter',
    'Percentages',
    'Ratio',
  ],
  'Third Term': [
    'Volume and Capacity',
    'Weight',
    'Temperature',
    'Data Handling',
    'Average',
    'Profit and Loss',
    'Simple Interest',
    'Shapes and Angles',
    'Symmetry',
    'Statistics',
  ],
};

// Question generators for each topic
function generateQuestion(
  topic: string,
  classLevel: ClassLevel,
  seed: string
): { question: string; options: string[]; correct: string; difficulty: string } {
  const r1 = getNum(classLevel, seed + 'a');
  const r2 = getNum(classLevel, seed + 'b');
  const r3 = getNum(classLevel, seed + 'c', 2);
  const max = classMaxNumbers[classLevel];

  switch (topic) {
    case 'Whole Numbers': {
      const n = getNumRange(100, max, seed + 'wn');
      const question = `What is the place value of the underlined digit in ${formatNumber(n)}?`;
      const str = n.toString();
      const pos = getNumRange(0, str.length - 1, seed + 'pos');
      const digit = parseInt(str[str.length - 1 - pos]);
      const placeValue = digit * Math.pow(10, pos);
      const { options, correctStr } = makeOptions(placeValue, seed + 'wn_opt');
      const placeNames = ['units', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
      return {
        question: `What is the place value of the digit ${digit} in ${formatNumber(n)}? (Answer in place value e.g. ${digit} ${placeNames[Math.min(pos, placeNames.length - 1)]})`,
        options: [`${digit} ${placeNames[Math.min(pos, placeNames.length - 1)]}`, `${digit} tens`, `${digit} hundreds`, `${digit} units`].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
        correct: `${digit} ${placeNames[Math.min(pos, placeNames.length - 1)]}`,
        difficulty: 'medium',
      };
    }

    case 'Counting and Writing': {
      const n = getNumRange(1, Math.min(max, 200), seed + 'cw');
      const question = `Write in figures: ${numberToWords(n)}`;
      const { options, correctStr } = makeOptions(n, seed + 'cw_opt');
      return { question, options, correct: correctStr, difficulty: 'easy' };
    }

    case 'Place Value': {
      const n = getNumRange(100, max, seed + 'pv');
      const str = n.toString();
      const pos = getNumRange(str.length - 1, str.length - 1, seed + 'pvp');
      const digit = parseInt(str[str.length - 1 - pos]);
      const question = `What digit is in the ${pos === 0 ? 'units' : pos === 1 ? 'tens' : pos === 2 ? 'hundreds' : pos === 3 ? 'thousands' : 'ten thousands'} place in ${formatNumber(n)}?`;
      const wrongs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== digit).slice(0, 3);
      return {
        question,
        options: [digit.toString(), ...wrongs.map(w => w.toString())].sort(() => Math.random() - 0.5),
        correct: digit.toString(),
        difficulty: 'easy',
      };
    }

    case 'Addition': {
      const a = getNumRange(1, Math.min(max, 500), seed + 'add_a');
      const b = getNumRange(1, Math.min(max, 500), seed + 'add_b');
      const correct = a + b;
      const { options, correctStr } = makeOptions(correct, seed + 'add_opt');
      return { question: `What is ${formatNumber(a)} + ${formatNumber(b)}?`, options, correct: correctStr, difficulty: 'easy' };
    }

    case 'Subtraction': {
      const a = getNumRange(10, Math.min(max, 500), seed + 'sub_a');
      const b = getNumRange(1, a, seed + 'sub_b');
      const correct = a - b;
      const { options, correctStr } = makeOptions(correct, seed + 'sub_opt');
      return { question: `What is ${formatNumber(a)} - ${formatNumber(b)}?`, options, correct: correctStr, difficulty: 'easy' };
    }

    case 'Multiplication': {
      const a = getNumRange(2, classLevel === 'Primary 1' ? 5 : classLevel === 'Primary 2' ? 10 : classLevel === 'Primary 3' ? 12 : 25, seed + 'mul_a');
      const b = getNumRange(2, classLevel === 'Primary 1' ? 5 : classLevel === 'Primary 2' ? 10 : classLevel === 'Primary 3' ? 12 : 25, seed + 'mul_b');
      const correct = a * b;
      const { options, correctStr } = makeOptions(correct, seed + 'mul_opt');
      return { question: `What is ${formatNumber(a)} × ${formatNumber(b)}?`, options, correct: correctStr, difficulty: 'medium' };
    }

    case 'Number Lines': {
      const start = getNumRange(0, 50, seed + 'nl_s');
      const step = getNumRange(1, 5, seed + 'nl_step');
      const missing = getNumRange(1, 3, seed + 'nl_missing');
      const correct = start + step * missing;
      const { options, correctStr } = makeOptions(correct, seed + 'nl_opt');
      return {
        question: `On a number line, if the first number is ${start} and numbers increase by ${step}, what is the ${missing === 1 ? '1st' : missing === 2 ? '2nd' : '3rd'} number after it?`,
        options, correct: correctStr, difficulty: 'medium',
      };
    }

    case 'Fractions': {
      const denom = getNumRange(2, 10, seed + 'frac_d');
      const numer = getNumRange(1, denom - 1, seed + 'frac_n');
      const correct = numer / denom;
      const wrongs = [
        formatNumber((numer + 1) / denom),
        formatNumber(numer / (denom + 1)),
        formatNumber((numer - 1) / denom),
      ];
      return {
        question: `What is ${numer}/${denom} as a decimal?`,
        options: [correct.toFixed(2), ...wrongs].slice(0, 4),
        correct: correct.toFixed(2),
        difficulty: 'hard',
      };
    }

    case 'Odd and Even Numbers': {
      const n = getNumRange(1, Math.min(max, 200), seed + 'oe');
      const isOdd = n % 2 !== 0;
      return {
        question: `Is ${formatNumber(n)} an odd or even number?`,
        options: ['Odd', 'Even', 'Both', 'Neither'],
        correct: isOdd ? 'Odd' : 'Even',
        difficulty: 'easy',
      };
    }

    case 'Roman Numerals': {
      const n = getNumRange(1, classLevel === 'Primary 1' ? 20 : classLevel === 'Primary 2' ? 100 : 1000, seed + 'rn');
      const roman = toRoman(n);
      return {
        question: `What is ${formatNumber(n)} in Roman numerals?`,
        options: [roman, toRoman(n + 10), toRoman(Math.max(1, n - 10)), toRoman(n + 5)],
        correct: roman,
        difficulty: 'medium',
      };
    }

    case 'Decimals': {
      const a = getNumRange(1, 100, seed + 'dec_a');
      const b = getNumRange(1, 100, seed + 'dec_b');
      const correct = ((a + b) / 100).toFixed(2);
      return {
        question: `What is ${(a / 100).toFixed(2)} + ${(b / 100).toFixed(2)}?`,
        options: [correct, ((a + b + 10) / 100).toFixed(2), ((a + b - 5) / 100).toFixed(2), ((a + b + 50) / 100).toFixed(2)],
        correct,
        difficulty: 'medium',
      };
    }

    case 'Division': {
      const b = getNumRange(2, classLevel === 'Primary 1' ? 5 : 12, seed + 'div_b');
      const correct = getNumRange(1, classLevel === 'Primary 1' ? 5 : 20, seed + 'div_q');
      const a = b * correct;
      return {
        question: `What is ${formatNumber(a)} ÷ ${formatNumber(b)}?`,
        options: [correct.toString(), (correct + 1).toString(), (correct - 1).toString(), (correct + 2).toString()],
        correct: correct.toString(),
        difficulty: 'medium',
      };
    }

    case 'Factors and Multiples': {
      const n = getNumRange(2, 50, seed + 'fm');
      const factors = getFactors(n);
      const nonFactor = getNumRange(2, 50, seed + 'fm_nf');
      const options = factors.slice(0, 3).concat(nonFactor.toString()).filter((v, i, a) => a.indexOf(v) === i);
      return {
        question: `Which of the following is NOT a factor of ${formatNumber(n)}?`,
        options: options.length >= 4 ? options.slice(0, 4) : [nonFactor.toString(), ...factors].slice(0, 4),
        correct: nonFactor.toString(),
        difficulty: 'hard',
      };
    }

    case 'Money': {
      const a = getNumRange(50, 5000, seed + 'money_a');
      const b = getNumRange(50, 2000, seed + 'money_b');
      const correct = a - b;
      return {
        question: `A pencil costs ₦${formatNumber(a)}. You pay with ₦${formatNumber(a + b)}. How much change do you get back?`,
        options: [`₦${formatNumber(b)}`, `₦${formatNumber(correct)}`, `₦${formatNumber(b + 10)}`, `₦${formatNumber(b - 10)}`],
        correct: `₦${formatNumber(b)}`,
        difficulty: 'medium',
      };
    }

    case 'Time': {
      const h = getNumRange(1, 12, seed + 'time_h');
      const m = getNumRange(0, 55, seed + 'time_m');
      const correctMin = h * 60 + m;
      return {
        question: `How many minutes are there in ${h} hours and ${m} minutes?`,
        options: [correctMin.toString(), (correctMin + 60).toString(), (correctMin - 10).toString(), (correctMin + 30).toString()],
        correct: correctMin.toString(),
        difficulty: 'medium',
      };
    }

    case 'Measurement': {
      const km = getNumRange(1, 50, seed + 'meas');
      const correctM = km * 1000;
      return {
        question: `How many meters are in ${formatNumber(km)} kilometers?`,
        options: [correctM.toString(), (correctM + 100).toString(), (correctM - 50).toString(), (correctM + 1000).toString()],
        correct: correctM.toString(),
        difficulty: 'easy',
      };
    }

    case 'Geometry': {
      const sides = getNumRange(3, 8, seed + 'geo');
      const totalAngle = (sides - 2) * 180;
      return {
        question: `A polygon has ${sides} sides. What is the sum of its interior angles?`,
        options: [`${totalAngle}°`, `${totalAngle + 180}°`, `${totalAngle - 180}°`, `${totalAngle + 360}°`],
        correct: `${totalAngle}°`,
        difficulty: 'hard',
      };
    }

    case 'Area and Perimeter': {
      const l = getNumRange(3, 20, seed + 'area_l');
      const w = getNumRange(2, 15, seed + 'area_w');
      const correct = l * w;
      const { options, correctStr } = makeOptions(correct, seed + 'area_opt');
      return {
        question: `A rectangle has length ${l}cm and width ${w}cm. What is its area?`,
        options: [`${correctStr} cm²`, `${(l * 2 + w * 2)} cm²`, `${(correct + 5)} cm²`, `${(correct - 3)} cm²`],
        correct: `${correctStr} cm²`,
        difficulty: 'medium',
      };
    }

    case 'Percentages': {
      const pct = getNumRange(5, 50, seed + 'pct');
      const base = getNumRange(100, 1000, seed + 'pct_base');
      const correct = Math.round((pct / 100) * base);
      return {
        question: `What is ${pct}% of ${formatNumber(base)}?`,
        options: [correct.toString(), (correct + 10).toString(), (correct - 10).toString(), (correct + 50).toString()],
        correct: correct.toString(),
        difficulty: 'medium',
      };
    }

    case 'Ratio': {
      const a = getNumRange(2, 10, seed + 'ratio_a');
      const b = getNumRange(2, 10, seed + 'ratio_b');
      const total = getNumRange(20, 100, seed + 'ratio_total');
      const correct = Math.round((a / (a + b)) * total);
      return {
        question: `Two quantities are in the ratio ${a}:${b}. If their total is ${total}, what is the first quantity?`,
        options: [correct.toString(), (correct + 2).toString(), (correct - 2).toString(), (correct + 5).toString()],
        correct: correct.toString(),
        difficulty: 'hard',
      };
    }

    case 'Volume and Capacity': {
      const l = getNumRange(1, 20, seed + 'vol_l');
      const correctMl = l * 1000;
      return {
        question: `How many milliliters are in ${formatNumber(l)} liters?`,
        options: [correctMl.toString(), (correctMl + 100).toString(), (correctMl - 50).toString(), (correctMl + 500).toString()],
        correct: correctMl.toString(),
        difficulty: 'easy',
      };
    }

    case 'Weight': {
      const kg = getNumRange(1, 50, seed + 'wt');
      const correctG = kg * 1000;
      return {
        question: `How many grams are in ${formatNumber(kg)} kilograms?`,
        options: [correctG.toString(), (correctG + 100).toString(), (correctG - 50).toString(), (correctG + 1000).toString()],
        correct: correctG.toString(),
        difficulty: 'easy',
      };
    }

    case 'Temperature': {
      const c = getNumRange(0, 100, seed + 'temp');
      const correctF = Math.round(c * 9 / 5 + 32);
      return {
        question: `Convert ${c}°C to Fahrenheit.`,
        options: [`${correctF}°F`, `${correctF + 10}°F`, `${correctF - 5}°F`, `${correctF + 20}°F`],
        correct: `${correctF}°F`,
        difficulty: 'hard',
      };
    }

    case 'Data Handling': {
      const a = getNumRange(5, 30, seed + 'dh_a');
      const b = getNumRange(5, 30, seed + 'dh_b');
      const c = getNumRange(5, 30, seed + 'dh_c');
      const correct = a + b + c;
      return {
        question: `In a survey, ${a} children like Maths, ${b} like English, and ${c} like Science. How many children were surveyed?`,
        options: [correct.toString(), (correct + 3).toString(), (correct - 2).toString(), (correct + 10).toString()],
        correct: correct.toString(),
        difficulty: 'easy',
      };
    }

    case 'Average': {
      const a = getNumRange(10, 50, seed + 'avg_a');
      const b = getNumRange(10, 50, seed + 'avg_b');
      const c = getNumRange(10, 50, seed + 'avg_c');
      const total = a + b + c;
      const correct = Math.round(total / 3);
      return {
        question: `Find the average of ${a}, ${b}, and ${c}.`,
        options: [correct.toString(), (correct + 1).toString(), (correct - 1).toString(), (correct + 3).toString()],
        correct: correct.toString(),
        difficulty: 'medium',
      };
    }

    case 'Profit and Loss': {
      const cp = getNumRange(100, 2000, seed + 'pl_cp');
      const profit = getNumRange(50, 500, seed + 'pl_p');
      const sp = cp + profit;
      return {
        question: `A trader bought an item for ₦${formatNumber(cp)} and sold it for ₦${formatNumber(sp)}. What is the profit?`,
        options: [`₦${formatNumber(profit)}`, `₦${formatNumber(profit + 50)}`, `₦${formatNumber(profit - 20)}`, `₦${formatNumber(profit + 100)}`],
        correct: `₦${formatNumber(profit)}`,
        difficulty: 'medium',
      };
    }

    case 'Simple Interest': {
      const p = getNumRange(1000, 10000, seed + 'si_p');
      const r = getNumRange(5, 15, seed + 'si_r');
      const t = getNumRange(1, 5, seed + 'si_t');
      const correct = Math.round((p * r * t) / 100);
      return {
        question: `Find the simple interest on ₦${formatNumber(p)} at ${r}% per annum for ${t} years.`,
        options: [`₦${formatNumber(correct)}`, `₦${formatNumber(correct + 100)}`, `₦${formatNumber(correct - 50)}`, `₦${formatNumber(correct + 500)}`],
        correct: `₦${formatNumber(correct)}`,
        difficulty: 'hard',
      };
    }

    case 'Shapes and Angles': {
      const angle = getNumRange(30, 150, seed + 'sa');
      const complement = 90 - angle;
      const isComplement = angle < 90;
      return {
        question: `What is the ${isComplement ? 'complementary' : 'supplementary'} angle of ${angle}°?`,
        options: isComplement
          ? [`${complement}°`, `${complement + 10}°`, `${complement - 5}°`, `${complement + 20}°`]
          : [`${180 - angle}°`, `${190 - angle}°`, `${170 - angle}°`, `${200 - angle}°`],
        correct: isComplement ? `${complement}°` : `${180 - angle}°`,
        difficulty: 'medium',
      };
    }

    case 'Symmetry': {
      const shapes = ['Equilateral Triangle', 'Square', 'Rectangle', 'Circle', 'Isosceles Triangle', 'Regular Pentagon'];
      const linesOfSymmetry: Record<string, number> = {
        'Equilateral Triangle': 3, 'Square': 4, 'Rectangle': 2,
        'Circle': 999, 'Isosceles Triangle': 1, 'Regular Pentagon': 5,
      };
      const shape = pickFromArray(shapes, seed + 'sym');
      const correct = linesOfSymmetry[shape];
      const correctStr = correct === 999 ? 'Infinite' : correct.toString();
      const options = correct === 999
        ? ['Infinite', '4', '2', '6']
        : [correct.toString(), (correct + 1).toString(), (correct + 2).toString(), (correct - 1).toString()];
      return {
        question: `How many lines of symmetry does a ${shape} have?`,
        options,
        correct: correctStr,
        difficulty: 'medium',
      };
    }

    case 'Statistics': {
      const values = Array.from({ length: 5 }, (_, i) => getNumRange(10, 50, seed + 'stat' + i));
      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted[2];
      return {
        question: `What is the median of: ${values.join(', ')}?`,
        options: [median.toString(), (median + 2).toString(), (median - 1).toString(), (median + 5).toString()],
        correct: median.toString(),
        difficulty: 'medium',
      };
    }

    default: {
      const a = getNumRange(1, 50, seed + 'def_a');
      const b = getNumRange(1, 50, seed + 'def_b');
      const correct = a + b;
      const { options, correctStr } = makeOptions(correct, seed + 'def_opt');
      return { question: `What is ${a} + ${b}?`, options, correct: correctStr, difficulty: 'easy' };
    }
  }
}

// Generate 40 unique curriculum questions for a student
export function generateQuizQuestions(
  studentId: string,
  classLevel: ClassLevel,
  term: Term,
  previousQuestionIds: string[] = []
): QuizQuestion[] {
  const topics = termTopics[term];
  const questions: QuizQuestion[] = [];
  const usedSeeds = new Set(previousQuestionIds);

  let questionIndex = 0;
  while (questions.length < 40 && questionIndex < 200) {
    const topicIndex = questionIndex % topics.length;
    const topic = topics[topicIndex];
    const seed = `${studentId}-${term}-${classLevel}-${topicIndex}-${questionIndex}`;

    if (usedSeeds.has(seed)) {
      questionIndex++;
      continue;
    }

    const generated = generateQuestion(topic, classLevel, seed + 'gen');
    const shuffled = shuffleOptions(generated.options, generated.correct, seed + 'shuffle');

    questions.push({
      id: seed,
      question_text: generated.question,
      options: shuffled.options,
      correct_answer: generated.correct,
      topic,
      difficulty: generated.difficulty,
    });

    usedSeeds.add(seed);
    questionIndex++;
  }

  return questions;
}

// Generate 40 mental math questions
export function generateMentalMathQuestions(
  studentId: string,
  classLevel: ClassLevel,
  previousQuestionIds: string[] = []
): QuizQuestion[] {
  const operations = ['add', 'subtract', 'multiply', 'divide', 'mixed', 'percentage', 'square', 'fraction'];
  const questions: QuizQuestion[] = [];
  const usedSeeds = new Set(previousQuestionIds);

  let questionIndex = 0;
  while (questions.length < 40 && questionIndex < 200) {
    const opIndex = questionIndex % operations.length;
    const op = operations[opIndex];
    const seed = `${studentId}-mental-${classLevel}-${opIndex}-${questionIndex}`;

    if (usedSeeds.has(seed)) {
      questionIndex++;
      continue;
    }

    const generated = generateMentalMath(op, classLevel, seed);
    const shuffled = shuffleOptions(generated.options, generated.correct, seed + 'shuffle');

    questions.push({
      id: seed,
      question_text: generated.question,
      options: shuffled.options,
      correct_answer: generated.correct,
      topic: 'Mental Math',
      difficulty: generated.difficulty,
    });

    usedSeeds.add(seed);
    questionIndex++;
  }

  return questions;
}

function generateMentalMath(
  op: string,
  classLevel: ClassLevel,
  seed: string
): { question: string; options: string[]; correct: string; difficulty: string } {
  const max = classMaxNumbers[classLevel];
  const rangeMax = Math.min(max, 100);

  switch (op) {
    case 'add': {
      const a = getNumRange(1, rangeMax, seed + 'a');
      const b = getNumRange(1, rangeMax, seed + 'b');
      const correct = a + b;
      return {
        question: `${a} + ${b} = ?`,
        options: [correct.toString(), (correct + 1).toString(), (correct + 2).toString(), (correct - 1).toString()],
        correct: correct.toString(),
        difficulty: 'easy',
      };
    }
    case 'subtract': {
      const a = getNumRange(10, rangeMax, seed + 'a');
      const b = getNumRange(1, a, seed + 'b');
      const correct = a - b;
      return {
        question: `${a} - ${b} = ?`,
        options: [correct.toString(), (correct + 1).toString(), (correct - 1).toString(), (correct + 2).toString()],
        correct: correct.toString(),
        difficulty: 'easy',
      };
    }
    case 'multiply': {
      const a = getNumRange(2, classLevel === 'Primary 1' ? 5 : 12, seed + 'a');
      const b = getNumRange(2, classLevel === 'Primary 1' ? 5 : 12, seed + 'b');
      const correct = a * b;
      return {
        question: `${a} × ${b} = ?`,
        options: [correct.toString(), (correct + 2).toString(), (correct - 1).toString(), (correct + 5).toString()],
        correct: correct.toString(),
        difficulty: 'medium',
      };
    }
    case 'divide': {
      const b = getNumRange(2, 12, seed + 'b');
      const q = getNumRange(2, 15, seed + 'q');
      const a = b * q;
      return {
        question: `${a} ÷ ${b} = ?`,
        options: [q.toString(), (q + 1).toString(), (q - 1).toString(), (q + 2).toString()],
        correct: q.toString(),
        difficulty: 'medium',
      };
    }
    case 'mixed': {
      const a = getNumRange(2, 20, seed + 'a');
      const b = getNumRange(2, 20, seed + 'b');
      const c = getNumRange(1, 10, seed + 'c');
      const correct = a * b + c;
      return {
        question: `${a} × ${b} + ${c} = ?`,
        options: [correct.toString(), (correct + 2).toString(), (correct - 2).toString(), (correct + 5).toString()],
        correct: correct.toString(),
        difficulty: 'hard',
      };
    }
    case 'percentage': {
      const pct = getNumRange(10, 50, seed + 'pct');
      const base = getNumRange(100, 1000, seed + 'base');
      const correct = Math.round((pct / 100) * base);
      return {
        question: `${pct}% of ${base} = ?`,
        options: [correct.toString(), (correct + 10).toString(), (correct - 10).toString(), (correct + 5).toString()],
        correct: correct.toString(),
        difficulty: 'hard',
      };
    }
    case 'square': {
      const n = getNumRange(2, classLevel === 'Primary 1' ? 5 : 15, seed + 'n');
      const correct = n * n;
      return {
        question: `${n}² = ?`,
        options: [correct.toString(), (correct + n).toString(), (correct - n).toString(), (correct + 2 * n).toString()],
        correct: correct.toString(),
        difficulty: 'medium',
      };
    }
    case 'fraction': {
      const denom = getNumRange(2, 12, seed + 'd');
      const numer = getNumRange(1, denom - 1, seed + 'n');
      const correct = (numer / denom).toFixed(2);
      return {
        question: `${numer}/${denom} = ? (decimal)`,
        options: [correct, ((numer + 1) / denom).toFixed(2), (numer / (denom + 1)).toFixed(2), ((numer - 1) / denom).toFixed(2)],
        correct,
        difficulty: 'hard',
      };
    }
    default: {
      const a = getNumRange(1, 50, seed + 'a');
      const b = getNumRange(1, 50, seed + 'b');
      const correct = a + b;
      return {
        question: `${a} + ${b} = ?`,
        options: [correct.toString(), (correct + 1).toString(), (correct - 1).toString(), (correct + 2).toString()],
        correct: correct.toString(),
        difficulty: 'easy',
      };
    }
  }
}

// Helper: number to words
function numberToWords(n: number): string {
  if (n === 0) return 'zero';
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '');
  if (n < 1000000) return numberToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '');
  return numberToWords(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + numberToWords(n % 1000000) : '');
}

// Helper: convert to Roman numerals
function toRoman(num: number): string {
  const values: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let result = '';
  for (const [val, sym] of values) {
    while (num >= val) {
      result += sym;
      num -= val;
    }
  }
  return result;
}

// Helper: get factors of a number
function getFactors(n: number): string[] {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors.map(f => f.toString());
}

// Weekly coverage data
export const weeklyCoverage: Record<ClassLevel, Record<Term, { week: number; topics: string[] }[]>> = {
  'Primary 1': {
    'First Term': [
      { week: 1, topics: ['Counting 1-20'] },
      { week: 2, topics: ['Writing 1-20'] },
      { week: 3, topics: ['Place Value (Tens and Units)'] },
      { week: 4, topics: ['Addition (1-20)'] },
      { week: 5, topics: ['Subtraction (1-20)'] },
      { week: 6, topics: ['Addition and Subtraction'] },
      { week: 7, topics: ['Odd and Even Numbers'] },
      { week: 8, topics: ['Number Lines'] },
      { week: 9, topics: ['Fractions (Halves)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Second Term': [
      { week: 1, topics: ['Counting 1-50'] },
      { week: 2, topics: ['Addition (1-50)'] },
      { week: 3, topics: ['Subtraction (1-50)'] },
      { week: 4, topics: ['Multiplication (2x table)'] },
      { week: 5, topics: ['Multiplication (5x table)'] },
      { week: 6, topics: ['Money (Naira)'] },
      { week: 7, topics: ['Time (O\'clock)'] },
      { week: 8, topics: ['Shapes (2D)'] },
      { week: 9, topics: ['Measurement (Length)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Third Term': [
      { week: 1, topics: ['Counting 1-100'] },
      { week: 2, topics: ['Multiplication (10x table)'] },
      { week: 3, topics: ['Division (Sharing)'] },
      { week: 4, topics: ['Fractions (Quarters)'] },
      { week: 5, topics: ['Money (Buying and Selling)'] },
      { week: 6, topics: ['Time (Half Past)'] },
      { week: 7, topics: ['Capacity'] },
      { week: 8, topics: ['Weight'] },
      { week: 9, topics: ['Data (Simple Charts)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
  },
  'Primary 2': {
    'First Term': [
      { week: 1, topics: ['Whole Numbers 1-100'] },
      { week: 2, topics: ['Place Value (Hundreds)'] },
      { week: 3, topics: ['Addition (1-100)'] },
      { week: 4, topics: ['Subtraction (1-100)'] },
      { week: 5, topics: ['Multiplication (2x, 3x)'] },
      { week: 6, topics: ['Multiplication (4x, 5x)'] },
      { week: 7, topics: ['Fractions (Thirds)'] },
      { week: 8, topics: ['Roman Numerals (I-X)'] },
      { week: 9, topics: ['Money'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Second Term': [
      { week: 1, topics: ['Multiplication (6x, 7x)'] },
      { week: 2, topics: ['Multiplication (8x, 9x)'] },
      { week: 3, topics: ['Division (2-5)'] },
      { week: 4, topics: ['Division (6-9)'] },
      { week: 5, topics: ['Time (Quarter Past)'] },
      { week: 6, topics: ['Measurement (cm)'] },
      { week: 7, topics: ['Area'] },
      { week: 8, topics: ['2D Shapes'] },
      { week: 9, topics: ['3D Shapes'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Third Term': [
      { week: 1, topics: ['Fractions (Addition)'] },
      { week: 2, topics: ['Fractions (Subtraction)'] },
      { week: 3, topics: ['Money (Change)'] },
      { week: 4, topics: ['Capacity (Liters)'] },
      { week: 5, topics: ['Weight (Grams)'] },
      { week: 6, topics: ['Temperature'] },
      { week: 7, topics: ['Data (Pictograms)'] },
      { week: 8, topics: ['Symmetry'] },
      { week: 9, topics: ['Estimation'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
  },
  'Primary 3': {
    'First Term': [
      { week: 1, topics: ['Whole Numbers 1-1000'] },
      { week: 2, topics: ['Place Value (Thousands)'] },
      { week: 3, topics: ['Addition (3-digit)'] },
      { week: 4, topics: ['Subtraction (3-digit)'] },
      { week: 5, topics: ['Multiplication (2-digit)'] },
      { week: 6, topics: ['Roman Numerals (I-L)'] },
      { week: 7, topics: ['Fractions (Equivalent)'] },
      { week: 8, topics: ['Fractions (Comparison)'] },
      { week: 9, topics: ['Number Lines (Negative)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Second Term': [
      { week: 1, topics: ['Division (2-digit)'] },
      { week: 2, topics: ['Factors'] },
      { week: 3, topics: ['Multiples'] },
      { week: 4, topics: ['Decimals (Tenths)'] },
      { week: 5, topics: ['Money (Calculations)'] },
      { week: 6, topics: ['Time (Minutes)'] },
      { week: 7, topics: ['Perimeter'] },
      { week: 8, topics: ['Area (Counting Squares)'] },
      { week: 9, topics: ['Percentages (10%)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Third Term': [
      { week: 1, topics: ['Capacity (ml)'] },
      { week: 2, topics: ['Weight (kg)'] },
      { week: 3, topics: ['Temperature (°C)'] },
      { week: 4, topics: ['Data (Bar Charts)'] },
      { week: 5, topics: ['Average (Mean)'] },
      { week: 6, topics: ['Profit and Loss'] },
      { week: 7, topics: ['Angles (Right Angle)'] },
      { week: 8, topics: ['Symmetry (Lines)'] },
      { week: 9, topics: ['Estimation (Rounding)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
  },
  'Primary 4': {
    'First Term': [
      { week: 1, topics: ['Whole Numbers 1-10000'] },
      { week: 2, topics: ['Place Value (Ten Thousands)'] },
      { week: 3, topics: ['Addition (4-digit)'] },
      { week: 4, topics: ['Subtraction (4-digit)'] },
      { week: 5, topics: ['Multiplication (3-digit × 1-digit)'] },
      { week: 6, topics: ['Roman Numerals (I-C)'] },
      { week: 7, topics: ['Fractions (Addition)'] },
      { week: 8, topics: ['Fractions (Subtraction)'] },
      { week: 9, topics: ['Decimals (Hundredths)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Second Term': [
      { week: 1, topics: ['Division (3-digit)'] },
      { week: 2, topics: ['LCM and HCF'] },
      { week: 3, topics: ['Money (Complex)'] },
      { week: 4, topics: ['Time (Hours and Minutes)'] },
      { week: 5, topics: ['Perimeter (Rectangles)'] },
      { week: 6, topics: ['Area (Rectangles)'] },
      { week: 7, topics: ['Percentages'] },
      { week: 8, topics: ['Ratio'] },
      { week: 9, topics: ['Geometry (Triangles)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Third Term': [
      { week: 1, topics: ['Volume (Cuboids)'] },
      { week: 2, topics: ['Capacity'] },
      { week: 3, topics: ['Weight (Conversions)'] },
      { week: 4, topics: ['Temperature'] },
      { week: 5, topics: ['Data (Bar Charts)'] },
      { week: 6, topics: ['Average'] },
      { week: 7, topics: ['Profit and Loss (%)'] },
      { week: 8, topics: ['Simple Interest'] },
      { week: 9, topics: ['Statistics (Mode)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
  },
  'Primary 5': {
    'First Term': [
      { week: 1, topics: ['Whole Numbers 1-100000'] },
      { week: 2, topics: ['Place Value (Hundred Thousands)'] },
      { week: 3, topics: ['Addition (5-digit)'] },
      { week: 4, topics: ['Subtraction (5-digit)'] },
      { week: 5, topics: ['Multiplication (4-digit × 2-digit)'] },
      { week: 6, topics: ['Roman Numerals (I-M)'] },
      { week: 7, topics: ['Fractions (Mixed)'] },
      { week: 8, topics: ['Fractions (Multiplication)'] },
      { week: 9, topics: ['Decimals (Operations)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Second Term': [
      { week: 1, topics: ['Division (4-digit)'] },
      { week: 2, topics: ['LCM and HCF'] },
      { week: 3, topics: ['Money (Profit)'] },
      { week: 4, topics: ['Time (Duration)'] },
      { week: 5, topics: ['Perimeter (Composite)'] },
      { week: 6, topics: ['Area (Triangles)'] },
      { week: 7, topics: ['Percentages (Increase)'] },
      { week: 8, topics: ['Ratio (Sharing)'] },
      { week: 9, topics: ['Geometry (Quadrilaterals)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Third Term': [
      { week: 1, topics: ['Volume (Prisms)'] },
      { week: 2, topics: ['Capacity'] },
      { week: 3, topics: ['Weight'] },
      { week: 4, topics: ['Temperature (Conversion)'] },
      { week: 5, topics: ['Data (Pie Charts)'] },
      { week: 6, topics: ['Average (Weighted)'] },
      { week: 7, topics: ['Profit and Loss (Complex)'] },
      { week: 8, topics: ['Simple Interest (Time)'] },
      { week: 9, topics: ['Statistics (Median, Mode)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
  },
  'Primary 6': {
    'First Term': [
      { week: 1, topics: ['Whole Numbers 1-1000000'] },
      { week: 2, topics: ['Place Value (Millions)'] },
      { week: 3, topics: ['Addition (6-digit)'] },
      { week: 4, topics: ['Subtraction (6-digit)'] },
      { week: 5, topics: ['Multiplication (5-digit × 3-digit)'] },
      { week: 6, topics: ['Roman Numerals (Review)'] },
      { week: 7, topics: ['Fractions (Division)'] },
      { week: 8, topics: ['Fractions (Mixed Operations)'] },
      { week: 9, topics: ['Decimals (All Operations)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Second Term': [
      { week: 1, topics: ['Division (5-digit)'] },
      { week: 2, topics: ['LCM, HCF, Prime Numbers'] },
      { week: 3, topics: ['Money (Banking)'] },
      { week: 4, topics: ['Time (Zones)'] },
      { week: 5, topics: ['Perimeter (Circles)'] },
      { week: 6, topics: ['Area (Circles)'] },
      { week: 7, topics: ['Percentages (Discount)'] },
      { week: 8, topics: ['Ratio (Proportion)'] },
      { week: 9, topics: ['Geometry (Angles)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
    'Third Term': [
      { week: 1, topics: ['Volume (Cylinders)'] },
      { week: 2, topics: ['Capacity (Conversion)'] },
      { week: 3, topics: ['Weight (Complex)'] },
      { week: 4, topics: ['Temperature'] },
      { week: 5, topics: ['Data (Mean, Median, Mode)'] },
      { week: 6, topics: ['Average'] },
      { week: 7, topics: ['Profit, Loss, Discount'] },
      { week: 8, topics: ['Simple and Compound Interest'] },
      { week: 9, topics: ['Statistics (Probability)'] },
      { week: 10, topics: ['Review and Assessment'] },
    ],
  },
};

export { classLevels };
