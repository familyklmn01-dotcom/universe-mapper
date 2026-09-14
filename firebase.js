const firebaseConfig = {
  apiKey: 'AIzaSyCdUzjBAgfNA7F3JOCfIqKZj8R5pMUwrbA',
  authDomain: 'universe-mapper.firebaseapp.com',
  projectId: 'universe-mapper',
  storageBucket: 'universe-mapper.firebasestorage.app',
  messagingSenderId: '820011932213',
  appId: '1:820011932213:web:44d380859f65111051af7c',
  measurementId: 'G-DL4T5SJPGQ',
}

let servicesPromise
export const isOnlineApp = () => location.protocol === 'http:' || location.protocol === 'https:'

export async function getFirebaseServices() {
  if (!isOnlineApp()) throw new Error('Online sign-in is available after deployment. Use Explore Demo for this offline preview.')
  if (!servicesPromise) servicesPromise = Promise.all([
    import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
    import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
    import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'),
  ]).then(([appSdk,authSdk,firestoreSdk])=>{
    const app=appSdk.getApps().length?appSdk.getApp():appSdk.initializeApp(firebaseConfig)
    return {app,auth:authSdk.getAuth(app),db:firestoreSdk.getFirestore(app),authSdk,firestoreSdk}
  })
  return servicesPromise
}

export { firebaseConfig }
