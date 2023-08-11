# Rare key generator for Ed25519

## Hex
We're generating hex keys here. Hex keys are composed of integers 0-9 and letters a-f. 

Because of this, it's not possible to generate a key that ends with "house" or other words/phrases that include letters outside the scope(a-f).

Possible: any combination of 0123456789abcdef (can reoccur).

Brute forcing is expensive, don't use suffixes that are crazy long. 

Suffixes exceeding 7-8 digits will take a *very* long time to generate on average machines.

On an M2 Macbook Air (2022), generating a 7 digit key will take an est. of 12 hours.

## Estimate the complexity of your key

```
ts-node generator.ts -ep estimate -suffix YOUR_SUFFIX_MAX_LEN_64_DIGITS -limit LIMIT_FOR_TEST_CASE

```
The greater the LIMIT_FOR_TEST_CASE, the more accurate the prediction becomes. Outliers are expected.
## Generate your key with limit

```
ts-node generator.ts -ep generate -suffix YOUR_SUFFIX_MAX_LEN_64_DIGITS -limit MAXIMUM_ATTEMPTS_FOR_THE_GENERATOR
```

## Example usage

```






```