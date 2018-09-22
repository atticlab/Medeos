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
      void regdoctor(account_name account, const string& name, const string& hospital, const string& speciality) {
        require_auth(account);
        
        eosio_assert( doctors.find(account) == doctors.end(), "account already registered as a doctor" );

        //TODO: validate name is not already been used
        doctors.emplace(account, [&](auto& d) {
          d.account  = account;
          d.name     = name;
          d.hospital = hospital;
          d.speciality = speciality;
          d.approved = 0;
        });
      }

      //@abi action
      void approvedoc(account_name doc) {
        require_auth(_self);
        
        auto doc_itr = doctors.find(doc);
        eosio_assert( doc_itr != doctors.end(), "doctor not found!");
        doctors.modify( doc_itr, 0, [&]( auto& doc ) {
          doc.approved = 1;
        });
      }

      //@abi action 
      void addrecord(account_name doc, public_key rid, string data) {

        auto doc_itr = doctors.find(doc);
        eosio_assert( doc_itr != doctors.end() && doc_itr->approved != 0, "doctor not found!");

        require_auth(doc_itr->account);

        auto rid_idx = records.template get_index<N(rid)>();
        auto ritr = rid_idx.find( record::get_key256_from_pubkey(rid) );
        eosio_assert( ritr == rid_idx.end(), "record pubkey already used" );

        records.emplace(_self, [&](auto& r) {
          r.id         = records.available_primary_key();
          r.doctor     = doc_itr->account;
          r.data       = data;
          r.rid        = rid;
          r.created_at = current_time();
        });
      }

      //@abi action 
      void debugclean() {
        require_auth(_self);
        auto itr = doctors.begin();
        while(itr != doctors.end()) {
          doctors.erase(itr++);
        }

        auto ritr = records.begin();
        while(ritr != records.end()) {
          records.erase(ritr++);
        }
      }

  protected:

      //@abi table doctor i64
      struct doctor {
        account_name account;
        string       name;
        string       hospital;
        string       speciality;
        uint64_t     approved = 0;

        uint64_t primary_key() const { return account; }
        string by_name() const { return name; }
        EOSLIB_SERIALIZE(doctor, (account)(name)(hospital)(speciality)(approved))
      };

      eosio::multi_index<N(doctor), doctor> doctors;

      //@abi table record i64
      struct record {
        uint64_t     id;
        account_name doctor;
        string       data;
        public_key   rid;
        uint64_t     created_at;

        uint64_t primary_key()const { return id; }
        key256 by_rid()const { return get_key256_from_pubkey(rid); }

        static key256 get_key256_from_pubkey(const public_key& pub) {
          const uint64_t *p64 = reinterpret_cast<const uint64_t *>(&pub.data[0]+1);
          return key256::make_from_word_sequence<uint64_t>(p64[0], p64[1], p64[2], p64[3]);
        }

        EOSLIB_SERIALIZE(record, (id)(doctor)(data)(rid)(created_at))
      };

      eosio::multi_index<N(record), record,
        indexed_by<N(rid), const_mem_fun<record, key256, &record::by_rid>>
      > records;
};

EOSIO_ABI( medeos, (regdoctor)(approvedoc)(addrecord)(debugclean) )