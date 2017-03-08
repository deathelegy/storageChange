/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} The callback function.
 */

 // Imports the Google Cloud client library
 const PubSub = require('@google-cloud/pubsub');

 function publishMessage (topicName, data) {
   // Instantiates a client
   const pubsub = PubSub();

   // References an existing topic, e.g. "my-topic"
   const topic = pubsub.topic(topicName);

   // Publishes the message, e.g. "Hello, world!" or { amount: 599.00, status: 'pending' }
   return topic.publish(data)
     .then((results) => {
       const messageIds = results[0];

       console.log(`Message ${messageIds[0]} published.`);

       return messageIds;
     });
 }

exports.storageChange = function storageChange (event, callback) {
  const file = event.data;
  const isDelete = file.resourceState === 'not_exists';

  if (isDelete) {
    console.log(`File ${file.name} deleted.`);
    publishMessage("KaiTopic", {fileName:file.name, action:"delete"});
  } else {
    console.log(`File ${file.name} uploaded.`);
    publishMessage("KaiTopic", {fileName:file.name, action:"create"});
    console.log(`finish`);
  }

  callback();
};
