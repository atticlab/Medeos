   // install yarn add @cobo/eos
   // npm install eosjs
   // npm install eosjs-ecc
  

   const ecc = require("eosjs-ecc");
   Eos = require('eosjs')

   const eoscob = require("@cobo/eos");
   // Base58 = require("base-58");

 /** Transactions are only valid on the selected chain. */
  chain = {
    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
    jungle: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // jungle testnet
    sys: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // local developer\
    kylin: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
  }

//   config = {
//   chainId: null, // 32 byte (64 char) hex string
//   keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
//   httpEndpoint: 'http://127.0.0.1:8888',
//   expireInSeconds: 60,
//   broadcast: true,
//   verbose: false, // API activity
//   sign: true
// }

// Doctor's access 

  eosDoc = Eos({
    keyProvider: '5JidLwMkDbMh9iMXXq445SZkAAuDao9rj9twKvoDWqxQWJreaP6',// private key
    httpEndpoint: 'https://api.kylin-testnet.eospacex.com',
    chainId: chain.kylin,
    authorization: 'medeosdocto1@active',
  });


// Doctor's access 
  eosMaster= Eos({
    keyProvider: '5Jxzpc2aYRu2sWSUGZa57yK7s3Ba8fS9JgpmTRGkPniXmGtwffX',// private key
    httpEndpoint: 'https://api.kylin-testnet.eospacex.com',
    chainId: chain.kylin,
    authorization: 'medeos111111@active',
  });


function decryptARecord(data, privateKeyStr, doctorsPublicKeyStr){
try{
       obj = JSON.parse(data)
       
      encryptedMessage = { nonce:obj.nonce, message: Buffer.from(obj.message,"base64"), checksum: obj.checksum }
      message = ecc.Aes.decrypt(privateKeyStr, doctorsPublicKeyStr,
            encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);
    message = message.toString()
    return message
}
catch(err) {console.log(err)}
}


function getDerivationPathForID(theNextDerivationId){
  return "m/"+theNextDerivationId;
}


function getPublicForID(masterPublicKey, theNextDerivationId){
  derivationPath = getDerivationPathForID(theNextDerivationId); 
  return masterPublicKey.derivePath(derivationPath).getPublicKey();
}



function getAllRecordsAndNextDerivationID(masterPublicKey){
  return eosDoc.getTableRows({json:true, scope: "medeos111111", code: "medeos111111", table: "record", limit:1000, key_type:"sha256", index_position:2/*, upper_bound: upperBound, lower_bound: rawKey*/})
  .then(res => { 
    theNextDerivationId = 1
    var allrecords = {}
    for (var i = 0; i < res.rows.length; i++) {
      try{
         rec = {
          doctor: res.rows[i].doctor, 
          created_at: res.rows[i].created_at,
          rid : res.rows[i].rid,
          data:res.rows[i].data
          }
          allrecords[rec.rid] = rec
         }
         catch(err) {console.log(err)}
   }

   var records = []
   for (; theNextDerivationId < 100000; theNextDerivationId++) {
     pubKey = getPublicForID(masterPublicKey, theNextDerivationId)
     if (!!allrecords[pubKey]){
        var record = allrecords[pubKey]
        record.index = theNextDerivationId
        records.push(record)
     } else{
      break
     }
   }
  return {records: records, nextDerivationId: theNextDerivationId}

  })
}

function decryptRecord(record, privateKey, doctorsPublicKey){
  record.data = decryptARecord(record.data, privateKey, doctorsPublicKey)
  return record
}

function getPrivateForID(masterSeed, id){
  masterPrivateKey = eoscob.fromMasterSeed(masterSeed);
  derivationPath = getDerivationPathForID(theNextDerivationId); 
  return masterPrivateKey.derivePath(derivationPath).getPrivateKey();
}


masterSeed = 'patients_top_secret_master_seed';


patientsXpub = "xpub661MyMwAqRbcH2Z5RtM6ydu98YudxiUDTaBESx9VgXpURBCDdWGezitJ8ormADG6CsJPs23fLmaeLp8RJgNvFo6YJkGhpXnHusCkRhGZdqr"// const mpk = eoscob.fromMasterSeed(masterSeed).getPublicExtendedKey();
masterPublicKey = eoscob.fromExtendedKey(patientsXpub);
getAllRecordsAndNextDerivationID(masterPublicKey)
  .then(r => console.log("r",r))
  .catch(e => console.log('err', e))






