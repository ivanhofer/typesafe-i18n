A lightweight localization engine for JavaScript and TypeScript projects with no external dependencies.

## Overview

 - lightweigt (core is only 765 bytes gzipped)
 - fully typesafe (if you want)
 - supports plural rules
 - allows formatting of values e.g. locale-dependent date or number formats
 - code-splittable

## Install

```
$ npm install --save langauge
```

## Usage

#### basic:
```
const WELCOME_EN = 'Welcome to my site'
const WELCOME_DE = 'Willkommen auf meiner Seite'

L(WELCOME_EN) => 'Welcome to my site'
L(WELCOME_DE) => 'Willkommen auf meiner Seite'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### with variables:
```
const APPLES = '{0} apples'

L(APPLES, 12) => '12 apples'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### multiple variables:
```
const FRUITS = '{0} apples and {1} bananas'

L(FRUITS, 3, 7) => '3 apples and 7 bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### with keyed variables:
```
const FRUITS = '{nrOfApples} apples and {nrOfBananas} bananas'

L(FRUITS, { nrOfApples: 3, nrOfBananas: 7 }) => '3 apples and 7 bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### plural:
```
const APPLES = '{nrOfApples} {{apple|apples}}'

L(APPLES, { nrOfApples: 1 }) => 1 apple
L(APPLES, { nrOfApples: 2 }) => 2 apples
```

<!-- ------------------------------------------------------------------------------------------ -->

#### plural (short version):
```
const APPLES = '{nrOfApples} apple{{s}}'

L(APPLES, { nrOfApples: 0 }) => '0 apples'
L(APPLES, { nrOfApples: 1 }) => '1 apple'
L(APPLES, { nrOfApples: 5 }) => '5 apples'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### formatters:
```
const TODAY_EN = 'Today is {date|weekday}'
const TODAY_DE = 'Heute ist {date|weekday}'

const now = Date.now()

L(TODAY_EN, { date: now }) => 'Today is Friday'
L(TODAY_DE, { date: now }) => 'Heute ist Freitag'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### typesafe arguments:
```
const HI = 'Hello {name}'

L(HI) => ERROR: Expected 1 arguments, but got 0.
L(HI, 'John', 'Jane') => ERROR: Expected 1 arguments, but got 2.
L(HI, 'John') => 'Hi John'
```

<!-- ------------------------------------------------------------------------------------------ -->

#### typesafe variables:
```
const HI = 'Hello {name:string}'

L(HI, 'John') => ERROR: Argument of type 'string' is not assignable to parameter of type '{ name: string; }'.
L(HI, { name: 'John' }) => 'Hi John'
```

### folder structure

## Environments

### nodeJS

### svelte

### sapper

### browser
