import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDG9QuzbN2Cvgip-87CShfx_a4zhuzqct0",
    authDomain: "nextjs-blog-77594.firebaseapp.com",
    projectId: "nextjs-blog-77594",
    storageBucket: "nextjs-blog-77594.appspot.com",
    messagingSenderId: "215721614349",
    appId: "1:215721614349:web:56c548906ca5d0a6624944",
    measurementId: "G-2EYVWY09RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider()
const auth = getAuth()


export const authWithGoogle = async () => {
    let user = null

    await signInWithPopup(auth, provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        user = result?.user
    }).catch((err) => {
        console.log(err);
    })

    return user
}