// eosDoc.contract('medeos111111').then(medeos111111 => medeos111111.regdoctor({"account":"medeosdocto1","name":"A good doctor", "speciality": "Family doctor", "hospital":"The Royal London Hospital"}).then(res => console.log("result", result))).catch(err=>console.log)

// eosMaster.contract('medeos111111').then(medeos111111 => medeos111111.approvedoc({doc:"medeosdocto1"}).then(res => console.log("result", res))).catch(err=>console.log("some problem occured", err))


// console.log("keyProvider:", eosDoc.keyProvider)

// // doc_id = ???


// aMedicalRecord = {examination: "A patient was just born and he is in a perfect health. Congrats!"}
// aMedicalRecord = JSON.stringify(aMedicalRecord)


// patientsXpub = "xpub661MyMwAqRbcH2Z5RtM6ydu98YudxiUDTaBESx9VgXpURBCDdWGezitJ8ormADG6CsJPs23fLmaeLp8RJgNvFo6YJkGhpXnHusCkRhGZdqr"

// theNextDerivationId = 1;

// derivationPath = "m/"+theNextDerivationId;

// console.log("derivedPubKey:", derivationPath)
// masterPublicKey = eoscob.fromExtendedKey(patientsXpub);
// derivedPubKey = masterPublicKey.derivePath(derivationPath);
// console.log("derivedPubKey:", derivedPubKey.getPublicKey());




// doctorsPrivateKey=ecc.PrivateKey.fromSeed('someone')
// doctorsPublicKey=doctorsPrivateKey.toPublic()
// encryptedMessage = ecc.Aes.encrypt(doctorsPrivateKey, derivedPubKey.getPublicKey(), aMedicalRecord)
// simple = JSON.stringify({ nonce: encryptedMessage.nonce.toString(), message: encryptedMessage.message.toString("base64"), checksum: encryptedMessage.checksum })
// console.log("encryptedMessage:",simple)



// // message = ecc.Aes.decrypt(derivedPrivKey.getPrivateKey(), doctorsPublicKey,
// //   encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);

// // console.log("result message:", message.toString());

 
// record = {doc:"medeosdocto1",rid:derivedPubKey.getPublicKey(),data: simple }



// // eosDoc.contract('medeos111111').then(medeos111111 => medeos111111.addrecord(record).then(res => console.log("result", res))).catch(err=>console.log("some problem occured", err))




// //get record 

// // curl https://api-kylin.eosasia.one/v1/chain/get_table_rows \
// //   -X POST \
// //   -d '{ "json" : true, "code":"medeos111111", "scope":"medeos111111", "table":"record", "key_type":"sha256", "index_position":2, "limit":1, "upper_bound":"f459061974c976fe554dcbdb50617ee0cacaccdd7c3310d98cc0afbf9da904f0"}'


// rawKey = derivedPubKey.getPublicKey();
// rawKey = "EOS6k6tWftQVNH6hJcJ1nyYdGuFgeNQrXGiNUCWQtxm8Nu8GYb4un"
// // console.log("original raw key:", rawKey)
// // console.log("truncated raw key:", rawKey.substr(3))

// // var decoded = Base58.decode(rawKey.substr(3));
// // console.log("decoded:", decoded)
// // console.log("decoded.elngth:", decoded.length)
// // decoded = decoded.slice(1, decoded.length - 4)
// // console.log("decoded2.elngth:", decoded.length)
// // console.log("decoded2.hex", Buffer.from(decoded).toString("hex"))
// rawKey = ecc.PublicKey(rawKey).toHex();
// rawKey = rawKey.substr(2);
// console.log("raw key:", rawKey)
// console.log("raw key len:", rawKey.length)
// upperBound = Buffer.from(rawKey, "hex")
// for (var i = upperBound.length - 1; i >= 0; i--) {
//         if (upperBound[i]++ !== 255) break;
//     }
//   upperBound = upperBound.toString("hex")
// console.log("upperBound key:", upperBound)


// // console.log("needLength:", "f459061974c976fe554dcbdb50617ee0cacaccdd7c3310d98cc0afbf9da904f0".length)





