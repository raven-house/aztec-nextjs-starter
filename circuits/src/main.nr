mod config;

use dep::aztec::macros::aztec;

#[aztec]
pub contract Crowdfunding {
    use crate::config::Config;

    use dep::aztec::{
        event::event_interface::EventInterface,
        macros::{
            events::event,
            functions::{initializer, internal, private, public},
            storage::storage,
        },
        messages::logs::note::encode_and_encrypt_note,
        prelude::{AztecAddress, PrivateSet, PublicImmutable},
        protocol_types::traits::{Serialize, ToField},
        unencrypted_logs::unencrypted_event_emission::encode_event,
        utils::comparison::Comparator,
    };
    use dep::uint_note::uint_note::UintNote;
    use router::utils::privately_check_timestamp;
    use std::meta::derive;
    use token::Token;

    #[derive(Serialize)]
    #[event]
    struct WithdrawlProcessed {
        who: AztecAddress,
        amount: u128,
    }

    #[storage]
    struct Storage<Context> {
        config: PublicImmutable<Config, Context>,
        donation_receipts: PrivateSet<UintNote, Context>
    }

    #[public]
    #[initializer]
    fn init(donation_token: AztecAddress, operator: AztecAddress, deadline: u64) {
        storage.config.initialize(Config { donation_token, operator, deadline});
    }

    #[private]
    fn donate(amount: u128) {
        let config = storage.config.read();
        privately_check_timestamp(Comparator.LT, config.deadline, &mut context);

        let donor = context.msg_sender();
        Token::at(config.donation_token)
        .transfer_in_private(donor, context.this_address(), amount, 0).call(&mut context);

        let note = UintNote::new(amount, donor);
        storage.donation_receipts.insert(note).emit(encode_and_encrypt_note(&mut context, donor, donor));
    }

    #[private]
    fn withdraw(amount: u128) {
        let config = storage.config.read();
        let operator_address = config.operator;
        assert(context.msg_sender() == operator_address, "Not an operator");

        Token::at(config.donation_token).transfer(operator_address, amount).call(&mut context);
        Crowdfunding::at(context.this_address())._publish_donation_receipts(amount, operator_address).enqueue(&mut context);
    }

    #[public]
    #[internal]
    fn _publish_donation_receipts(amount: u128, to: AztecAddress) {
        WithdrawlProcessed {amount, who: to }.emit(encode_event(&mut context));
    }
}
