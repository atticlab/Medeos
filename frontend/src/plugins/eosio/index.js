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
            getNextId: function(){
                return 1;
            },
            addRecord: function(data) {
                var msg = this.encrypt(data, Config.doctorPriv);

                console.log(msg)

				// return eosDoc.contract(Config.contract)
					// .then(c => c.addrecord({
                        // doc:Config.doctorName,
                        // rid:derivedPubKey.getPublicKey(),
                        // data: JSON.stringify(msg)
                    // }));
            },
            getRecords: function(masterPubKey) {

            },
            encrypt: function(data, privateKey) {
                /*var priv = ecc.PrivateKey.fromSeed(privateKey);
                var pub  = priv.toPublic();

                var encryptedMessage = ecc.Aes.encrypt(priv, derivedPubKey.getPublicKey(), JSON.stringify(data))
                return {
                    nonce: encryptedMessage.nonce.toString(),
                    message: encryptedMessage.message.toString("base64"), 
                    checksum: encryptedMessage.checksum
                };*/
            }
            // decode
        }
    }
};

export default Eosio;