// masterPrivateKey = eoscob.fromMasterSeed('patients_top_secret_master_seed');
// derivedPrivKey = masterPrivateKey.derivePath(derivationPath);

// console.log("pubkey of derivedPrivKey:", derivedPrivKey.getPublicKey());
// // console.log("pub:",derivedPubKey);
// // console.log("priv:",derivedPrivKey);



// console.log("encryptedMessage message before:", encryptedMessage)
// message = ecc.Aes.decrypt(derivedPrivKey.getPrivateKey(), doctorsPublicKey,
//   encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);
// console.log("decrypted message before:", message)





// // rawKey = rawKey[3:]lower_bound: id, upper_bound: id+1
// // , lower_bound: upperBound, upper_bound: rawKey
// eosDoc.getTableRows({json:true, scope: "medeos111111", code: "medeos111111", table: "record", limit:1000, key_type:"sha256", index_position:2/*, upper_bound: upperBound, lower_bound: rawKey*/}).then(
//   res => { 
//     console.log("res:",res);
//     console.log("res.len:",res.rows.length);
//     for (var i = 0; i < res.rows.length; i++) {
//       console.log(res.rows[i])
//       try{
//        doc = res.rows[i].doctor
//        console.log("doc", doc)
//        created_at = res.rows[i].created_at
//        console.log("created_at", created_at)
//        rid = res.rows[i].rid
//        console.log("rid", rid)

//        message = decryptARecord(res.rows[i].data, derivedPrivKey.getPrivateKey(), doctorsPublicKey)
// console.log("decrypted message:", message)
// }
// catch(err) {console.log(err)}
//        // console.log("row:",row)
      
//     }
//     for (var i = 0; i < res.rows.length; i++) {
//       console.log("sdsdfsdfsdfsdfsd")
//       row = res.rows[i];
//        console.log("row:",row)
//        doc = row.doctor
//        created_at = row.created_at
//        rid = row.rid
//        obj = JSON.parse(row.data)
// encryptedMessage = { nonce: obj.nonce, message: Buffer.from(obj.message,"base64"), checksum: obj.checksum }

// message = ecc.Aes.decrypt(derivedPrivKey.getPrivateKey(), doctorsPublicKey,
//   encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);
// console.log("decrypted message:", message)

//     }
    
//     let row = res.rows[0]; console.log("row:",row)
//   }).catch(err=>console.log("err", err));

// // // exit(0)

// // const masterPrivateKey = eoscob.fromMasterSeed('patients_top_secret_master_seed');
// // const mpk = masterPrivateKey.getPublicExtendedKey(); //xpub661MyMwAqRbcH2Z5RtM6ydu98YudxiUDTaBESx9VgXpURBCDdWGezitJ8ormADG6CsJPs23fLmaeLp8RJgNvFo6YJkGhpXnHusCkRhGZdqr
// // console.log("mpk:",mpk)
// // const readonlyMasterPublicKey = eoscob.fromExtendedKey(mpk);
// // const pubkey = masterPrivateKey.getPublicKey(); 
// // console.log("pubkey:", pubkey);

// // const derivationPath = "m/44'/196'/0'/0/0";

// // const derivedPubKey = readonlyMasterPublicKey.derivePath(derivationPath);
// // console.log("derivedPubKey:", derivedPubKey.getPublicKey());
// // const derivedPrivKey = masterPrivateKey.derivePath(derivationPath);
// // console.log("pubkey of derivedPrivKey:", derivedPrivKey.getPublicKey());
// // // console.log("pub:",derivedPubKey);
// // // console.log("priv:",derivedPrivKey);

// // data = "ateasfasd fst data"
// // console.log("original data:", data);


// // doctorsPrivateKey=ecc.PrivateKey.fromSeed('someone')
// // doctorsPublicKey=doctorsPrivateKey.toPublic()

// // encryptedMessage = ecc.Aes.encrypt(doctorsPrivateKey, derivedPubKey.getPublicKey(), data)
// // console.log("encryptedMessage: ", encryptedMessage)
// // message = ecc.Aes.decrypt(derivedPrivKey.getPrivateKey(), doctorsPublicKey,
// //   encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);

// // console.log("result message:", message.toString());
