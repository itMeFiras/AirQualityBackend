const router = require("express").Router();
const Node = require("../models/node");

//MQTT Broker connection parameters
const mqtt = require('mqtt')  // require mqtt
const host = /*'broker.emqx.io'*/ 'eu1.cloud.thethings.network'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

//MQTT connect function
const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: /*'emqx'*/ 'lora-esp-32@ttn',
  password: /*'public'*/'NNSXS.BQRZDOH6LTPUP44WTWJFQKA2FIPCYX6WSTF2D5Y.3EAPYT7BVC2TBOWNT3HUI65DW76MRFWKPPX3SGUHOVJUJC5JXHNQ',
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
    console.log(data)
    console.log(data.uplink_message.decoded_payload)
    console.log(data.uplink_message.received_at)

    //create new node for the data
    const newNode = new Node({
      MAC: 'fablab-mac',
      co2: data.uplink_message.decoded_payload.co2,
      light: data.uplink_message.decoded_payload.light,
      pm10: data.uplink_message.decoded_payload.pm10,
      pm25: data.uplink_message.decoded_payload.pm25,
      pressure: data.uplink_message.decoded_payload.pressure,
      sound: data.uplink_message.decoded_payload.sound,
      temperature: data.uplink_message.decoded_payload.temperature,
      tvoc: data.uplink_message.decoded_payload.tvoc,
      received_at:data.uplink_message.received_at
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

//get last data of node by mac
router.get("/lastmacdata",async (req,res)=>{
  const node = await Node.find({MAC:req.body.MAC}).sort({$natural: -1}).limit(1);
  res.status(200).json(node)
});

module.exports = router