import ecc from 'eosjs-ecc';
import eosjs from 'eosjs';
// import eos from "@cobo/eos";
import Config from '../../config'

const Eosio = {
    install(Vue) {
        var eosDoc = eosjs({
            chainId: Config.chain.kylin,
            keyProvider: Config.keyProvider,
            httpEndpoint: Config.httpEndpoint,
            authorization: Config.authorization,
        });

        Vue.eosio = Vue.prototype.$eosio = {
            _records: [],
            _id: 0,
            addRecord: function(data) {
                var pubKey = this.getPublicForID(Config.patientXpub, this._id)
                var msg = this.encrypt(data, pubKey);

				return eosDoc.contract(Config.contract)
					.then(c => c.addrecord({
                        doc:Config.doctorName,
                        rid:pubKey,
                        data: JSON.stringify(msg)
                    }));
            },
            getRecords: function() {
              return eosDoc.getTableRows({
                json:true, 
                scope: Config.contract,
                code: Config.contract, 
                table: "record", 
                limit:1000, 
                key_type: "sha256", 
                index_position:2
            }).then(res => { 
                var theNextDerivationId = 1
                var allrecords = {}
                for (var i = 0; i < res.rows.length; i++) {
                      try{
                          var rec = {
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
                     var pubKey = this.getPublicForID(Config.patientXpub, theNextDerivationId)
                     if (!!allrecords[pubKey]){
                        var record = allrecords[pubKey]
                        record.index = theNextDerivationId
                        records.push(record)
                     } else{
                      break
                     }
                   }

                this._records = records,
                this._id = theNextDerivationId;

                return this.returnRecords();
              })
            },
            
            returnRecords: function() {
                return {records: this._records, nextDerivationId: this._id};
            },

            encrypt: function(data, publicKey) {
                var p = ecc.PrivateKey.fromString(Config.encryptionKey)

                var encryptedMessage = ecc.Aes.encrypt(p, publicKey, JSON.stringify(data))
                return {
                    nonce: encryptedMessage.nonce.toString(),
                    message: encryptedMessage.message.toString("base64"), 
                    checksum: encryptedMessage.checksum
                };
            },

            decrypt: function(data, privateKeyStr){
                try {
                    var p = ecc.PrivateKey.fromString(Config.encryptionKey)
                    var obj = JSON.parse(data)
                    var encryptedMessage = { nonce:obj.nonce, message: Buffer.from(obj.message,"base64"), checksum: obj.checksum }
                    var message = ecc.Aes.decrypt(privateKeyStr, p.toPublic().toString(), encryptedMessage.nonce, encryptedMessage.message, encryptedMessage.checksum);
                } catch(e) {
                    console.log(e);
                }

                return message.toString()
            },

            getPrivateForSeed: function(masterSeed, id){
                 masterPrivateKey = eoscob.fromMasterSeed(masterSeed);
                 derivationPath = getDerivationPathForID(id);
                 return masterPrivateKey.derivePath(derivationPath).getPrivateKey();
            },

            getPublicForID: function(extendedKey, id){
                 masterPublicKey = eoscob.fromExtendedKey(extendedKey);
                 derivationPath = getDerivationPathForID(id);
                 return masterPublicKey.derivePath(derivationPath).getPublicKey();
            },
        }
    }
};

export default Eosio;
