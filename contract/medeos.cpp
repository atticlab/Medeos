/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#include <eosiolib/eosio.hpp>

using namespace eosio;
using namespace std;

class medeos : public eosio::contract {
  public:
      medeos(account_name self) :
       eosio::contract(self),
       doctors(self, self),
       records(self, self) { }

      //@abi action
      void regdoctor(account_name account, const string& name) {
        require_auth(account);
        
        auto acct_idx = doctors.template get_index<N(account)>();
        eosio_assert( acct_idx.find(account) == acct_idx.end(), "account already registered as a doctor" );

        auto name_idx = doctors.template get_index<N(name)>();
        eosio_assert( name_idx.find(name) == name_idx.end(), "name in use" );

        doctors.emplace(account, [&](auto& d) {
          d.id       = doctors.available_primary_key();
          d.account  = account;
          d.name     = name;
          d.approved = 0;
        });
      }

      //@abi action
      void approvedoc(uint64_t docid) {
        require_auth(_self);
        
        auto doc_itr = doctors.find(docid);
        eosio_assert( doc_itr != doctors.end(), "doctor not found!");
        doctors.modify( doc_itr, 0, [&]( auto& doc ) {
          doc.approved = 1;
        });
      }

      //@abi action 
      void addrecord(uint64_t docid, checksum256 hash) {

        auto doc_itr = doctors.find(docid);
        eosio_assert( doc_itr != doctors.end() && doc_itr->approved != 0, "doctor not found!");

        require_auth(doc_itr->account);

        records.emplace(_self, [&](auto& r) {
          r.id       = doctors.available_primary_key();
          r.doctor   = doc_itr->account;
          r.hash     = hash;
        });
      }

      //@abi action 
      void debugclean() {
        require_auth(_self);
        auto itr = doctors.begin();
        while(itr != doctors.end()) {
          doctors.erase(itr++);
        }
      }

  protected:

      //@abi table doctor i64
      struct doctor {
        uint64_t     id;
        account_name account;
        string       name;
        uint64_t     approved = 0;

        uint64_t primary_key() const { return id; }
        account_name by_account_name() const { return account; }
        string by_name() const { return name; }
        EOSLIB_SERIALIZE(doctor, (id)(account)(name)(approved))
      };

      eosio::multi_index<N(doctor), doctor,
        indexed_by< N(account), const_mem_fun<doctor, account_name, &doctor::by_account_name > >,
        indexed_by< N(name), const_mem_fun<doctor, string, &doctor::by_name > >
      > doctors;

      //@abi table record i64
      struct record {
        uint64_t     id;
        account_name doctor;
        checksum256  hash;

        uint64_t primary_key() const { return id; }
        EOSLIB_SERIALIZE(record, (id)(hash))
      };

      eosio::multi_index<N(record), record> records;
};

EOSIO_ABI( medeos, (regdoctor)(approvedoc)(addrecord)(debugclean) )