const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.createUser = functions.auth.user().onCreate((user) => {
  const domain = user.email.replace(/^.+@/gm, "");
  const _ = admin.firestore().collection("organization");
  const snapshot = _.where("domain", "==", domain).get();
  snapshot.then((snapshot) => {
    if (snapshot.empty) {
      console.info("No Organization");
      admin.firestore().collection("user").doc(user.uid).set({
        created: admin.firestore.FieldValue.serverTimestamp(),
      });
      return 0;
    }
    snapshot.forEach((doc) => {
      admin.firestore().collection("user").doc(user.uid).set({
        created: admin.firestore.FieldValue.serverTimestamp(),
        organization: doc.id,
      });
    });
  });
});
