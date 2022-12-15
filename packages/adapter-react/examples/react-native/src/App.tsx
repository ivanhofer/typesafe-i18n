import React from 'react';
import TypesafeI18n from './i18n/i18n-react';
import {LocalizedComponent} from './LocalizedComponent';

// # 1. You must import required polyfills
import './polyfill';

// #2. You must patch your metro.config.js and add .cjs extensions
// metro.config.js (line 30)

export const App = () => {
  return (
    <TypesafeI18n locale={'en'}>
      <LocalizedComponent />
    </TypesafeI18n>
  );
};
