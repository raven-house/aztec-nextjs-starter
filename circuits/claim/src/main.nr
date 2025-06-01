use dep::aztec::macros::aztec;

#[aztec]
pub contract Claim {
  use dep::aztec::{
    history::note_inclusion::ProveNoteInclusion,
    macros::{functions::{initializer, private, public}, storage::storage},
    note:: {
      note_interface::NoteHash, retrieved_note::RetrievedNote,
      utils::compute_note_hash_for_nullify,
    },
    protocol_types::address::AztecAddress,
    state_vars::PublicImmutable
  };
  use dep::uint_note::uint_note::UintNote;
  use crowdfunding::Crowdfunding;
  use token::Token;

  #[storage]
  struct Storage<Context> {
    target_contract: PublicImmutable<AztecAddress, Context>,
    reward_token: PublicImmutable<AztecAddress, Context>
  }
}
