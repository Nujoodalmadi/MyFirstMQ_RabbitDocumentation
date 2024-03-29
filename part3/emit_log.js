var amqp = require("amqplib/callback_api");
// deliver a sinle  message to multiple consumers "publish/subscribe" pattern.

amqp.connect("amqp://localhost", function(err, connection) {
  if (err) {
    throw err;
  }
  connection.createChannel(function(err, channel) {
    if (err) {
      throw err;
    }
    var exchange = "logs";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";
    // exchange of type "fanout", named "logs"
    channel.assertExchange(exchange, "fanout", { durable: false });
    // Publish "logs" to exchange. The empty string means that we don't want to send the message to any specific queue.
    // We need to supply a routing key when sending, but its value is ignored for fanout exchanges.
    channel.publish(exchange, "", Buffer.from(msg));
    // create a non-durable queue with a random name generated by Rabbit server
    // When the connection closes, the queue will be deleted because it is declared as exclusive
    channel.assertQueue("", {
      exclusive: true
    });
    //tell our "logs" exchange to append messages to our queue via binding
    // channel.bindQueue(queue name here, "logs", "");
  });
  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});
