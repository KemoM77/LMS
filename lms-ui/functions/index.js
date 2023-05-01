const functions = require("firebase-functions");
const faker = require('@faker-js/faker');
const admin = require('firebase-admin')
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//

admin.initializeApp();

const createFakeBook = () => {
  const title = faker.faker.commerce.productName()+' book';

  const genres = [
    "Adventure",
    "Biography",
    "Children's",
    "Crime",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Mystery",
    "Non-fiction",
    "Romance",
    "Science Fiction",
    "Thriller",
    "Young Adult"
  ];
  
  const languageCodes = [
    'any', 'af', 'sq', 'am', 'ar', 'an', 'hy', 'ast', 'az', 'eu', 'be', 'bn', 'bs', 'br', 'bg', 'ca', 'ckb', 'zh', 'zh-HK', 'zh-CN',
     'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'en-AU', 'en-CA', 'en-IN', 'en-NZ', 'en-ZA', 'en-GB', 'en-US', 'eo', 'et', 'fo', 'fil', 'fi', 'fr', 'fr-CA',
      'fr-FR', 'fr-CH', 'gl', 'ka', 'de', 'de-AT', 'de-DE', 'de-LI', 'de-CH', 'el', 'gn', 'gu', 'ha', 'haw', 'he', 'hi', 'hu', 'is', 'id', 'ia', 'ga', 'it', 'it-IT', 
      'it-CH', 'ja', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'ln', 'lt', 'mk', 'ms', 'ml', 'mt', 'mr', 'mn', 'ne', 'no', 'nb', 'nn', 'oc', 'or', 'om',
       'ps', 'fa', 'pl', 'pt', 'pt-BR', 'pt-PT', 'pa', 'qu', 'ro', 'mo', 'rm', 'ru', 'gd', 'sr', 'sh', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'st', 'es', 'es-AR', 
       'es-419', 'es-MX', 'es-ES', 'es-US', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'ti', 'to', 'tr', 'tk', 'tw', 'uk', 'ur', 'ug', 'uz', 'vi', 'wa', 'cy', 
       'fy', 'xh', 'yi', 'yo', 'zu'
  ];

  return {
    id: faker.faker.finance.bitcoinAddress(),
    title: title,
    published: faker.faker.date.past().getFullYear(),
    authors: [faker.faker.name.fullName()],
    isbn: faker.faker.random.numeric(10),   //({min: 1000000000, max: 9999999999}),
    isbn13: faker.faker.random.numeric(13),
    categories: [genres[Math.round(Math.random() * 13)],genres[Math.round(Math.random() * 13)]],
    borrowable: true,
    sellable: faker.faker.datatype.boolean(),
    language: languageCodes[Math.round(Math.random() * 161)],
    location: faker.faker.hacker.abbreviation(),
    pages: parseInt(faker.faker.random.numeric(4))%1000+30,
    cover_img: `${faker.faker.image.imageUrl(500,750)}?random=${Math.round(Math.random() * 1000)}`,
    description: faker.faker.commerce.productDescription(),
    in_stock: parseInt(faker.faker.random.numeric(3))%30,
    price: parseFloat(faker.faker.commerce.price()),
    searchableTerms: [' '],
  };
};

function getSubstrings(str) {
    const substrings = [];

    for (let i = 0; i < str.length; i++) {
      for (let j = i + 1; j <= str.length; j++) {
        substrings.push(str.slice(i, j).toLowerCase());
      }
    }

    return substrings;
  }



exports.createBookEveryHour = functions.pubsub.schedule("every 10 minutes").onRun(async () => {
  

    const newBook = createFakeBook();
    newBook.searchableTerms = getSubstrings(newBook.title);
    newBook.authors.forEach((author) => {
      newBook.searchableTerms.push(...getSubstrings(author));
    });
    newBook.searchableTerms.push(...[''+newBook.isbn,''+newBook.isbn13])
    newBook.categories.forEach((cat)=>{
      newBook.searchableTerms.push(`cat#${cat.toLowerCase()}`);
  })    
    try {
      await admin.firestore().collection("books").doc(newBook.id).set(newBook);
      console.log("New book added successfully:", newBook.title);
    } catch (error) {
      console.error("Error adding new book:", error);
    }
  });