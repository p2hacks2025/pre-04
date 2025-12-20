// 古い待機ユーザーと、終了した部屋を削除する関数
const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();

exports.cleanupOldData = onSchedule("every 10 minutes", async (event) => {
  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  const tenMinutesAgo = new Date(now.toMillis() - 10 * 60 * 1000);

  // 10分以上前の待機データを削除
  const oldQueue = await db.collection("waiting_queue")
      .where("createdAt", "<", tenMinutesAgo).get();

  const batch = db.batch();
  oldQueue.forEach((doc) => batch.delete(doc.ref));

  await batch.commit();
  console.log(`Deleted ${oldQueue.size} old docs.`);
});
