var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    // check error
    if (error1) {
      throw error1;
    }
    var queue = "task_queue";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    // create queue
    channel.assertQueue(queue, {
      durable: true
    });
    //this is a default or nameless exchange: messages are routed to the queue with the name specified as first parameter, if it exists.
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true
    });
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
