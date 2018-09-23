

 /** Transactions are only valid on the selected chain. */
  

//   config = {
//   chainId: null, // 32 byte (64 char) hex string
//   keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
//   httpEndpoint: 'http://127.0.0.1:8888',
//   expireInSeconds: 60,
//   broadcast: true,
//   verbose: false, // API activity
//   sign: true
// }




eosDoc.contract(conf.contract)
  .then(c => c.regdoctor({
      "account": "medeosdocto1",
      "name": "A good doctor",
      "speciality": "Family doctor",
      "hospital": "The Royal London Hospital"
   })
  .then(res => console.log("result", result)))
  .catch(err=>console.log)

doc_id = ???


aMedicalRecord = "A patient was just born and he is in a perfect health. Congrats!"






// exit(0)

const masterPrivateKey = eoscob.fromMasterSeed('patients_top_secret_master_seed');
const mpk = masterPrivateKey.getPublicExtendedKey();
const readonlyMasterPublicKey = eoscob.fromExtendedKey(mpk);
const pubkey = masterPrivateKey.getPublicKey(); 
console.log("pubkey:", pubkey);

const derivationPath = "m/44'/196'/0'/0/0";

const derivedPubKey = readonlyMasterPublicKey.deriveChild(derivationPath);
console.log("derivedPubKey:", derivedPubKey.getPublicKey());
const derivedPrivKey = masterPrivateKey.deriveChild(derivationPath);
console.log("pubkey of derivedPrivKey:", derivedPrivKey.getPublicKey());
// console.log("pub:",derivedPubKey);
// console.log("priv:",derivedPrivKey);

data = "ateasfasd fst data"
console.log("original data:", data);


doctorsPrivateKey=ecc.PrivateKey.fromSeed('someone')
doctorsPublicKey=doctorsPrivateKey.toPublic()

encryptedMessage = ecc.Aes.encrypt(doctorsPrivateKey, derivedPubKey.getPublicKey(), data)
console.log("encryptedMessage: ", encryptedMessage)
message = ecc.Aes.decrypt(derivedPrivKey.getPrivateKey(), doctorsPublicKey,
  encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);

console.log("result message:", message.toString());


////////////////////
aMedicalRecord = "A patient was just born and he is in a perfect health. Congrats!"


patientsXpub = "xpub661MyMwAqRbcH2Z5RtM6ydu98YudxiUDTaBESx9VgXpURBCDdWGezitJ8ormADG6CsJPs23fLmaeLp8RJgNvFo6YJkGhpXnHusCkRhGZdqr"

theNextDerivationId = 1;

derivationPath = "m/44'/196'/0'/0/"+theNextDerivationId;


masterPublicKey = eoscob.fromExtendedKey(patientsXpub);
derivedPubKey = masterPublicKey.deriveChild(derivationPath);
console.log("derivedPubKey:", derivedPubKey.getPublicKey());




doctorsPrivateKey=ecc.PrivateKey.fromSeed('someone')
doctorsPublicKey=doctorsPrivateKey.toPublic()
encryptedMessage = ecc.Aes.encrypt(doctorsPrivateKey, derivedPubKey.getPublicKey(), aMedicalRecord)
simple = JSON.stringify({ nonce: encryptedMessage.nonce, message: encryptedMessage.message.toString("base64"), checksum: encryptedMessage.checksum })
console.log("encryptedMessage:",simple)



// message = ecc.Aes.decrypt(derivedPrivKey.getPrivateKey(), doctorsPublicKey,
//   encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);

// console.log("result message:", message.toString());

 
record = {"doc":"medeosdocto1","rid":derivedPubKey.getPublicKey(),"data": simple }



eosDoc.contract('medeos111111').then(medeos111111 => medeos111111.addrecord(record).then(res => console.log("result", result))).catch(err=>console.log)