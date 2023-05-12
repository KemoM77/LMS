import '@testing-library/jest-dom';
const { Crypto } = require('@peculiar/webcrypto');
const crypto = new Crypto();
global.crypto = crypto;
global.crypto.subtle = crypto.subtle;