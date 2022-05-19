const router = require("express").Router();
const Node = require("../models/node");

//MQTT Broker connection parameters
const mqtt = require('mqtt')  // require mqtt
const host = process.env.mqtthost
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

//MQTT connect function
const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.mqttuser,
  password: process.env.mqttpass,
  reconnectPeriod: 1000,
})

//Subscribe to topics
const topic = /*'/nodejs/mqtt'*/ '#'
client.on('connect', () => {
  console.log('1--mqtt Connected')
  client.subscribe([topic], () => {
    console.log(`2--Subscribe to topic '${topic}'`)
  })
})

//Publish messages
/*client.on('connect', () => {
    client.publish(topic, 'this is a publishing test xD', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })*/

//receiving the message
client.on('message',async (topic, payload) => {
    console.log('#--Received Message:', topic, payload.toString())
    console.log('-----------')
    var data = JSON.parse(payload.toString())
    console.log(data.end_device_ids.dev_addr)
    console.log(data.uplink_message.decoded_payload)
    console.log(data.uplink_message.received_at)

    //create new node for the data
    const newNode = new Node({
      MAC: data.end_device_ids.dev_addr,
      co2: data.uplink_message.decoded_payload.co2 || null,
      light: data.uplink_message.decoded_payload.light || null,
      pm10: data.uplink_message.decoded_payload.pm10 || null,
      pm25: data.uplink_message.decoded_payload.pm25 || null,
      pressure: data.uplink_message.decoded_payload.pressure || null,
      sound: data.uplink_message.decoded_payload.sound || null,
      temperature: data.uplink_message.decoded_payload.temperature || null,
      tvoc: data.uplink_message.decoded_payload.tvoc || null,
      received_at:data.uplink_message.received_at || null
    });

    //save and send response
    const node = await newNode.save();
    //res.status(200).json({node : node, messege:'saved '});
  })

//add node
router.post("/add",async (req,res)=>{
    const newNode = new Node(req.body);
    try{
        const savedNode = await newNode.save();
        res.status(200).json(savedNode);
    }catch(err){
        res.status(500).json(err) 
    }
});

//get node list
router.get("/list", async (req,res)=>{
  Node.find(function(err, list) {
      if (err) {
          return res.status(500).json(err);
      } else {
          return res.json(list);
      }
  });
});

//get node by mac
router.get("/macdata",async (req,res)=>{
  const node = await Node.find({MAC:req.body.MAC});
  res.status(200).json(node)
});

//sherch node by mac query params
router.get("/lastmacdata",async (req,res)=>{
  const node = await Node.find({MAC:req.query.MAC}).sort({$natural: -1}).limit(1);
  res.status(200).json(node)
});

//get last data of node by mac
router.get("/lastmacdata",async (req,res)=>{
  const node = await Node.find({MAC:req.body.MAC}).sort({$natural: -1}).limit(1);
  res.status(200).json(node)
});

module.exports = router