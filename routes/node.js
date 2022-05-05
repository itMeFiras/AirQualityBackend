//this route is for testing 
const router = require("express").Router();
const Node = require("../models/node");

//MQTT Broker connection parameters
const mqtt = require('mqtt')  // require mqtt
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

//MQTT connect function
const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

//Subscribe to topics
const topic = '/nodejs/mqtt'
client.on('connect', () => {
  console.log('1--mqtt Connected')
  client.subscribe([topic], () => {
    console.log(`2--Subscribe to topic '${topic}'`)
  })
})

//Publish messages
client.on('connect', () => {
    client.publish(topic, 'this is a publishing test xD', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })

//receiving the message
client.on('message', (topic, payload) => {
    console.log('#--Received Message:', topic, payload.toString())
  })

//add node
router.post("/",async (req,res)=>{
    const newNode = new Node(req.body);
    try{
        const savedNode = await newNode.save();
        res.status(200).json(savedNode);
    }catch(err){
        res.status(500).json(err) 
    }
});

module.exports = router