// import ecc from 'eosjs-ecc';
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
				return eosDoc.contract(Config.contract)
					.then(c => c.addrecord({
						"doc": Config.doctorName,
						"docid": this.getNextId(), 
						"data": data
					}));
            },
            getRecords: function(masterPubKey) {

            }

            // encode
            // decode
        }
    }
};

export default Eosio;