const functions = require("firebase-functions");
const faker = require('@faker-js/faker');
const admin = require('firebase-admin');
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
    addedAT:admin.firestore.Timestamp.now()
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



exports.createBook = functions.pubsub.schedule("every 24 hours").onRun(async () => {
  

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

// const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;
// const HOUR_IN_MILLISECONDS =  60 * 60 * 1000;

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

exports.deleteOldNotifications = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const usersRef = admin.firestore().collection('users');
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const usersSnapshot = await usersRef.get();
    if (usersSnapshot.empty) {
      console.log('No users found.');
      return null;
    }

    usersSnapshot.forEach(async (userDoc) => {
      const notificationsRef = userDoc.ref.collection('notifications');
      const oldNotificationsQuery = notificationsRef.where('createdAt', '<', oneMonthAgo);
      const oldNotificationsSnapshot = await oldNotificationsQuery.get();

      if (oldNotificationsSnapshot.empty) {
        console.log(`No old notifications found for user: ${userDoc.id}`);
        return null;
      }

      oldNotificationsSnapshot.forEach(async (notificationDoc) => {
        await notificationDoc.ref.delete();
        console.log(`Deleted old notification: ${notificationDoc.id} for user: ${userDoc.id}`);
      });
    });

  } catch (error) {
    console.error('Error deleting old notifications:', error);
  }
});


exports.cancelOldPendingRequests = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const systemRef = admin.firestore().collection('system');
  const usersRef = admin.firestore().collection('users');

  try {
    // Get the lifetime value from the 'requestsLifeTime' document
    const requestsLifeTimeDoc = await systemRef.doc('requestsLifeTime').get();
    const lifetimeHours = requestsLifeTimeDoc.data().lifetime;

    // Calculate the specific time based on the lifetime value
    const specificTime = new Date();
    specificTime.setHours(specificTime.getHours() - lifetimeHours);

    const usersSnapshot = await usersRef.get();

    if (usersSnapshot.empty) {
      console.log('No users found.');
      return null;
    }

    usersSnapshot.forEach(async (userDoc) => {
      const requestsRef = userDoc.ref.collection('requests');
      const oldPendingRequestsQuery = requestsRef.where('status', '==', 'PENDING').where('requestedAt', '<', specificTime);
      const oldPendingRequestsSnapshot = await oldPendingRequestsQuery.get();

      if (oldPendingRequestsSnapshot.empty) {
        console.log(`No old pending requests found for user: ${userDoc.id}`);
        return null;
      }

      oldPendingRequestsSnapshot.forEach(async (requestDoc) => {
        await requestDoc.ref.update({ status: 'CANCELED',managedBy: 'System', managedAt: admin.firestore.Timestamp.now() });
        console.log(`Canceled old pending request: ${requestDoc.id} for user: ${userDoc.id}`);
      });
    });

  } catch (error) {
    console.error('Error canceling old pending requests:', error);
  }
});

exports.cancelOldPendingRequests = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const systemRef = admin.firestore().collection('system');
  const usersRef = admin.firestore().collection('users');
  const booksRef = admin.firestore().collection('books');

  try {
    // Get the lifetime value from the 'requestsLifeTime' document
    const requestsLifeTimeDoc = await systemRef.doc('requestsLifeTime').get();
    const lifetimeHours = requestsLifeTimeDoc.data().lifetime;

    // Calculate the specific time based on the lifetime value in minutes
    const specificTime = new Date();
    specificTime.setMinutes(specificTime.getMinutes() - (lifetimeHours * 60));

    const usersSnapshot = await usersRef.get();

    if (usersSnapshot.empty) {
      console.log('No users found.');
      return null;
    }

    usersSnapshot.forEach(async (userDoc) => {
      const requestsRef = userDoc.ref.collection('requests');
      const oldPendingRequestsQuery = requestsRef.where('status', '==', 'PENDING').where('requestedAt', '<', specificTime);
      const oldPendingRequestsSnapshot = await oldPendingRequestsQuery.get();

      if (oldPendingRequestsSnapshot.empty) {
        console.log(`No old pending requests found for user: ${userDoc.id}`);
        return null;
      }

      oldPendingRequestsSnapshot.forEach(async (requestDoc) => {
        // Cancel the request
        await requestDoc.ref.update({ status: 'CANCELED', managedBy: 'System', managedAt: admin.firestore.Timestamp.now() });
        console.log(`Canceled old pending request: ${requestDoc.id} for user: ${userDoc.id}`);

        // Update the book's in_stock field
        const bookId = requestDoc.data().bookId;
        const bookDoc = await booksRef.doc(bookId).get();
        const currentInStock = bookDoc.data().in_stock;

        await booksRef.doc(bookId).update({ in_stock: currentInStock + 1 });
        console.log(`Updated in_stock for book: ${bookId}`);

        // Add a notification for the canceled request
        const notificationsRef = userDoc.ref.collection('notifications');
        const newNotification = {
          title: "Request was Dismissed",
          content: `Sorry, your request for (${requestDoc.data().bookName}) has been canceled, please review your requests.`,
          isRead: false,
          createdAt: admin.firestore.Timestamp.now(),
          id: admin.firestore().collection('_').doc().id,
        };

        await notificationsRef.doc(newNotification.id).set(newNotification);
        console.log(`Added notification for user: ${userDoc.id} regarding canceled request: ${requestDoc.id}`);
      });
    });

  } catch (error) {
    console.error('Error canceling old pending requests and updating book stock:', error);
  }
});














exports.deactivateExpiredSubscriptions = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  const usersRef = admin.firestore().collection('users');

  try {
    const currentTime = new Date();

    // Query for non-librarian users
    const nonLibrarianUsersQuery = usersRef.where('isLibrarian', '==', false).where('isActive', '==', true);
    const nonLibrarianUsersSnapshot = await nonLibrarianUsersQuery.get();

    if (nonLibrarianUsersSnapshot.empty) {
      console.log('No non-librarian users found.');
      return null;
    }

    nonLibrarianUsersSnapshot.forEach(async (userDoc) => {
      const validUntil = userDoc.data().valid_until.toDate();

      if (currentTime > validUntil) {
        // Update isActive to false if the current time is past the valid_until timestamp
        await userDoc.ref.update({ isActive: false });
        console.log(`Deactivated expired subscription for user: ${userDoc.id}`);

        // Add a new notification to the 'notifications' sub-collection
        const notification = {
          title: "Account suspended",
          content: "Your account has been suspended, please contact the library service to re-activate.",
          isRead: false,
          createdAt: admin.firestore.Timestamp.now(),
          id: admin.firestore().collection('_').doc().id,
        };

        await userDoc.ref.collection('notifications').doc(notification.id).set(notification);
        console.log(`Added suspension notification for user: ${userDoc.id}`);
      }
    });

  } catch (error) {
    console.error('Error deactivating expired subscriptions and adding notifications:', error);
  }
});

