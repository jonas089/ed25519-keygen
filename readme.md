# Rare key generator for Ed25519

## Estimate the complexity of your key

```
ts-node generator.ts -ep estimate -suffix YOUR_SUFFIX_MAX_LEN_64_DIGITS

```

## Generate your key with limit

```
ts-node generator.ts -ep generate -suffix YOUR_SUFFIX_MAX_LEN_64_DIGITS -limit MAXIMUM_ATTEMPTS_FOR_THE_GENERATOR
```
