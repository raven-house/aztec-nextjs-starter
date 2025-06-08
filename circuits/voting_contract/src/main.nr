use dep::aztec::macros::aztec;

#[aztec]
pub contract Voting {
    use dep::aztec::macros::{
        functions::{initializer, internal, private, public, utility},
        storage::storage,
    };
    use dep::aztec::keys::getters::get_public_keys;
    use dep::aztec::prelude::{AztecAddress, Map, PublicImmutable, PublicMutable};
    use dep::aztec::protocol_types::traits::{ToField, Hash};

    #[storage]
    struct Storage<Context> {
        admin: PublicMutable<AztecAddress, Context>,
        tally: Map<Field, PublicMutable<Field, Context>, Context>,
        vote_ended: PublicMutable<bool, Context>,
    }

    #[public]
    #[initializer]
    fn constructor(admin: AztecAddress) {
        storage.admin.write(admin);
        storage.vote_ended.write(false);
    }

    #[utility]
    unconstrained fn get_vote(candidate: Field) -> Field {
      storage.tally.at(candidate).read()
    }

    #[public]
    fn end_vote() {
      let caller = context.msg_sender();
      let admin = storage.admin.read();
      assert(admin.eq(caller), "Only admin can end votes");
    }

    #[public]
    #[internal]
    fn add_to_tally_public(candidate: Field) {
      assert(storage.vote_ended.read() == false, "Voting already ended");
      let new_tally = storage.tally.at(candidate).read() + 1;
      storage.tally.at(candidate).write(new_tally);
    }

    #[private]
    fn cast_vote(candidate: Field) {
      let msg_sender_npk_m_hash = get_public_keys(context.msg_sender()).npk_m.hash();
      let secret = context.request_nsk_app(msg_sender_npk_m_hash);
      let nullifier = std::hash::pedersen_hash([context.msg_sender().to_field(), secret]);
      context.push_nullifier(nullifier);
      Voting::at(context.this_address()).add_to_tally_public(candidate).enqueue(&mut context);
    }
}
