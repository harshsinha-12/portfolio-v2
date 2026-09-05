# Harsh Sinha — Writing Style Guide

This guide applies to articles and their social launch copy. Write in English only unless Harsh explicitly asks otherwise.

## Core voice

Conversational, curious, technically strong, easy to follow, slightly witty, skeptical when required, and practical rather than overly academic. The reader should feel like the writer is thinking through the problem with them, not lecturing them.

## General writing philosophy

Prefer this progression:

```text
Interesting problem
→ Intuition
→ Concrete example
→ Technical explanation
→ Numbers / mechanics
→ "But wait..."
→ Edge cases / failure modes
→ Real-world implication
```

Explain how something works, why it works, where it works, where it breaks, and whether the result is actually useful in practice.

## Tone

Prefer natural conversational English, short and medium-length sentences, direct explanations, occasional dry humour, questions that make the reader think, and confidence without sounding authoritative for no reason. Introduce technical terminology after establishing intuition.

Avoid textbook-style definitions as openings, excessive corporate or academic language, forced humour, forced internet slang, overusing analogies, making every paragraph dramatic, and explaining obvious things for too long. Do not use Hinglish in English technical articles unless explicitly requested.

Avoid artificial phrases such as:

- “Imagine a magical world...”
- “Let's embark on a journey...”
- “In today's rapidly evolving landscape...”
- “This revolutionary concept...”

## How to start articles

Start with something concrete that creates a small question leading into the concept.

Instead of:

> Linear regression is a statistical method used to model the relationship between variables.

Prefer:

> The restaurant is four kilometres away and Zomato says your food will arrive in 20 minutes. Where did that 20 come from?

Or:

> An LLM takes 800 ms to answer a short query and 4 seconds to answer a much longer one. How much of that difference can be explained by the number of generated tokens?

## Explanation style

### Intuition before terminology

Explain the idea first: “We need some way to measure how far every prediction is from reality.” Then introduce the name: “That difference is called a residual.” Avoid beginning with “A residual is defined as...”

### Concrete numbers over abstract statements

Prefer actual numbers:

```text
1 km → 11 minutes
2 km → 14 minutes
3 km → 17 minutes
```

over “Delivery time increases proportionally with distance.”

### Build the formula instead of dropping it

Start with:

```text
predicted time
= starting time
+ time added per kilometre × distance
```

Then introduce notation such as `y = β₀ + β₁x` as shorthand for an idea the reader already understands. Distinguish predicted and observed values when needed.

## Typical examples, in order of preference

### Tier 1 — AI, LLMs, and backend systems

These are closest to Harsh's natural technical interests:

```text
generated tokens → LLM latency
requests per second → CPU utilisation
queue size → processing delay
retrieved documents → RAG latency
context length → inference cost
dataset size → processing time
vector count → storage requirements
concurrent users → infrastructure load
```

Especially useful for regression, distributed systems, queues, latency, scaling, caching, RAG, embeddings, evaluation, agents, and databases.

### Tier 2 — Finance and markets

Useful when the concept becomes more realistic or messy:

```text
revenue growth → valuation multiple
portfolio concentration → volatility
interest rates → borrowing costs
holding period → MTF interest cost
risk → expected return
```

Especially useful for noisy data, correlation versus causation, confounding variables, forecasting, uncertainty, overfitting, and model assumptions. Usually avoid finance as the first beginner example if it introduces unnecessary complexity.

> Markets have an annoying habit of refusing to behave like clean textbook datasets.

### Tier 3 — Startup and product metrics

```text
emails sent → opens
page latency → conversion
users → support requests
marketing spend → signups
daily active users → infrastructure cost
notification frequency → engagement
```

These naturally lead into: “Okay, but does this relationship actually imply causation?”

### Tier 4 — Everyday examples

Use everyday examples to introduce intuition: Zomato / Swiggy delivery time, Uber arrival estimates, flights, travel time, gym / fitness, college, exams, shopping, phones, and apps.

An everyday example should ideally transition into a technical example later:

```text
Delivery distance → delivery time
Generated tokens → LLM response time
```

Same mathematical idea, different system.

## A signature pattern: “But does it actually work?”

After the clean explanation, introduce questions such as:

- Why are we squaring the errors?
- What happens if one data point is completely abnormal?
- Does this still work outside the range we trained on?
- Are we measuring correlation or causation?
- The training accuracy looks great. What happens on data the model has never seen?
- This architecture works for 10,000 requests. What happens at 10 million?

Use questions to advance the explanation, not as decoration.

## Technical depth

Build multiple layers:

1. **Intuition:** a newcomer should understand the main idea and be able to stop here.
2. **Mechanics:** formulas, architecture, data flow, algorithms, pseudocode, and numbers.
3. **Reality:** assumptions, trade-offs, edge cases, scalability, failure modes, and production constraints.

Give technical readers enough depth to continue.

## Use of questions

Useful questions include “Why this line?”, “Why not simply predict the average every time?”, “What exactly did the model learn?”, “What happens when the restaurant is 30 kilometres away?”, and “The model works on our five examples. But will it work tomorrow?”

## Humour

Keep humour sparse; one line every few sections is enough. The technical idea remains the main character.

> The maths still works. Whether the prediction does is another question.

> Markets, unfortunately, did not sign the linearity agreement.

> The queue is technically functioning. Your users may disagree.

Do not turn an article into a collection of punchlines.

## Numbers and scale

Prefer “The system processed 500,000 queries” over “The system processed many queries.” Use concrete scales such as 10, 1,000, and 100,000 requests/sec when showing how behaviour changes with scale. Numbers should make the argument tangible; do not invent evidence to supply them.

## Skepticism

Do not blindly celebrate a result. Ask what the metric actually means.

> A training MAE of 0.8 minutes looks excellent.
>
> But we measured it on the same five examples used to fit the model.

Or:

> 95% accuracy sounds great.
>
> Unless 95% of the dataset belongs to one class.

Let skepticism appear naturally throughout the writing.

## Real systems over toy systems

Use toy examples to teach, then connect them to real systems. This transition is especially important in longer articles.

```text
Toy: distance → delivery time
Real system: output tokens → LLM latency

Toy: customers arriving → queue length
Real system: API requests → BullMQ workers → database writes
```

## Preferred article structure

Use as a flexible structure, not a mandatory chapter template:

1. Interesting opening question and a simple example.
2. Introduce the underlying idea without heavy terminology.
3. Add the formal definition and notation.
4. Work through concrete numbers.
5. Explain why the method works.
6. Try a prediction or experiment.
7. Ask “But what happens when...” and explore limitations.
8. Connect to a real AI, backend, finance, or product system.
9. Give the reader the mental model to remember.
10. End with a bigger question.

## Preferred ending

Avoid generic conclusions such as “In conclusion, linear regression is an important machine learning technique with many applications.” End with a question or implication that zooms out slightly:

> The next time an app tells you that your food will arrive in 18 minutes, the interesting question isn't only whether the estimate is right.
>
> It is what data taught the system to predict 18 in the first place, and whether that relationship still holds when tomorrow looks different from yesterday.

## Writing formula

```text
Curiosity
+ simple intuition
+ concrete numbers
+ technical mechanics
+ real systems
+ healthy skepticism
+ occasional humour
= Harsh's technical writing style
```

## Final rule

Sound like:

> I found this idea interesting, so let's break down what is actually happening.

Not:

> I am here to teach you this chapter.

The reader and writer should feel like they are investigating the system together.
